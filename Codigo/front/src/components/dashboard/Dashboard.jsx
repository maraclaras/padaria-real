import React, { useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useSales } from '../../hooks/useSales';
import { useWaste } from '../../hooks/useWaste';
// Importa o componente KPICard
import { KPICard } from '../KPICard.jsx'; 
// Importa os ícones
import { 
    Package, 
    TrendingDown, 
    DollarSign, 
    BarChart3, 
    AlertTriangle,
    ShoppingCart
} from 'lucide-react';

// Importa as funções de formatação
import { formatCurrency } from '../../App.jsx'; 

// Importa o CSS específico do Dashboard
import './Dashboard.css'; 

function Dashboard() {
  const { products, loading: loadingProducts } = useProducts();
  const { sales, loading: loadingSales } = useSales();
  const { waste, loading: loadingWaste } = useWaste();
  
  // --- Lógica de Cálculo dos KPIs ---
  const calculateKPIs = () => {
    // 1. Faturamento Total (soma de todas as vendas)
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

    // 2. Lucro Total (faturamento - custo dos produtos vendidos)
    const totalProfit = sales.reduce((sum, sale) => {
      const product = products.find(p => p.id === sale.productId);
      const costPrice = product ? product.costPrice : 0;
      const profit = sale.totalAmount - (costPrice * sale.quantitySold);
      return sum + profit;
    }, 0);

    // 3. Perda Financeira Total (Desperdício)
    const totalFinancialLoss = waste.reduce((sum, w) => sum + (w.totalLoss || 0), 0);

    // 4. Total de Produtos em Estoque
    const totalProductsInStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

    // 5. Produtos com Baixo Estoque (menos de 10 unidades)
    const lowStockProducts = products.filter(p => p.quantity < 10).length;

    // 6. Taxa de Desperdício
    const totalCost = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
    const wasteRate = totalCost > 0 ? (totalFinancialLoss / totalCost) * 100 : 0;

    return {
      totalProducts: products.length,
      totalProductsInStock,
      lowStockProducts,
      totalRevenue,
      totalProfit,
      totalFinancialLoss,
      wasteRate: wasteRate.toFixed(2),
      totalSales: sales.length,
      totalWaste: waste.length
    };
  };

  const kpis = useMemo(() => calculateKPIs(), [products, sales, waste]);

  // --- Lógica de Alertas e Atividade Recente ---
  const lowStockAlerts = products
    .filter(p => p.quantity < 10)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  const recentWaste = [...waste]
    .sort((a, b) => (b.wasteDate || 0) - (a.wasteDate || 0))
    .slice(0, 5);

  const recentSales = [...sales]
    .sort((a, b) => (b.saleDate || 0) - (a.saleDate || 0))
    .slice(0, 5);

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  const alertBoxClass = lowStockAlerts.length > 0
    ? 'content-box alert-box status-card status-card--negative'
    : 'content-box alert-box status-card status-card--positive';

  const salesBoxClass = recentSales.length > 0
    ? 'content-box activity-box status-card status-card--positive'
    : 'content-box activity-box status-card status-card--info';

  const wasteBoxClass = recentWaste.length > 0
    ? 'content-box activity-box status-card status-card--negative'
    : 'content-box activity-box status-card status-card--positive';
  
  if (loadingProducts || loadingSales || loadingWaste) {
    return <div className="dashboard-layout"><p>Carregando dados...</p></div>;
  }
  
  return (
    <div className="dashboard-layout">
        <h2 className="dashboard-title">Painel Principal</h2>

        {/* Linha 1: Alertas e KPIs */}
        <div className="dashboard-top-row"> 
            
            {/* Bloco de Alertas */}
            <div className={alertBoxClass}>
                <AlertTriangle
                  size={32}
                  className={lowStockAlerts.length > 0 ? 'dashboard-alert-icon negative' : 'dashboard-alert-icon positive'}
                  style={{marginBottom: '10px'}}
                />
                <h3 className="content-box-title">Alertas de Estoque Baixo</h3>
                {lowStockAlerts.length > 0 ? (
                    <ul className="alert-list">
                        {lowStockAlerts.map(p => (
                            <li key={p.id} className="alert-item alert-item--negative">
                                <strong>{p.name}</strong> - Estoque: {p.quantity} unidades
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-alert">
                        Todos os produtos com estoque adequado.
                    </p>
                )}
            </div>

            {/* Container de KPIs usando o componente KPICard */}
            <div className="kpi-container">
                <KPICard 
                    title="Total de Produtos"
                    value={kpis.totalProducts}
                    subtitle={`${kpis.totalProductsInStock} unidades em estoque`}
                    icon={<Package size={20} />}
                    type="primary"
                />
                <KPICard 
                    title="Faturamento Total"
                    value={formatCurrency(kpis.totalRevenue)}
                    subtitle={`${kpis.totalSales} vendas realizadas`}
                    icon={<ShoppingCart size={20} />}
                    type="positive"
                />
                <KPICard 
                    title="Lucro Total"
                    value={formatCurrency(kpis.totalProfit)}
                    subtitle="Faturamento - Custos"
                    icon={<DollarSign size={20} />}
                    type={kpis.totalProfit >= 0 ? "positive" : "alert"}
                />
                <KPICard 
                    title="Perda por Desperdício"
                    value={formatCurrency(kpis.totalFinancialLoss)}
                    subtitle={`${kpis.totalWaste} registros de desperdício`}
                    icon={<TrendingDown size={20} />}
                    type={kpis.totalFinancialLoss > 0 ? "alert" : "positive"}
                />
                <KPICard 
                    title="Taxa de Desperdício"
                    value={`${kpis.wasteRate}%`}
                    subtitle="Perda / Custo total em estoque"
                    icon={<BarChart3 size={20} />}
                    type={parseFloat(kpis.wasteRate) > 0 ? "alert" : "positive"}
                />
                <KPICard 
                    title="Produtos com Estoque Baixo"
                    value={kpis.lowStockProducts}
                    subtitle="Menos de 10 unidades"
                    icon={<AlertTriangle size={20} />}
                    type={kpis.lowStockProducts > 0 ? "alert" : "positive"}
                />
            </div>
        </div>

        {/* Linha 2: Atividade Recente */}
        <div className="dashboard-row activity-row">
            
            <div className={salesBoxClass}>
                <h3 className="content-box-title">Últimas Vendas</h3>
                <ul className="activity-list">
                    {recentSales.map(s => (
                        <li key={s.id} className="activity-item activity-item--positive">
                            <strong>{getProductName(s.productId)}</strong> - {s.quantitySold} un. - {formatCurrency(s.totalAmount)}
                        </li>
                    ))}
                    {recentSales.length === 0 && <li className="activity-item activity-item--info">Nenhuma venda registrada.</li>}
                </ul>
            </div>

            <div className={wasteBoxClass}>
                <h3 className="content-box-title">Últimos Desperdícios</h3>
                <ul className="activity-list">
                    {recentWaste.map(w => (
                        <li key={w.id} className="activity-item activity-item--negative">
                            <strong>{getProductName(w.productId)}</strong> - {w.quantityWasted} un. - {w.reason}
                        </li>
                    ))}
                    {recentWaste.length === 0 && <li className="activity-item activity-item--positive">Nenhum desperdício registrado.</li>}
                </ul>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;