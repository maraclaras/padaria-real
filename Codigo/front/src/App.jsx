import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Home,
  Search,
  Croissant,
  ShoppingCart,
  Trash2,
  Shapes,
  Users,
  LogOut,
  UserCircle,
  ChevronDown,
  UserPlus,
  Building2,
} from 'lucide-react';

// --- Imports ---
import Login from './components/auth/Login.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import ReportDashboard from './components/dashboard/ReportDashboard.jsx';
import SalesManagement from './components/management/SalesManagement.jsx';
import WasteManagement from './components/management/WasteManagement.jsx';
import EditProductForm from './components/forms/EditProductForm.jsx';
import ProductList from './components/products/ProductList.jsx';
import AdvancedProductList from './components/products/AdvancedProductList.jsx';
import ProductForm from './components/management/ProductForm.jsx';
import ProductFormNew from './components/forms/ProductFormNew.jsx';
import CategoryManagement from './components/management/CategoryManagement.jsx';
import UserManagement from './components/management/UserManagement.jsx';
import CompanyManagement from './components/management/CompanyManagement.jsx';
import ProfilePage from './components/profile/ProfilePage.jsx';
import { loginUser } from './services/api.js';

import './App.css';
import './components/common/Common.css';

// --- Utilitários de Formatação ---
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDateBR = (dateString) => {
  if (!dateString) return '';
  if (dateString.includes('/')) return dateString;

  const dateParts = dateString.split('-');

  if (dateParts.length === 3) {
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }

  return dateString;
};

// --- Componentes antigos mantidos para não quebrar nada ---
const ProductsManagement = ({ products, categories, onAddProduct, onDeleteProduct }) => (
  <>
    <div className="column-left">
      <ProductForm onAddProduct={onAddProduct} categories={categories} />
    </div>

    <div className="column-right">
      <div className="content-box">
        <h2 className="content-box-title">Lista Rápida de Produtos</h2>
        <ProductList products={products} onDeleteProduct={onDeleteProduct} />
      </div>
    </div>
  </>
);

const WasteManagementOld = ({ products, wasteRecords, onDeleteWaste, onRegisterWaste }) => (
  <>
    <div className="column-left">
      <WasteForm products={products} onRegisterWaste={onRegisterWaste} />
    </div>

    <div className="column-right">
      <div className="content-box">
        <h2 className="content-box-title">Registros de Desperdício</h2>
        <ReportDashboard
          wasteRecords={wasteRecords}
          products={products}
          onDeleteWaste={onDeleteWaste}
          simpleView={true}
        />
      </div>
    </div>
  </>
);

