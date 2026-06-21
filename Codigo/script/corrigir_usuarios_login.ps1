$ErrorActionPreference = "Stop"
Write-Host "Corrigindo login, senha e permissao de usuarios..." -ForegroundColor Cyan
@'
package com.padaria.service;

import com.padaria.model.User;
import com.padaria.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User createUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username é obrigatório");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Senha é obrigatória");
        }

        user.setUsername(user.getUsername().trim());
        user.setPassword(user.getPassword().trim());

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username já existe");
        }

        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("USER");
        }

        if (user.getActive() == null) {
            user.setActive(true);
        }

        return userRepository.save(user);
    }

    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Atualiza somente os campos enviados. Isso evita apagar username/nome/cargo
        // quando a tela manda apenas { password: "novaSenha" }.
        if (user.getUsername() != null && !user.getUsername().trim().isEmpty()) {
            Optional<User> userWithSameUsername = userRepository.findByUsername(user.getUsername());
            if (userWithSameUsername.isPresent() && !userWithSameUsername.get().getId().equals(id)) {
                throw new RuntimeException("Username já existe");
            }
            existingUser.setUsername(user.getUsername().trim());
        }

        if (user.getName() != null) {
            existingUser.setName(user.getName());
        }

        if (user.getRole() != null && !user.getRole().trim().isEmpty()) {
            existingUser.setRole(user.getRole());
        }

        if (user.getActive() != null) {
            existingUser.setActive(user.getActive());
        }

        if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
            existingUser.setPassword(user.getPassword().trim());
        }

        return userRepository.update(existingUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }
        
        User user = userOpt.get();
        
        if (!user.getActive()) {
            throw new RuntimeException("Usuário inativo");
        }
        
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Senha incorreta");
        }
        
        return user;
    }
}

'@ | Set-Content -Path "Codigo\\backend\\src\\main\\java\\com\\padaria\\service\\UserService.java" -Encoding UTF8
Write-Host "Corrigido: Codigo/backend/src/main/java/com/padaria/service/UserService.java" -ForegroundColor Green
@'
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Serviço centralizado para comunicação com a API do backend
 */

// Configurações padrão para requisições
const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Função auxiliar para fazer requisições HTTP
 * @param {string} endpoint - Caminho da API (ex: '/products')
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {object} body - Dados para enviar (opcional)
 * @returns {Promise} Resposta da API
 */
