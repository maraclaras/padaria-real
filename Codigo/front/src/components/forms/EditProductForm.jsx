import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getProductById, updateProduct } from '../../services/api';
import { useCategories } from '../../hooks/useCategories';
import { useCompanies } from '../../hooks/useCompanies';

const getCompanyName = (company) => company?.nome || company?.name || company?.nomeFantasia || '';

const getCompanyTypeLabel = (company) => {
  if (!company?.tipo) return '';
  return company.tipo === 'MATRIZ' ? 'Matriz' : company.tipo === 'FILIAL' ? 'Filial' : company.tipo;
};

function EditProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.from || '/produtos';

  const { categories } = useCategories();
  const { companies } = useCompanies();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const data = await getProductById(productId);

        setProduct({
          ...data,
          companyId: data.companyId ?? data.empresaId ?? data.company?.id ?? '',
        });
      } catch (err) {
        setError('Erro ao carregar produto: ' + err.message);
        console.error('Erro ao carregar produto:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.costPrice ||
      !product.price ||
      product.quantity === '' ||
      product.quantity === null ||
      product.quantity === undefined ||
      !product.category ||
      !product.companyId
    ) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: product.name.trim(),
        description: product.description?.trim() || null,
        costPrice: parseFloat(product.costPrice),
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity, 10),
        category: product.category?.trim() || null,
        companyId: Number(product.companyId),
      };

      await updateProduct(productId, productData);

      alert('Produto atualizado com sucesso!');
      navigate(returnTo);
    } catch (err) {
      alert('Erro ao salvar produto: ' + err.message);
      console.error('Erro ao salvar:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(returnTo);
  };

  if (loading) {
    return (
      <div className="edit-container-layout">
        <div className="content-box">
          <div>Carregando produto...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-container-layout">
        <div className="content-box">
          <div style={{ color: 'red' }}>{error}</div>

          <button
            type="button"
            onClick={() => navigate(returnTo)}
            style={{ marginTop: '10px' }}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="edit-container-layout">
        <div className="content-box">
          <div>Produto não encontrado.</div>

          <button
            type="button"
            onClick={() => navigate(returnTo)}
            style={{ marginTop: '10px' }}
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container-layout">
      <div className="content-box">
        <h2 className="content-box-title">Editar produto: {product.name}</h2>

        <form onSubmit={handleSave} className="styled-form">
          <div className="form-group">
            <label>Nome do produto *</label>
            <input
              type="text"
              name="name"
              value={product.name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              name="description"
              value={product.description || ''}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Categoria *</label>
            <select
              name="category"
              value={product.category || ''}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a categoria</option>

              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Empresa / Filial *</label>
            <select
              name="companyId"
              value={product.companyId || ''}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a empresa/filial</option>

              {companies
                .filter((company) => company.ativo !== false)
                .map((company) => (
                  <option key={company.id} value={company.id}>
                    {getCompanyName(company)} ({getCompanyTypeLabel(company)})
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Preço de custo (R$) *</label>
            <input
              type="number"
              name="costPrice"
              value={product.costPrice || ''}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Preço de venda (R$) *</label>
            <input
              type="number"
              name="price"
              value={product.price || ''}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Quantidade *</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity ?? ''}
              onChange={handleChange}
              min="0"
              step="1"
              required
            />
          </div>

          <div className="button-group-edit">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductForm;
