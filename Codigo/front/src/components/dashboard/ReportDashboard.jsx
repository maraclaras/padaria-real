import React from 'react';
import { formatCurrency } from '../../App.jsx';

function WasteTable({ wasteRecords, products, onDeleteWaste }) {
    return (
        <div className="content-box">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Motivo</th>
                        <th>Perda Total</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {wasteRecords.map((record) => {
                        const product = products.find(p => p.name === record.productName);
                        const costPrice = product ? parseFloat(product.costPrice) : 0;
                        const quantity = parseInt(record.quantity) || 0;
                        const totalLoss = quantity * costPrice;

                        return (
                            <tr key={record.id}>
                                <td>{record.productName}</td>
                                <td>{record.quantity}</td>
                                <td>{record.reason}</td>
                                <td style={{color: '#D32F2F', fontWeight: 'bold'}}>{formatCurrency(totalLoss)}</td>
                                <td className="actions-cell">
                                    <button 
                                        onClick={() => onDeleteWaste(record.id)} 
                                        className="action-button delete-button"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function ReportDashboard({ wasteRecords, products, onDeleteWaste, simpleView = false }) {
    if (simpleView) {
        return <WasteTable wasteRecords={wasteRecords} products={products} onDeleteWaste={onDeleteWaste} />;
    }
    return (
        <div className="content-box">
            <h2 className="report-title">Relatórios Gerenciais</h2>
            <p style={{textAlign: 'center'}}>Os indicadores de performance estão no Painel Principal (Dashboard).</p>
            <h3 className="content-box-title" style={{textAlign: 'center', marginTop: '40px'}}>Registros de Desperdício</h3>
            <WasteTable wasteRecords={wasteRecords} products={products} onDeleteWaste={onDeleteWaste} />
        </div>
    );
}

export default ReportDashboard;