// --- Proteção de rotas ---
function RequireAuth({ isLoggedIn, children }) {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

const formatUserRole = (role) => {
  const normalizedRole = String(role || '').trim().toUpperCase();

  const labels = {
    ADMIN: 'Administrador',
    USER: 'Usuário',
    GERENTE: 'Gerente',
    ATENDENTE: 'Atendente',
    ESTOQUISTA: 'Estoquista',
  };

  return labels[normalizedRole] || 'Usuário';
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('loggedUser') !== null);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('loggedUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAdmin = String(currentUser?.role || '').toUpperCase() === 'ADMIN';

  // --- Estados de Dados antigos mantidos ---
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Pão Francês',
      category: 'Pães',
      costPrice: 0.5,
      salePrice: 1.0,
      expiryDate: '2025-12-12',
    },
    {
      id: 2,
      name: 'Bolo de Chocolate',
      category: 'Bolos',
      costPrice: 15.0,
      salePrice: 25.0,
      expiryDate: '2025-12-25',
    },
    {
      id: 3,
      name: 'Sonho',
      category: 'Doces',
      costPrice: 1.2,
      salePrice: 3.5,
      expiryDate: '2026-01-05',
    },
    {
      id: 4,
      name: 'Pão Integral',
      category: 'Pães',
      costPrice: 2.0,
      salePrice: 5.0,
      expiryDate: '2026-01-15',
    },
  ]);

  const [wasteRecords, setWasteRecords] = useState([
    {
      productName: 'Pão Francês',
      quantity: 10,
      reason: 'Queimado',
      costPrice: 0.5,
      id: 1,
    },
    {
      productName: 'Bolo de Chocolate',
      quantity: 1,
      reason: 'Vencimento',
      costPrice: 15.0,
      id: 2,
    },
    {
      productName: 'Sonho',
      quantity: 5,
      reason: 'Estragado',
      costPrice: 1.2,
      id: 3,
    },
  ]);

  const today = new Date().toISOString().substring(0, 10);

  const [salesRecords, setSalesRecords] = useState([
    {
      id: 1,
      date: '2025-12-01',
      productName: 'Pão Francês',
      quantity: 50,
      costPrice: 0.5,
      salePrice: 1.0,
      revenue: 50.0,
      profit: 25.0,
    },
    {
      id: 2,
      date: '2025-12-02',
      productName: 'Bolo de Chocolate',
      quantity: 2,
      costPrice: 15.0,
      salePrice: 25.0,
      revenue: 50.0,
      profit: 20.0,
    },
    {
      id: 3,
      date: today,
      productName: 'Sonho',
      quantity: 10,
      costPrice: 1.2,
      salePrice: 3.5,
      revenue: 35.0,
      profit: 23.0,
    },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Pães' },
    { id: 2, name: 'Bolos' },
    { id: 3, name: 'Doces' },
    { id: 4, name: 'Salgados' },
  ]);

  // --- Login / Logout ---
  const handleLogin = async (username, password) => {
    try {
      const loggedUser = await loginUser(username, password);

      if (!loggedUser || loggedUser.success === false) {
        return false;
      }

      setIsLoggedIn(true);
      setCurrentUser(loggedUser);

      localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      localStorage.setItem('loggedUsername', loggedUser.username);

      const redirectTo = location.state?.from?.pathname || '/';

      navigate(redirectTo === '/login' ? '/' : redirectTo, { replace: true });

      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);

    localStorage.removeItem('loggedUser');
    localStorage.removeItem('loggedUsername');

    navigate('/login');
  };

  const handleSwitchUser = () => {
    handleLogout();
  };

  // --- Funções CRUD antigas mantidas ---
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter((product) => product.id !== productId));
    }
  };

  const handleDeleteWaste = (wasteId) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de Desperdício?')) {
      setWasteRecords(wasteRecords.filter((waste) => waste.id !== wasteId));
    }
  };

  const handleAddSale = (newSale) => {
    setSalesRecords((prevRecords) => {
      const revenue = newSale.quantity * newSale.salePrice;
      const profit = revenue - newSale.quantity * newSale.costPrice;

      const nextId =
        prevRecords.length > 0
          ? Math.max(...prevRecords.map((record) => record.id)) + 1
          : 1;

      const saleToRegister = {
        ...newSale,
        id: nextId,
        revenue: parseFloat(revenue.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
      };

      return [...prevRecords, saleToRegister];
    });
  };

  const handleDeleteSale = (saleId) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de venda?')) {
      setSalesRecords(salesRecords.filter((sale) => sale.id !== saleId));
    }
  };

  const handleUpdateSale = (id, updatedData) => {
    setSalesRecords((prevRecords) =>
      prevRecords.map((sale) => {
        if (sale.id === id) {
          const revenue = updatedData.quantity * updatedData.salePrice;
          const profit = revenue - updatedData.quantity * updatedData.costPrice;

          return {
            ...updatedData,
            id,
            revenue: parseFloat(revenue.toFixed(2)),
            profit: parseFloat(profit.toFixed(2)),
          };
        }

        return sale;
      })
    );
  };

  const handleAddCategory = (name) => {
    const newCategory = {
      id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 1,
      name,
    };

    setCategories([...categories, newCategory]);
  };

  const handleUpdateCategory = (id, newName) => {
    const oldCategoryName = categories.find((category) => category.id === id)?.name;

    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, name: newName } : category
      )
    );

    setProducts(
      products.map((product) =>
        product.category === oldCategoryName ? { ...product, category: newName } : product
      )
    );
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleAddProduct = (newProduct) => {
    const productToAdd = {
      ...newProduct,
      id: products.length + 1,
      costPrice: parseFloat(newProduct.costPrice),
      salePrice: parseFloat(newProduct.salePrice),
    };

    setProducts([...products, productToAdd]);
  };

  const handleRegisterWaste = (newWaste) => {
    const wasteToRegister = {
      ...newWaste,
      quantity: parseInt(newWaste.quantity),
      id: wasteRecords.length + 1,
    };

    setWasteRecords([...wasteRecords, wasteToRegister]);
  };

  const handleSaveProduct = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === parseInt(updatedProduct.id)
          ? {
              ...updatedProduct,
              costPrice: parseFloat(updatedProduct.costPrice),
              salePrice: parseFloat(updatedProduct.salePrice),
            }
          : product
      )
    );

    navigate('/produtos');
  };

  const getNavLinkClass = (path) => {
    const currentPath = location.pathname;

    if (path === '/') {
      return currentPath === '/' ? 'active' : '';
    }

    return currentPath.startsWith(path) ? 'active' : '';
  };

  const isDashboard = location.pathname === '/';

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === '/') return 'Dashboard';
    if (path.startsWith('/produtos')) return 'Produtos';
    if (path.startsWith('/vendas')) return 'Vendas';
    if (path.startsWith('/desperdicio')) return 'Desperdício';
    if (path.startsWith('/categorias')) return 'Categorias';
    if (path.startsWith('/empresas')) return 'Empresas';
    if (path.startsWith('/usuarios')) return 'Usuários';
    if (path.startsWith('/consulta')) return 'Consulta';
    if (path.startsWith('/perfil')) return 'Perfil';
    if (path.startsWith('/edit')) return 'Editar Produto';

    return 'Padaria Real';
  };

  const mainClassName = isLoggedIn
    ? `main-dashboard ${isDashboard ? 'dashboard-page-layout' : ''}`
    : '';

  return (
    <div className="App">
      {isLoggedIn && (
        <aside className="app-header" aria-label="Menu principal">
          <div className="sidebar-brand" title="Padaria Real">
            <img src="/novo_logo.png" alt="Padaria Real" />
          </div>

          <nav className="nav-menu">
            <Link to="/" className="nav-link" aria-label="Dashboard">
              <button
                className={`nav-button ${getNavLinkClass('/')}`}
                data-label="Dashboard"
                type="button"
              >
                <Home size={30} strokeWidth={2.3} />
                <span>Dashboard</span>
              </button>
            </Link>

            <Link to="/produtos" className="nav-link" aria-label="Cadastro de Produtos">
              <button
                className={`nav-button ${getNavLinkClass('/produtos')}`}
                data-label="Produtos"
                type="button"
              >
                <Croissant size={31} strokeWidth={2.3} />
                <span>Produtos</span>
              </button>
            </Link>

            <Link to="/vendas" className="nav-link" aria-label="Vendas">
              <button
                className={`nav-button ${getNavLinkClass('/vendas')}`}
                data-label="Vendas"
                type="button"
              >
                <ShoppingCart size={30} strokeWidth={2.3} />
                <span>Vendas</span>
              </button>
            </Link>

            <Link to="/desperdicio" className="nav-link" aria-label="Desperdício">
              <button
                className={`nav-button ${getNavLinkClass('/desperdicio')}`}
                data-label="Desperdício"
                type="button"
              >
                <Trash2 size={30} strokeWidth={2.3} />
                <span>Desperdício</span>
              </button>
            </Link>

            <Link to="/categorias" className="nav-link" aria-label="Categorias">
              <button
                className={`nav-button ${getNavLinkClass('/categorias')}`}
                data-label="Categorias"
                type="button"
              >
                <Shapes size={30} strokeWidth={2.3} />
                <span>Categorias</span>
              </button>
            </Link>

            {isAdmin && (
              <Link to="/empresas" className="nav-link" aria-label="Empresas">
                <button
                  className={`nav-button ${getNavLinkClass('/empresas')}`}
                  data-label="Empresas"
                  type="button"
                >
                  <Building2 size={30} strokeWidth={2.3} />
                  <span>Empresas</span>
                </button>
              </Link>
            )}

            {isAdmin && (
              <Link to="/usuarios" className="nav-link" aria-label="Usuários">
                <button
                  className={`nav-button ${getNavLinkClass('/usuarios')}`}
                  data-label="Usuários"
                  type="button"
                >
                  <Users size={31} strokeWidth={2.3} />
                  <span>Usuários</span>
                </button>
              </Link>
            )}

            <Link to="/consulta" className="nav-link" aria-label="Consulta">
              <button
                className={`nav-button ${getNavLinkClass('/consulta')}`}
                data-label="Consulta"
                type="button"
              >
                <Search size={31} strokeWidth={2.3} />
                <span>Consulta</span>
              </button>
            </Link>
          </nav>

          <button
            className="logout-button"
            onClick={handleLogout}
            data-label="Sair"
            type="button"
            aria-label="Sair"
          >
            <LogOut size={27} strokeWidth={2.3} />
            <span>Sair</span>
          </button>
        </aside>
      )}

      <main className={mainClassName}>
        {isLoggedIn && (
          <header className="page-shell-header">
            <div className="page-title-area">
              <img src="/novo_logo.png" alt="Logo Padaria Real" className="page-logo" />
              <h1>{getPageTitle()}</h1>
            </div>

            <details className="user-menu">
              <summary className="user-area" aria-label="Usuário logado">
                <div
                  className="user-avatar"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate('/perfil');
                  }}
                >
                  <UserCircle size={36} strokeWidth={2.1} />
                </div>

                <div
                  className="user-text"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate('/perfil');
                  }}
                >
                  <strong>{currentUser?.name || currentUser?.username || 'Usuário'}</strong>
                  <span>{formatUserRole(currentUser?.role)}</span>
                </div>

                <ChevronDown className="user-chevron" size={24} strokeWidth={2.4} />
              </summary>

              <div className="user-dropdown">
                <button
                  type="button"
                  onClick={() => navigate('/perfil')}
                  className="dropdown-user-action"
                >
                  <UserCircle size={18} />
                  Meu Perfil
                </button>

                <button
                  type="button"
                  onClick={handleSwitchUser}
                  className="dropdown-user-action"
                >
                  <UserPlus size={18} />
                  Trocar Usuário
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="dropdown-user-action logout"
                >
                  <LogOut size={18} />
                  Sair da conta
                </button>
              </div>
            </details>
          </header>
        )}

        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          <Route
            path="/"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/consulta"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <AdvancedProductList />
              </RequireAuth>
            }
          />

          <Route
            path="/produtos"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <div className="product-management-layout">
                  <div>
                    <ProductFormNew />
                  </div>

                  <div>
                    <ProductList />
                  </div>
                </div>
              </RequireAuth>
            }
          />

          <Route
            path="/vendas"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <SalesManagement />
              </RequireAuth>
            }
          />

          <Route
            path="/desperdicio"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <WasteManagement />
              </RequireAuth>
            }
          />

          <Route
            path="/categorias"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <CategoryManagement />
              </RequireAuth>
            }
          />

          <Route
            path="/empresas"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                {isAdmin ? <CompanyManagement /> : <Navigate to="/" replace />}
              </RequireAuth>
            }
          />

          <Route
            path="/usuarios"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                {isAdmin ? <UserManagement /> : <Navigate to="/" replace />}
              </RequireAuth>
            }
          />

          <Route
            path="/perfil"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <ProfilePage />
              </RequireAuth>
            }
          />

          <Route
            path="/edit/:productId"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <EditProductForm products={products} onSave={handleSaveProduct} />
              </RequireAuth>
            }
          />

          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? '/' : '/login'} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;