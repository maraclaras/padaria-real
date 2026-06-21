import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCompanies } from '../../hooks/useCompanies';

const getCompanyName = (company) => company?.nome || company?.name || company?.nomeFantasia || '';

const getCompanyTypeLabel = (company) => {
  if (!company?.tipo) return '';
  return company.tipo === 'MATRIZ' ? 'Matriz' : company.tipo === 'FILIAL' ? 'Filial' : company.tipo;
};

function ProductFormNew() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    products,
    createNewProduct,
    updateExistingProduct,
    loadProducts,
    loading,
  } = useProducts();

  const { categories } = useCategories();
  const { companies } = useCompanies();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    costPrice: '',
    price: '',
    quantity: '',
    category: '',
    companyId: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const product = products.find(p => p.id === Number(id));

      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          costPrice: product.costPrice || '',
          price: product.price || '',
          quantity: product.quantity || '',
          category: product.category || '',
          companyId: product.companyId ?? product.empresaId ?? product.company?.id ?? '',
        });
      }
    }
  }, [id, products]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.costPrice || formData.costPrice <= 0) {
      newErrors.costPrice = 'Preço de custo deve ser maior que zero';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Preço de venda deve ser maior que zero';
    }

    if (!formData.quantity || formData.quantity < 0) {
      newErrors.quantity = 'Quantidade não pode ser negativa';
    }

    if (!formData.category || !formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.companyId) {
      newErrors.companyId = 'Empresa/Filial é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        costPrice: parseFloat(formData.costPrice),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        category: formData.category.trim() || null,
        companyId: Number(formData.companyId),
      };

      if (id) {
        await updateExistingProduct(Number(id), productData);
        alert('Produto atualizado com sucesso!');
      } else {
        await createNewProduct(productData);
        await loadProducts();
        alert('Produto criado com sucesso!');
      }

      navigate('/produtos');
    } catch (error) {
      alert('Erro ao salvar produto: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/produtos');
  };

  const hasErrors = Object.keys(errors).length > 0;

  const hasStartedFilling = Boolean(
    formData.name ||
    formData.description ||
    formData.costPrice ||
    formData.price ||
    formData.quantity ||
    formData.category ||
    formData.companyId
  );

  const formCardStatusClass = hasErrors
    ? 'status-card--negative'
    : hasStartedFilling
      ? 'status-card--positive'
      : 'status-card--info';

  if (loading && id) {
    return <p style={{ textAlign: 'center', margin: '20px 0' }}>Carregando...</p>;
  }

  return (
    <div className={`content-box status-card ${formCardStatusClass}`}>
      <h2 className="content-box-title">
        {id ? 'Editar Produto' : 'Criar Novo Produto'}
      </h2>

      <form onSubmit={handleSubmit} className="styled-form">
        <div className="form-group">
          <label>Nome *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Pão Francês"
            required
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Pão francês tradicional"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Categoria *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a categoria</option>

            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Empresa / Filial *</label>
          <select
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a empresa/filial</option>

            {companies
              .filter((company) => company.ativo !== false)
              .map(company => (
                <option key={company.id} value={company.id}>
                  {getCompanyName(company)} ({getCompanyTypeLabel(company)})
                </option>
              ))}
          </select>
          {errors.companyId && <span className="field-error">{errors.companyId}</span>}
        </div>

        <div className="form-group">
          <label>Preço de Custo (R$) *</label>
          <input
            type="number"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
          {errors.costPrice && <span className="field-error">{errors.costPrice}</span>}
        </div>

        <div className="form-group">
          <label>Preço de Venda (R$) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label>Quantidade *</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            placeholder="0"
            required
          />
          {errors.quantity && <span className="field-error">{errors.quantity}</span>}
        </div>

        <div className="button-group-edit">
          {/* <button type="button" onClick={handleCancel} className="cancel-button">
            Cancelar
          </button> */}

          <button type="submit" className="save-button" disabled={submitting}>
            {submitting ? 'Salvando...' : id ? 'Salvar Alterações' : 'Criar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductFormNew;