const makeRequest = async (endpoint, method = 'GET', body = null) => {
  try {
    const config = {
      method,
      headers: defaultHeaders,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(body);
      console.log(`[API] ${method} ${endpoint} - Body:`, body);
    }

    console.log(`[API] Iniciando ${method} ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    console.log(`[API] Resposta ${method} ${endpoint}: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Erro ${response.status}:`, errorText);
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    // Trata respostas vazias (204 No Content)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error(`Erro na requisição ${method} ${endpoint}:`, error);
    throw error;
  }
};

/**
 * ===== PRODUTOS =====
 */

export const getAllProducts = () => makeRequest('/products', 'GET');
export const getProductById = (id) => makeRequest(`/products/${id}`, 'GET');
export const searchProducts = (name) => makeRequest(`/products/search?name=${encodeURIComponent(name)}`, 'GET');
export const getProductsByCategory = (category) => makeRequest(`/products/category/${encodeURIComponent(category)}`, 'GET');
export const getAvailableProducts = () => makeRequest('/products/available', 'GET');
export const getLowStockProducts = (minimumQuantity = 10) => makeRequest(`/products/low-stock?minimumQuantity=${minimumQuantity}`, 'GET');
export const createProduct = (productData) => makeRequest('/products', 'POST', productData);
export const updateProduct = (id, productData) => makeRequest(`/products/${id}`, 'PUT', productData);
export const deleteProduct = (id) => makeRequest(`/products/${id}`, 'DELETE');
export const updateProductQuantity = (id, quantity) => makeRequest(`/products/${id}/quantity?quantity=${quantity}`, 'PATCH');

/**
 * ===== CATEGORIAS =====
 */

export const getAllCategories = () => makeRequest('/categories', 'GET');
export const getCategoryById = (id) => makeRequest(`/categories/${id}`, 'GET');
export const searchCategories = (name) => makeRequest(`/categories/search?name=${encodeURIComponent(name)}`, 'GET');
export const createCategory = (categoryData) => makeRequest('/categories', 'POST', categoryData);
export const updateCategory = (id, categoryData) => makeRequest(`/categories/${id}`, 'PUT', categoryData);
export const deleteCategory = (id) => makeRequest(`/categories/${id}`, 'DELETE');

/**
 * ===== VENDAS =====
 */

export const getAllSales = () => makeRequest('/sales', 'GET');
export const getSaleById = (id) => makeRequest(`/sales/${id}`, 'GET');
export const getSalesByProduct = (productId) => makeRequest(`/sales/product/${productId}`, 'GET');
export const getSalesByDateRange = (startDate, endDate) => makeRequest(`/sales/date-range?startDate=${startDate}&endDate=${endDate}`, 'GET');
export const createSale = (saleData) => {
  console.log('createSale - Dados recebidos:', saleData);
  console.log('createSale - productId tipo:', typeof saleData.productId, 'valor:', saleData.productId);
  return makeRequest('/sales', 'POST', saleData);
};
export const updateSale = (id, saleData) => makeRequest(`/sales/${id}`, 'PUT', saleData);
export const deleteSale = (id) => makeRequest(`/sales/${id}`, 'DELETE');
export const getTotalRevenue = () => makeRequest('/sales/statistics/revenue', 'GET');
export const getTotalSalesCount = () => makeRequest('/sales/statistics/count', 'GET');

/**
 * ===== DESPERDÍCIO =====
 */

export const getAllWaste = () => makeRequest('/waste', 'GET');
export const getWasteById = (id) => makeRequest(`/waste/${id}`, 'GET');
export const getWasteByProduct = (productId) => makeRequest(`/waste/product/${productId}`, 'GET');
export const getWasteByDateRange = (startDate, endDate) => makeRequest(`/waste/date-range?startDate=${startDate}&endDate=${endDate}`, 'GET');
export const createWaste = (wasteData) => makeRequest('/waste', 'POST', wasteData);
export const updateWaste = (id, wasteData) => makeRequest(`/waste/${id}`, 'PUT', wasteData);
export const deleteWaste = (id) => makeRequest(`/waste/${id}`, 'DELETE');
export const getTotalWasteLoss = () => makeRequest('/waste/statistics/loss', 'GET');
export const getTotalWasteCount = () => makeRequest('/waste/statistics/count', 'GET');

/**
 * ===== USUÁRIOS =====
 */

export const getUsers = () => makeRequest('/users', 'GET');
export const getUserById = (id) => makeRequest(`/users/${id}`, 'GET');
export const createUser = (userData) => makeRequest('/users', 'POST', userData);
export const updateUser = (id, userData) => makeRequest(`/users/${id}`, 'PUT', userData);
export const deleteUser = (id) => makeRequest(`/users/${id}`, 'DELETE');
export const loginUser = (username, password) => makeRequest('/users/login', 'POST', { username, password });

/**
 * ===== UTILITÁRIOS =====
 */

export const checkApiHealth = async () => {
  try {
    const products = await getAllProducts();
    return { status: 'online', data: products };
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
};

'@ | Set-Content -Path "Codigo\\front\\src\\services\\api.js" -Encoding UTF8
Write-Host "Corrigido: Codigo/front/src/services/api.js" -ForegroundColor Green
@'
import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('padariaReal');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioDigitado = username.trim();
    const senhaDigitada = password.trim();

    if (!usuarioDigitado || !senhaDigitada) {
      setError('Preencha usuário e senha para continuar.');
      return;
    }

    if (typeof onLogin === 'function') {
      try {
        setLoading(true);
        setError('');
        const loginValido = await onLogin(usuarioDigitado, senhaDigitada);

        if (!loginValido) {
          setError('Usuário ou senha inválidos.');
        }
      } catch (err) {
        setError(err.message || 'Usuário ou senha inválidos.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="login-page">
      <section className="login-overlay">
        <div className="login-brand-panel">
          <div className="login-brand-text">
            <span className="login-kicker">Sistema de gestão</span>
            <h1>Padaria Real</h1>
            <p>
              Controle produtos, categorias, vendas e usuários em um só lugar.
            </p>
          </div>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-header">
            <img
              src="/novo_logo.png"
              alt="Logo Padaria Real"
              className="login-logo"
            />

            <div>
              <h2>Entrar</h2>
              <p>Acesse sua conta para continuar</p>
            </div>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
'@ | Set-Content -Path "Codigo\\front\\src\\components\\auth\\Login.jsx" -Encoding UTF8
Write-Host "Corrigido: Codigo/front/src/components/auth/Login.jsx" -ForegroundColor Green
@'
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Home, Search, Croissant, ShoppingCart, Trash2, Shapes, Users, LogOut, UserCircle, ChevronDown, UserPlus } from 'lucide-react';

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
import { loginUser } from './services/api.js';

import './App.css'; 
import './components/common/Common.css'; 

// --- Utilitários de Formatação (Padrão BR) ---
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDateBR = (dateString) => {
  if (!dateString) return '';
  if (dateString.includes('/')) return dateString;
  // Tenta tratar timezone para evitar problemas de "dia anterior"
  const dateParts = dateString.split('-');
  if (dateParts.length === 3) {
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  }
  return dateString;
};

// --- Componentes de Gerenciamento ---
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
        <ReportDashboard wasteRecords={wasteRecords} products={products} onDeleteWaste={onDeleteWaste} simpleView={true} />
      </div>
    </div>
  </>
);

// --- Componente de Proteção de Rotas ---
function RequireAuth({ isLoggedIn, children }) {
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('loggedUser') !== null);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('loggedUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  // --- Estados de Dados ---
  const [products, setProducts] = useState([
    {id: 1, name: 'Pão Francês', category: 'Pães', costPrice: 0.50, salePrice: 1.00, expiryDate: '2025-12-12'}, 
    {id: 2, name: 'Bolo de Chocolate', category: 'Bolos', costPrice: 15.00, salePrice: 25.00, expiryDate: '2025-12-25'},
    {id: 3, name: 'Sonho', category: 'Doces', costPrice: 1.20, salePrice: 3.50, expiryDate: '2026-01-05'},
    {id: 4, name: 'Pão Integral', category: 'Pães', costPrice: 2.00, salePrice: 5.00, expiryDate: '2026-01-15'},
  ]);
  
  const [wasteRecords, setWasteRecords] = useState([
    {productName: 'Pão Francês', quantity: 10, reason: 'Queimado', costPrice: 0.50, id: 1},
    {productName: 'Bolo de Chocolate', quantity: 1, reason: 'Vencimento', costPrice: 15.00, id: 2},
    {productName: 'Sonho', quantity: 5, reason: 'Estragado', costPrice: 1.20, id: 3},
  ]);
  
  // Data de hoje para iniciar com dados visíveis
  const today = new Date().toISOString().substring(0, 10);

  const [salesRecords, setSalesRecords] = useState([
    {id: 1, date: '2025-12-01', productName: 'Pão Francês', quantity: 50, costPrice: 0.50, salePrice: 1.00, revenue: 50.00, profit: 25.00},
    {id: 2, date: '2025-12-02', productName: 'Bolo de Chocolate', quantity: 2, costPrice: 15.00, salePrice: 25.00, revenue: 50.00, profit: 20.00},
    // Exemplo para o dia atual
    {id: 3, date: today, productName: 'Sonho', quantity: 10, costPrice: 1.20, salePrice: 3.50, revenue: 35.00, profit: 23.00},
  ]);
  
  const [categories, setCategories] = useState([
      { id: 1, name: 'Pães' },
      { id: 2, name: 'Bolos' },
      { id: 3, name: 'Doces' },
      { id: 4, name: 'Salgados' },
  ]);

  // --- Funções CRUD ---

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
  
  const handleDeleteProduct = (productId) => {
      if (window.confirm('Tem certeza que deseja excluir este produto?')) {
          setProducts(products.filter(p => p.id !== productId));
      }
  };

  const handleDeleteWaste = (wasteId) => {
      if (window.confirm('Tem certeza que deseja excluir este registro de desperdício?')) {
          setWasteRecords(wasteRecords.filter(w => w.id !== wasteId));
      }
  };

  // --- CORREÇÃO AQUI: Uso de State Funcional para suportar múltiplas adições rápidas ---
  const handleAddSale = (newSale) => {
    setSalesRecords(prevRecords => {
        const revenue = newSale.quantity * newSale.salePrice;
        const profit = revenue - (newSale.quantity * newSale.costPrice);
        
        // Garante ID único mesmo em inserção em lote
        const nextId = prevRecords.length > 0 ? Math.max(...prevRecords.map(r => r.id)) + 1 : 1;

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
          setSalesRecords(salesRecords.filter(s => s.id !== saleId));
      }
  };

  const handleUpdateSale = (id, updatedData) => {
    setSalesRecords(prevRecords => prevRecords.map(s => {
      if (s.id === id) {
          const revenue = updatedData.quantity * updatedData.salePrice;
          const profit = revenue - (updatedData.quantity * updatedData.costPrice);
          return { 
            ...updatedData, 
            id, 
            revenue: parseFloat(revenue.toFixed(2)), 
            profit: parseFloat(profit.toFixed(2)) 
          };
      }
      return s;
    }));
  };
  
  const handleAddCategory = (name) => {
      const newCategory = { id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 1, name };
      setCategories([...categories, newCategory]);
  };

  const handleUpdateCategory = (id, newName) => {
      setCategories(categories.map(c => 
          c.id === id ? { ...c, name: newName } : c
      ));
      const oldCategoryName = categories.find(c => c.id === id)?.name;
      setProducts(products.map(p => 
          p.category === oldCategoryName ? { ...p, category: newName } : p
      ));
  };

  const handleDeleteCategory = (id) => {
      setCategories(categories.filter(c => c.id !== id));
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
      id: wasteRecords.length + 1
    };
    setWasteRecords([...wasteRecords, wasteToRegister]);
  };

  const handleSaveProduct = (updatedProduct) => {
    setProducts(products.map(p => 
      p.id === parseInt(updatedProduct.id) ? { 
        ...updatedProduct,
        costPrice: parseFloat(updatedProduct.costPrice),
        salePrice: parseFloat(updatedProduct.salePrice)
      } : p
    ));
    navigate('/produtos'); 
  };
  
  const getNavLinkClass = (path) => {
    const currentPath = location.pathname;
    if (path === '/') return currentPath === '/' ? 'active' : '';
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
    if (path.startsWith('/usuarios')) return 'Usuários';
    if (path.startsWith('/consulta')) return 'Consulta';
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
          <div className="sidebar-brand" title="Padaria Real"><img src="/novo_logo.png" alt="Padaria Real" /></div>

          <nav className="nav-menu">
            <Link to="/" className="nav-link" aria-label="Dashboard">
              <button className={`nav-button ${getNavLinkClass('/')}`} data-label="Dashboard" type="button">
                <Home size={30} strokeWidth={2.3} />
                <span>Dashboard</span>
              </button>
            </Link>
            <Link to="/produtos" className="nav-link" aria-label="Cadastro de Produtos">
              <button className={`nav-button ${getNavLinkClass('/produtos')}`} data-label="Produtos" type="button">
                <Croissant size={31} strokeWidth={2.3} />
                <span>Produtos</span>
              </button>
            </Link>
            <Link to="/vendas" className="nav-link" aria-label="Vendas">
              <button className={`nav-button ${getNavLinkClass('/vendas')}`} data-label="Vendas" type="button">
                <ShoppingCart size={30} strokeWidth={2.3} />
                <span>Vendas</span>
              </button>
            </Link>
            <Link to="/desperdicio" className="nav-link" aria-label="Desperdício">
              <button className={`nav-button ${getNavLinkClass('/desperdicio')}`} data-label="Desperdício" type="button">
                <Trash2 size={30} strokeWidth={2.3} />
                <span>Desperdício</span>
              </button>
            </Link>
            <Link to="/categorias" className="nav-link" aria-label="Categorias">
              <button className={`nav-button ${getNavLinkClass('/categorias')}`} data-label="Categorias" type="button">
                <Shapes size={30} strokeWidth={2.3} />
                <span>Categorias</span>
              </button>
            </Link>
            {isAdmin && (
              <Link to="/usuarios" className="nav-link" aria-label="Usuários">
                <button className={`nav-button ${getNavLinkClass('/usuarios')}`} data-label="Usuários" type="button">
                  <Users size={31} strokeWidth={2.3} />
                  <span>Usuários</span>
                </button>
              </Link>
            )}
            <Link to="/consulta" className="nav-link" aria-label="Consulta">
              <button className={`nav-button ${getNavLinkClass('/consulta')}`} data-label="Consulta" type="button">
                <Search size={31} strokeWidth={2.3} />
                <span>Consulta</span>
              </button>
            </Link>
          </nav>

          <button className="logout-button" onClick={handleLogout} data-label="Sair" type="button" aria-label="Sair">
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
                <div className="user-avatar">
                  <UserCircle size={36} strokeWidth={2.1} />
                </div>
                <div className="user-text">
                  <strong>{currentUser?.name || currentUser?.username || 'Usuário'}</strong>
                  <span>{isAdmin ? 'Administrador' : 'Usuário'}</span>
                </div>
                <ChevronDown className="user-chevron" size={24} strokeWidth={2.4} />
              </summary>
<div className="user-dropdown">
  <button type="button" onClick={handleSwitchUser} className="dropdown-user-action">
    <UserPlus size={18} />
    Trocar usuário
  </button>

  <button type="button" onClick={handleLogout} className="dropdown-user-action logout">
    <LogOut size={18} />
    Sair da conta
  </button>
</div>
            </details>
          </header>
        )}
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={<RequireAuth isLoggedIn={isLoggedIn}>
            <Dashboard />
          </RequireAuth>} />
          <Route path="/consulta" element={<RequireAuth isLoggedIn={isLoggedIn}>
            <AdvancedProductList />
          </RequireAuth>} />
          <Route path="/produtos" element={<RequireAuth isLoggedIn={isLoggedIn}>
            <div className="product-management-layout">
              <div>
                <ProductFormNew />
              </div>
              <div>
                <ProductList />
              </div>
            </div>
          </RequireAuth>} />
          
          <Route path="/vendas" element={<RequireAuth isLoggedIn={isLoggedIn}>
            <SalesManagement />
          </RequireAuth>} />
          
          <Route path="/desperdicio" element={<RequireAuth isLoggedIn={isLoggedIn}>
            <WasteManagement />
          </RequireAuth>} />
          <Route path="/categorias" element={<RequireAuth isLoggedIn={isLoggedIn}>
            <CategoryManagement />
          </RequireAuth>} />
          <Route path="/usuarios" element={<RequireAuth isLoggedIn={isLoggedIn}>
            {isAdmin ? <UserManagement /> : <Navigate to="/" replace />}
          </RequireAuth>} />
          <Route path="/edit/:productId" element={<RequireAuth isLoggedIn={isLoggedIn}><EditProductForm products={products} onSave={handleSaveProduct} /></RequireAuth>} />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
'@ | Set-Content -Path "Codigo\\front\\src\\App.jsx" -Encoding UTF8
Write-Host "Corrigido: Codigo/front/src/App.jsx" -ForegroundColor Green
@'
import React, { useState } from 'react';
import './Management.css';
import { useUsers } from '../../hooks/useUsers';

function UserManagement() {
  const { users, loading, error: apiError, addUser, editUser, removeUser } = useUsers();
  const [formData, setFormData] = useState({ id: null, username: '', password: '', name: '', role: 'USER', active: true });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
        ...formData, 
        [name]: type === 'checkbox' ? checked : value 
    });
    setError('');
  };

  const handleStartEdit = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      password: '', 
      name: user.name || '',
      role: user.role || 'USER',
      active: user.active === true || user.active === 'true' || user.active === 1
    });
    setError('');
  };

  const handleCancelEdit = () => {
    setFormData({ id: null, username: '', password: '', name: '', role: 'USER', active: true });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username) {
        setError('O nome de usuário não pode ser vazio.');
        return;
    }
    
    const isDuplicate = users.some(
        u => u.username.toLowerCase() === formData.username.toLowerCase() && u.id !== formData.id
    );
    if (isDuplicate) {
        setError('Este nome de usuário já existe.');
        return;
    }

    try {
      if (formData.id) {
        console.log('[UserManagement] Atualizando usuário:', formData);
        const dataToSend = { ...formData };
        if (!dataToSend.password) {
          delete dataToSend.password;
        }
        await editUser(formData.id, dataToSend);
      } else {
        if (!formData.password) {
            setError('A senha é obrigatória para novos usuários.');
            return;
        }
        console.log('[UserManagement] Criando usuário:', formData);
        await addUser(formData);
      }
      handleCancelEdit();
    } catch (err) {
      setError(err.message || 'Erro ao salvar usuário');
    }
  };
  
  const handleReset = async (user) => {
      const newPassword = window.prompt(`Digite a nova senha para ${user.username}:`);
      if (newPassword && newPassword.length >= 6) {
          try {
            await editUser(user.id, {
              username: user.username,
              name: user.name || '',
              role: user.role || 'USER',
              active: user.active === true || user.active === 'true' || user.active === 1,
              password: newPassword
            });
            alert(`Senha de ${user.username} redefinida com sucesso.`);
          } catch (err) {
            alert('Erro ao redefinir senha: ' + err.message);
          }
      } else if (newPassword !== null && newPassword.length < 6) {
          alert('A senha deve ter pelo menos 6 caracteres.');
      }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Deseja realmente excluir este usuário?')) {
      try {
        await removeUser(userId);
      } catch (err) {
        alert('Erro ao excluir usuário: ' + err.message);
      }
    }
  };

  const inactiveUsers = users.filter(user => !user.active).length;
  const formCardStatusClass = (error || apiError) ? 'status-card--negative' : 'status-card--info';
  const listCardStatusClass = inactiveUsers > 0 ? 'status-card--warning' : 'status-card--positive';

  if (loading) {
    return <div className="loading">Carregando usuários...</div>;
  }

  return (
    <div className="user-management-container">
        <div className="user-management-flex-content">
            {/* Formulário de Criação/Edição */}
            <div className={`content-box user-form-box status-card ${formCardStatusClass}`}>
                <h2 className="content-box-title">
                    {formData.id ? 'Editar Usuário' : 'Novo Usuário'}
                </h2>
                <form onSubmit={handleSubmit} className="styled-form">
                    <input
                        type="text"
                        name="username"
                        placeholder="Nome de Usuário"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome Completo"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder={formData.id ? "Nova Senha (opcional)" : "Senha *"}
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                    >
                        <option value="USER">Usuário</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                    
                    {formData.id && (
                        <div className="form-checkbox-group">
                            <input
                                type="checkbox"
                                name="active"
                                id="active"
                                checked={formData.active}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="active" style={{display: 'inline', fontWeight: 'normal'}}>Conta Ativa</label>
                        </div>
                    )}
                    
                    <div className="button-group-edit" style={{marginTop: '20px'}}>
                        <button type="submit" className="save-button" disabled={loading}>
                            {formData.id ? 'Salvar Alterações' : 'Criar Usuário'}
                        </button>
                        {formData.id && (
                            <button type="button" onClick={handleCancelEdit} className="cancel-button">
                                Cancelar
                            </button>
                        )}
                    </div>
                    {(error || apiError) && <p className="error" style={{color: '#D32F2F', marginTop: '10px'}}>{error || apiError}</p>}
                </form>
            </div>

            {/* Lista de Usuários */}
            <div className={`content-box user-list-box status-card ${listCardStatusClass}`}>
                <h2 className="content-box-title">Usuários Cadastrados</h2>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuário</th>
                            <th>Nome</th>
                            <th>Função</th>
                            <th>Status</th>
                            <th style={{width: '200px'}}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const isActive = user.active === true || user.active === 'true' || user.active === 1;

                            return (
                                <tr key={user.id} className={isActive ? 'row-status-positive' : 'row-status-negative'}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.name || '-'}</td>
                                    <td>{user.role || 'USER'}</td>
                                    <td>
                                        <span className={`status-badge ${isActive ? 'status-badge--positive' : 'status-badge--negative'}`}>
                                            {isActive ? 'Ativo' : 'Desativado'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => handleStartEdit(user)}
                                            className="action-button edit-button"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleReset(user)}
                                            className="action-button action-button-reset"
                                        >
                                            Redefinir Senha
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="action-button delete-button"
                                            disabled={user.username === 'padariaReal'}
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
        </div>
    </div>
  );
}

export default UserManagement;
'@ | Set-Content -Path "Codigo\\front\\src\\components\\management\\UserManagement.jsx" -Encoding UTF8
Write-Host "Corrigido: Codigo/front/src/components/management/UserManagement.jsx" -ForegroundColor Green

Write-Host "" 
Write-Host "Pronto. Agora reinicie o backend e o frontend:" -ForegroundColor Yellow
Write-Host "1) Pare os terminais com Ctrl+C" 
Write-Host "2) Backend: cd Codigo\backend; mvn spring-boot:run" 
Write-Host "3) Frontend: cd Codigo\front; npm install; npm run dev" 
Write-Host "" 
Write-Host "Se o usuario admin nao enxergar a tela Usuarios, rode no MySQL:" -ForegroundColor Yellow
Write-Host "UPDATE users SET role='ADMIN', active=1 WHERE username='padariaReal';" 
