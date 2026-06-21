import React, { useState } from 'react';
import { useWaste } from '../../hooks/useWaste';
import { useProducts } from '../../hooks/useProducts';
import { useCompanies } from '../../hooks/useCompanies';
import { getCompanyDisplayName, getRecordCompanyId } from '../../utils/companyUtils';
import WasteForm from '../forms/WasteForm';
import './Management.css';
import { Pencil, Trash2 } from 'lucide-react';

function WasteManagement() {
  const { waste, loading, deleteWaste } = useWaste();
  const { products } = useProducts();
  const { companies } = useCompanies();
  const [showForm, setShowForm] = useState(false);

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Desconhecido';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de desperdício?')) {
      try {
        await deleteWaste(id);
      } catch (err) {
        alert('Erro ao excluir desperdício: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="management-container"><p>Carregando desperdícios...</p></div>;
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Gerenciar Desperdícios</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-primary"
        >
          {showForm ? 'Fechar Formulário' : '+ Registrar Desperdício'}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <WasteForm />
        </div>
      )}

      <div className="table-section">
        <h3>Lista de Desperdícios</h3>
        {waste.length === 0 ? (
          <p className="no-data">Nenhum desperdício registrado.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Produto</th>
                <th>Empresa</th>
                <th>Quantidade</th>
                <th>Motivo</th>
                <th>Custo Unitário</th>
                <th>Perda Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {waste.map((w) => (
                <tr key={w.id}>
                  <td>{formatDate(w.wasteDate)}</td>
                  <td>{getProductName(w.productId)}</td>
                  <td>{getCompanyDisplayName(companies, getRecordCompanyId(w, products))}</td>
                  <td>{w.quantityWasted} un.</td>
                  <td>{w.reason}</td>
                  <td>{formatCurrency(w.unitCost)}</td>
                  <td className="loss-value">{formatCurrency(w.totalLoss)}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(w.id)}
                      className="btn-delete"
                    >
                      <Trash2 size={16} />
                      Excluir 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {waste.length > 0 && (
          <div className="table-summary">
            <strong>Total de Desperdícios:</strong> {waste.length} registros
            {' | '}
            <strong>Perda Total:</strong> {formatCurrency(
              waste.reduce((sum, w) => sum + (w.totalLoss || 0), 0)
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WasteManagement;
