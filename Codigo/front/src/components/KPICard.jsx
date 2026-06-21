import React from 'react';

// Cores baseadas no index.css do projeto
const COLORS = {
    alert: '#D32F2F', // --error-color
    positive: '#4CAF50', // Verde para lucro
    primary: '#a36c2f', // --botao
    background: '#f3f1e7', // --fundo-claro
};

export function KPICard({ title, value, subtitle, icon, type }) {
    const cardColor = COLORS[type] || COLORS.primary;

    return (
        <div 
            className="kpi-card" 
            style={{ 
                backgroundColor: COLORS.background, 
                borderLeft: `5px solid ${cardColor}`,
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '120px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#333' }}>{title}</h4>
                <div style={{ color: cardColor }}>{icon}</div>
            </div>
            <div style={{ marginTop: '10px' }}>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: cardColor }}>{value}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#a36c2f' }}>{subtitle}</p>
            </div>
        </div>
    );
}