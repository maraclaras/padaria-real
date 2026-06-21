import React from 'react';
import { formatCurrency, formatDateBR } from '../../App.jsx';
import { useProducts } from '../../hooks/useProducts';
import { useCompanies } from '../../hooks/useCompanies';
import { getCompanyDisplayName, getRecordCompanyId } from '../../utils/companyUtils';
import { Pencil, Trash2 } from 'lucide-react';

function SalesTable({ records, onDelete, onEdit }) {
  const { products } = useProducts();
  const { companies } = useCompanies();

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  const getProductCostPrice = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.costPrice : 0;
  };

  const calculateProfit = (sale) => {
    const costPrice = getProductCostPrice(sale.productId);
    const totalCost = costPrice * sale.quantitySold;
    return sale.totalAmount - totalCost;
  };

  return (
    <div className="content-box">
      <table className="data-table sales-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Produto</th>
            <th>Empresa</th>
            <th>Qtd</th>
            <th>Valor Unit.</th>
            <th>Receita</th>
            <th>Lucro</th>
            <th>Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {records.map((sale) => {
            const profit = calculateProfit(sale);
            const saleDateString = new Date(sale.saleDate).toISOString().substring(0, 10);

            return (
              <tr key={sale.id}>
                <td>{formatDateBR(saleDateString)}</td>
                <td>{getProductName(sale.productId)}</td>
                <td>{getCompanyDisplayName(companies, getRecordCompanyId(sale, products))}</td>
                <td>{sale.quantitySold}</td>
                <td>{formatCurrency(sale.unitPrice)}</td>
                <td>{formatCurrency(sale.totalAmount)}</td>
                <td
                  style={{
                    color: profit > 0 ? '#4CAF50' : '#D32F2F',
                    fontWeight: 'bold'
                  }}
                >
                  {formatCurrency(profit)}
                </td>
                <td>{sale.paymentMethod || '-'}</td>

                <td className="actions-cell">
                  <div className="actions-buttons">
                    <button
                      type="button"
                      onClick={() => onEdit(sale)}
                      className="action-button edit-button"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(sale.id)}
                      className="action-button delete-button"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SalesTable;