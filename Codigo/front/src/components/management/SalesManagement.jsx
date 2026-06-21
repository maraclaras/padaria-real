import React, { useState, useMemo } from 'react';
import { useSales } from '../../hooks/useSales';
import { useProducts } from '../../hooks/useProducts';
import SalesTable from './SalesTable';
import SalesFormModal from './SalesFormModal';
import { Plus, DollarSign } from 'lucide-react';
import { formatCurrency, formatDateBR } from '../../App.jsx';
import { updateSale } from '../../services/api.js';
import './Management.css';
import { Pencil, Trash2 } from 'lucide-react';

function SalesManagement() {
  const { sales, loading, deleteSale, createNewSale } = useSales();
  const { products } = useProducts();

  const [showSalesModal, setShowSalesModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  // Estado para o filtro de data
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  // Converte data do input para timestamp em milissegundos
  const dateInputToTimestamp = (dateString) => {
    if (!dateString) return Date.now();

    // Usa meio-dia para evitar problema de fuso horário
    return new Date(`${dateString}T12:00:00`).getTime();
  };

  // Converte saleDate do backend para yyyy-mm-dd
  const saleDateToInputDate = (saleDate) => {
    if (!saleDate) return '';

    if (typeof saleDate === 'string') {
      return saleDate.substring(0, 10);
    }

    if (typeof saleDate === 'number') {
      return new Date(saleDate).toISOString().substring(0, 10);
    }

    return '';
  };

  // Filtra os registros com base na data selecionada
  const filteredRecords = useMemo(() => {
    if (!filterDate || !sales) return sales || [];

    return sales.filter((sale) => {
      const saleDate = saleDateToInputDate(sale.saleDate);
      return saleDate === filterDate;
    });
  }, [sales, filterDate]);

  // Calcula os totais do dia selecionado
  const dailyTotals = useMemo(() => {
    return filteredRecords.reduce(
      (acc, curr) => ({
        revenue: acc.revenue + (curr.totalAmount || 0),
        items: acc.items + (curr.quantitySold || 0),
      }),
      { revenue: 0, items: 0 }
    );
  }, [filteredRecords]);

  const getProductById = (productId) => {
    return products.find((p) => Number(p.id) === Number(productId));
  };

  const getProductNameById = (productId) => {
    const product = getProductById(productId);
    return product?.name || 'produto';
  };

  const handleEditSale = (record) => {
    setEditingSale(record);
  };

  const handleUpdateSaleWrapper = async (id, data) => {
    try {
      const productId = parseInt(data.productId, 10);
      const quantitySold = parseInt(data.quantitySold ?? data.quantity, 10);
      const unitPrice = parseFloat(data.unitPrice ?? data.salePrice);
      const totalAmount = quantitySold * unitPrice;
      const saleDateInput = data.date || data.saleDate || filterDate;

      if (!productId || isNaN(productId)) {
        alert('Produto inválido.');
        return;
      }

      if (!quantitySold || isNaN(quantitySold) || quantitySold < 1) {
        alert('Quantidade inválida.');
        return;
      }

      if (isNaN(unitPrice)) {
        alert('Valor unitário inválido.');
        return;
      }

      const product = getProductById(productId);
      const productName = data.productName || product?.name || getProductNameById(productId);

      const saleData = {
        productId,
        quantitySold,
        unitPrice,
        totalAmount,
        paymentMethod: data.paymentMethod || 'Dinheiro',
        companyId: data.companyId || product?.companyId || null,
        notes: data.notes || `Venda de ${productName}`,
        saleDate: dateInputToTimestamp(saleDateInput),
      };

      console.log('Atualizando venda:', saleData);

      await updateSale(id, saleData);

      setEditingSale(null);
      alert('Venda atualizada com sucesso!');

      window.location.reload();
    } catch (err) {
      console.error('Erro ao atualizar venda:', err);
      alert('Erro ao atualizar venda: ' + err.message);
    }
  };

  const handleAddBatchSales = async (items) => {
    try {
      if (Array.isArray(items)) {
        for (const item of items) {
          console.log('Item do carrinho ANTES de converter:', item);

          const productId = parseInt(item.productId, 10);

          console.log('productId após parseInt:', productId, 'tipo:', typeof productId);

          if (!productId || isNaN(productId)) {
            alert('ERRO: productId inválido! Valor: ' + item.productId);
            return;
          }

          const quantitySold = parseInt(item.quantitySold ?? item.quantity, 10);
          const unitPrice = parseFloat(item.unitPrice ?? item.salePrice);
          const totalAmount = parseFloat(
            item.totalAmount ?? quantitySold * unitPrice
          );

          const product = getProductById(productId);
          const productName = item.productName || product?.name || getProductNameById(productId);

          const saleData = {
            productId,
            quantitySold,
            unitPrice,
            totalAmount,
            paymentMethod: item.paymentMethod || 'Dinheiro',
            companyId: item.companyId || product?.companyId || null,
            notes: item.notes || `Venda de ${productName}`,
            saleDate: dateInputToTimestamp(item.date || item.saleDate || filterDate),
          };

          console.log('Enviando venda:', saleData);

          await createNewSale(saleData);
        }
      } else {
        const productId = parseInt(items.productId, 10);

        if (!productId || isNaN(productId)) {
          alert('ERRO: productId inválido! Valor: ' + items.productId);
          return;
        }

        const quantitySold = parseInt(items.quantitySold ?? items.quantity, 10);
        const unitPrice = parseFloat(items.unitPrice ?? items.salePrice);
        const totalAmount = parseFloat(
          items.totalAmount ?? quantitySold * unitPrice
        );

        const product = getProductById(productId);
        const productName = items.productName || product?.name || getProductNameById(productId);

        const saleData = {
          productId,
          quantitySold,
          unitPrice,
          totalAmount,
          paymentMethod: items.paymentMethod || 'Dinheiro',
          companyId: items.companyId || product?.companyId || null,
          notes: items.notes || `Venda de ${productName}`,
          saleDate: dateInputToTimestamp(items.date || items.saleDate || filterDate),
        };

        console.log('Enviando venda:', saleData);

        await createNewSale(saleData);
      }

      setShowSalesModal(false);
      alert('Venda registrada com sucesso!');

      window.location.reload();
    } catch (err) {
      console.error('Erro detalhado:', err);
      alert('Erro ao registrar venda: ' + err.message);
    }
  };

  const handleDeleteSale = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta venda?')) {
      return;
    }

    try {
      await deleteSale(id);
      window.location.reload();
    } catch (err) {
      alert('Erro ao excluir venda: ' + err.message);
    }
  };

  return (
    <div className="full-width-layout">
      {/* Cabeçalho de Ação e Filtro */}
      <div className="content-box" style={{ marginBottom: '20px' }}>
        <div className="sales-header-grid">
          <div className="header-title-section">
            <h2 className="content-box-title" style={{ marginBottom: '5px' }}>
              Gerenciamento de Vendas
            </h2>

            <p style={{ color: '#a36c2f', margin: 0 }}>
              Selecione uma data para visualizar os registros.
            </p>
          </div>

          <div className="header-controls-section">
            <div className="date-filter-wrapper">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="date-filter-input"
              />
            </div>

            <button
              onClick={() => setShowSalesModal(true)}
              className="action-button primary"
              type="button"
            >
              <Plus size={18} style={{ marginRight: '5px' }} />
              Nova Venda
            </button>
          </div>
        </div>
      </div>

      {/* Resumo do Dia */}
      <div className="daily-summary-container">
        <div className="daily-summary-card">
          <div className="summary-icon-wrapper">
            <DollarSign size={24} />
          </div>

          <div className="summary-info">
            <span>Faturamento do Dia</span>
            <strong>{formatCurrency(dailyTotals.revenue)}</strong>
          </div>
        </div>

        <div className="daily-summary-card items">
          <div className="summary-info centered">
            <span>Itens Vendidos</span>
            <strong>{dailyTotals.items}</strong>
          </div>
        </div>
      </div>

      {/* Tabela de Vendas Filtrada */}
      <div className="content-box">
        <h3 className="section-subtitle">
          Registros de {filterDate ? formatDateBR(filterDate) : 'Todas as Datas'}
        </h3>

        {loading && <p style={{ textAlign: 'center' }}>Carregando vendas...</p>}

        {!loading && filteredRecords.length > 0 ? (
          <SalesTable
            records={filteredRecords}
            onDelete={handleDeleteSale}
            onEdit={handleEditSale}
          />
        ) : !loading && (
          <p className="no-records-message">
            Nenhuma venda registrada para esta data.
          </p>
        )}
      </div>

      {/* Modal de Nova Venda */}
      {showSalesModal && (
        <SalesFormModal
          products={products}
          onClose={() => setShowSalesModal(false)}
          onSubmit={handleAddBatchSales}
          initialData={{ date: filterDate }}
        />
      )}

      {/* Modal de Editar Venda */}
      {editingSale && (
        <SalesFormModal
          products={products}
          onClose={() => setEditingSale(null)}
          onSubmit={(data) => handleUpdateSaleWrapper(editingSale.id, data)}
          initialData={editingSale}
          isEditing={true}
        />
      )}
    </div>
  );
}

export default SalesManagement;