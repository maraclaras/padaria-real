import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCompanies } from '../../hooks/useCompanies';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));
};

const getProductQuantity = (product) => {
  return (
    product.quantity ??
    product.stockQuantity ??
    product.stock ??
    product.amount ??
    product.inventory ??
    0
  );
};

const getSalePrice = (product) => {
  return product.price ?? product.salePrice ?? product.sellPrice ?? 0;
};

const getCompanyName = (company) => {
  return company?.nome || company?.name || company?.nomeFantasia || '';
};

const getCompanyTypeLabel = (company) => {
  if (!company?.tipo && !company?.type) {
    return '';
  }

  const type = company.tipo || company.type;

  if (type === 'MATRIZ') {
    return 'Matriz';
  }

  if (type === 'FILIAL') {
    return 'Filial';
  }

  return type;
};

const formatCompanyType = (type) => {
  if (!type) {
    return '';
  }

  if (type === 'MATRIZ') {
    return 'Matriz';
  }

  if (type === 'FILIAL') {
    return 'Filial';
  }

  return type;
};

const getCompanyLabel = (product, companies = []) => {
  const directName =
    product.companyName ||
    product.nomeEmpresa ||
    product.empresaNome ||
    product.company?.nome ||
    product.company?.name ||
    product.company?.nomeFantasia;

  const directType =
    product.companyType ||
    product.tipoEmpresa ||
    product.company?.tipo ||
    product.company?.type;

  if (directName) {
    const formattedType = formatCompanyType(directType);
    return formattedType ? `${directName} (${formattedType})` : directName;
  }

  const companyId =
    product.companyId ??
    product.empresaId ??
    product.company_id ??
    product.company?.id;

  const company = companies.find((item) => Number(item.id) === Number(companyId));

  if (company) {
    const typeLabel = getCompanyTypeLabel(company);
    return `${getCompanyName(company)}${typeLabel ? ` (${typeLabel})` : ''}`;
  }

  return 'Não informado';
};

function ProductList() {
  const navigate = useNavigate();

  const {
    products,
    loading,
    error,
    deleteExistingProduct,
    search,
    loadProducts,
  } = useProducts();

  const { companies } = useCompanies();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const handleEdit = (productId) => {
    navigate(`/edit/${productId}`);
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

  const handleSearch = async (event) => {
    event.preventDefault();

    if (searchTerm.trim()) {
      await search(searchTerm.trim());
      setSearchActive(true);
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm('');
    setSearchActive(false);
    await loadProducts();
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <p style={{ textAlign: 'center', margin: '20px 0' }}>
        Carregando produtos...
      </p>
    );
  }

  if (error) {
    return (
      <div className="product-list-results status-card status-card--negative">
        <p>Erro ao carregar produtos: {error}</p>
        <p>Verifique se o backend está rodando em http://localhost:8080</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list-results status-card status-card--warning">
        <p style={{ textAlign: 'center', margin: '20px 0' }}>
          Nenhum produto encontrado.
        </p>
      </div>
    );
  }

  const hasLowStock = products.some(
    (product) => Number(getProductQuantity(product)) < 10
  );

  const listCardStatusClass = hasLowStock
    ? 'status-card--warning'
    : 'status-card--positive';

  return (
    <div className={`product-list-card content-box status-card ${listCardStatusClass}`}>
      <div className="product-list-header">
        <h2 className="content-box-title">Produtos Cadastrados</h2>

        <form onSubmit={handleSearch} className="product-list-search">
          <input
            type="text"
            placeholder="Buscar produto por nome..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button type="submit">Buscar</button>

          {searchActive && (
            <button type="button" onClick={handleClearSearch}>
              Limpar
            </button>
          )}
        </form>
      </div>

      <div className="product-list-container">
        <table className="data-table product-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Empresa</th>
              <th>Venda</th>
              <th>Qtd.</th>
              <th className="actions-cell">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={
                    Number(getProductQuantity(product)) < 10
                      ? 'row-status-negative'
                      : 'row-status-positive'
                  }
                >
                  <td data-label="Nome">
                    <div className="product-name-cell">
                      <strong>{product.name}</strong>
                      <span>{product.description || 'Sem descrição'}</span>
                    </div>
                  </td>

                  <td data-label="Categoria">
                    {product.category || '-'}
                  </td>

                  <td data-label="Empresa" className="product-company-cell">
                    {getCompanyLabel(product, companies)}
                  </td>

                  <td data-label="Venda" className="money-cell">
                    <strong>{formatCurrency(getSalePrice(product))}</strong>
                  </td>

                  <td data-label="Qtd." className="quantity-cell">
                    {getProductQuantity(product)}
                  </td>

                  <td data-label="Ações" className="actions-cell">
                    <div className="actions-buttons">
                      <button
                        type="button"
                        className="action-button edit-button"
                        onClick={() => handleEdit(product.id)}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      <button
                        type="button"
                        className="action-button delete-button"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={16} />
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
    </div>
  );
}

export default ProductList;