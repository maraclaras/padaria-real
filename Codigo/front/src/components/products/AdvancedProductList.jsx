import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCompanies } from '../../hooks/useCompanies';
import { getCompanyDisplayName } from '../../utils/companyUtils';
import '../management/Management.css';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
};

const getSalePrice = (product) => {
  return product.price ?? product.salePrice ?? 0;
};

const getQuantity = (product) => {
  return product.quantity ?? product.stockQuantity ?? product.stock ?? product.amount ?? 0;
};

function FilterBar({ filters, setFilters, categories }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFilters(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      category: '',
      minCost: '',
      maxCost: '',
      minSale: '',
      maxSale: '',
      minExpiry: '',
      maxExpiry: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  return (
    <section className="content-box consultation-filter-card">
      <h2 className="content-box-title">Filtros Avançados</h2>

      <div className="consultation-filter-grid">
        <input
          type="text"
          name="name"
          placeholder="Nome do produto"
          value={filters.name}
          onChange={handleChange}
        />

        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">Todas as categorias</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="minCost"
          placeholder="Custo mín."
          value={filters.minCost}
          onChange={handleChange}
        />

        <input
          type="number"
          name="maxCost"
          placeholder="Custo máx."
          value={filters.maxCost}
          onChange={handleChange}
        />

        <input
          type="number"
          name="minSale"
          placeholder="Venda mín."
          value={filters.minSale}
          onChange={handleChange}
        />

        <input
          type="number"
          name="maxSale"
          placeholder="Venda máx."
          value={filters.maxSale}
          onChange={handleChange}
        />

        <div className="consultation-date-field">
          <label>Vencimento de:</label>
          <input
            type="date"
            name="minExpiry"
            value={filters.minExpiry}
            onChange={handleChange}
          />
        </div>

        <div className="consultation-date-field">
          <label>Vencimento até:</label>
          <input
            type="date"
            name="maxExpiry"
            value={filters.maxExpiry}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="consultation-sort-row">
        <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
          <option value="name">Ordenar por nome</option>
          <option value="costPrice">Ordenar por custo</option>
          <option value="price">Ordenar por venda</option>
          <option value="quantity">Ordenar por quantidade</option>
          <option value="expiryDate">Ordenar por vencimento</option>
        </select>

        <select name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>

        <button type="button" className="clear-button" onClick={handleClearFilters}>
          Limpar filtros
        </button>
      </div>
    </section>
  );
}

function AdvancedProductList() {
  const navigate = useNavigate();
  const { products, loading, error, deleteExistingProduct } = useProducts();
  const { categories } = useCategories();
  const { companies } = useCompanies();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minCost: '',
    maxCost: '',
    minSale: '',
    maxSale: '',
    minExpiry: '',
    maxExpiry: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    result = result.filter(product => {
      const name = product.name || '';
      const category = product.category || '';
      const cost = Number(product.costPrice || 0);
      const sale = Number(getSalePrice(product));
      const expiry = product.expiryDate;

      if (filters.name && !name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      if (filters.category && category !== filters.category) {
        return false;
      }

      if (filters.minCost !== '' && cost < filters.minCost) {
        return false;
      }

      if (filters.maxCost !== '' && cost > filters.maxCost) {
        return false;
      }

      if (filters.minSale !== '' && sale < filters.minSale) {
        return false;
      }

      if (filters.maxSale !== '' && sale > filters.maxSale) {
        return false;
      }

      if (filters.minExpiry && expiry && expiry < filters.minExpiry) {
        return false;
      }

      if (filters.maxExpiry && expiry && expiry > filters.maxExpiry) {
        return false;
      }

      return true;
    });

    result.sort((a, b) => {
      let comparison = 0;

      if (filters.sortBy === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '');
      }

      if (filters.sortBy === 'costPrice') {
        comparison = Number(a.costPrice || 0) - Number(b.costPrice || 0);
      }

      if (filters.sortBy === 'price') {
        comparison = Number(getSalePrice(a)) - Number(getSalePrice(b));
      }

      if (filters.sortBy === 'quantity') {
        comparison = Number(getQuantity(a)) - Number(getQuantity(b));
      }

      if (filters.sortBy === 'expiryDate') {
        comparison = new Date(a.expiryDate || 0).getTime() - new Date(b.expiryDate || 0).getTime();
      }

      return filters.sortOrder === 'asc' ? comparison : comparison * -1;
    });

    return result;
  }, [products, filters]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return filteredAndSortedProducts;
    }

    return filteredAndSortedProducts.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredAndSortedProducts, searchTerm]);

const handleEdit = (id) => {
  navigate(`/edit/${id}`, { state: { from: '/consulta' } });
};

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteExistingProduct(id);
        alert('Produto excluído com sucesso!');
      } catch (err) {
        alert('Erro ao excluir produto: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="error">Erro ao carregar produtos: {error}</div>;
  }

  return (
    <div className="advanced-list-container consultation-page">
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        categories={categories}
      />

      <section className="content-box consultation-results-card">
        <div className="consultation-results-header">
          <h2 className="content-box-title">
            Resultados ({filteredAndSortedProducts.length} produtos)
          </h2>

          <div className="consultation-search-row">
            <input
              type="text"
              placeholder="Buscar produto por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button type="button" onClick={() => setSearchTerm('')}>
              Limpar
            </button>
          </div>
        </div>

        <div className="consultation-table-wrapper">
          <table className="data-table consultation-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Empresa</th>
                <th>Custo</th>
                <th>Venda</th>
                <th>Qtd.</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {searchResults.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-table-message">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                searchResults.map(product => (
                  <tr key={product.id}>
                    <td data-label="Nome">{product.name}</td>

                    <td data-label="Descrição">
                      {product.description || '-'}
                    </td>

                    <td data-label="Categoria">
                      {product.category || '-'}
                    </td>

                    <td data-label="Empresa">
                      {getCompanyDisplayName(companies, product.companyId)}
                    </td>

                    <td data-label="Custo" className="money-cell">
                      {formatCurrency(product.costPrice)}
                    </td>

                    <td data-label="Venda" className="money-cell">
                      {formatCurrency(getSalePrice(product))}
                    </td>

                    <td data-label="Qtd." className="quantity-cell">
                      {getQuantity(product)}
                    </td>

                    <td data-label="Ações" className="actions-cell">
                      <div className="actions-buttons">
                        <button
                          type="button"
                          className="action-button edit-button"
                          onClick={() => handleEdit(product.id)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="action-button delete-button"
                          onClick={() => handleDelete(product.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdvancedProductList;