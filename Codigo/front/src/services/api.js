const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const API_BASE_URL = `${API_HOST}/api`;

/**
 * ServiÃƒÆ’Ã‚Â§o centralizado para comunicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o com a API do backend
 */

// ConfigurAções padrÃƒÆ’Ã‚Â£o para requisiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes
const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Função auxiliar para fazer requisiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes HTTP
 * @param {string} endpoint - Caminho da API (ex: '/products')
 * @param {string} method - MÃƒÆ’Ã‚Â©todo HTTP (GET, POST, PUT, DELETE)
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
      throw new Error(errorText || `HTTP Error: ${response.status} ${response.statusText}`);
    }

    // Trata respostas vazias (204 No Content)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error(`Erro na requisiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o ${method} ${endpoint}:`, error);
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
 * ===== DESPERDÃƒÆ’Ã‚ÂCIO =====
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
 * ===== USUÃƒÆ’Ã‚ÂRIOS =====
 */

export const getUsers = () => makeRequest('/users', 'GET');
export const getUserById = (id) => makeRequest(`/users/${id}`, 'GET');
export const createUser = (userData) => makeRequest('/users', 'POST', userData);
export const updateUser = (id, userData) => makeRequest(`/users/${id}`, 'PUT', userData);
export const deleteUser = (id) => makeRequest(`/users/${id}`, 'DELETE');
export const loginUser = (username, password) =>
  makeRequest('/users/login', 'POST', {
    username,
    password,
  });
/**
 * ===== UTILITÃƒÆ’Ã‚ÂRIOS =====
 */

export const checkApiHealth = async () => {
  try {
    const products = await getAllProducts();
    return { status: 'online', data: products };
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
};


/**
 * ===== EMPRESAS E FILIAIS =====
 */

export const getAllCompanies = () => makeRequest('/companies', 'GET');
export const getCompanyById = (id) => makeRequest(`/companies/${id}`, 'GET');
export const searchCompanies = (term) => makeRequest(`/companies/search?term=${encodeURIComponent(term)}`, 'GET');
export const getCompaniesByTipo = (tipo) => makeRequest(`/companies/tipo/${encodeURIComponent(tipo)}`, 'GET');
export const getBranchesByMatriz = (matrizId) => makeRequest(`/companies/matriz/${matrizId}/filiais`, 'GET');
export const createCompany = (companyData) => makeRequest('/companies', 'POST', companyData);
export const updateCompany = (id, companyData) => makeRequest(`/companies/${id}`, 'PUT', companyData);
export const deleteCompany = (id) => makeRequest(`/companies/${id}`, 'DELETE');
