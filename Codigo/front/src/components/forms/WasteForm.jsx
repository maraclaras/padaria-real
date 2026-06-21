import React, { useState } from 'react';
import { useWaste } from '../../hooks/useWaste';
import { useProducts } from '../../hooks/useProducts';
import { useCompanies } from '../../hooks/useCompanies';
import { getCompanyDisplayName } from '../../utils/companyUtils';

function WasteForm() {
  const { registerWaste, loading, error } = useWaste();
  const { products } = useProducts();
  const { companies } = useCompanies();

  const [waste, setWaste] = useState({
    productId: '',
    quantityWasted: '',
    reason: '',
    customReason: '',
    unitCost: '',
    companyId: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setWaste(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value, 10);
    const product = products.find(p => Number(p.id) === Number(productId));

    setWaste(prev => ({
      ...prev,
      productId: e.target.value,
      unitCost: product ? product.costPrice : '',
      companyId: product ? product.companyId || '' : ''
    }));
  };

  const handleReasonChange = (e) => {
    const reason = e.target.value;

    setWaste(prev => ({
      ...prev,
      reason,
      customReason: reason === 'Outro' ? prev.customReason : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalReason = waste.reason === 'Outro'
      ? waste.customReason.trim()
      : waste.reason;

    if (!waste.productId || !waste.quantityWasted || !waste.reason || !waste.unitCost) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (waste.reason === 'Outro' && !waste.customReason.trim()) {
      setMessage('Por favor, informe o motivo do desperdício.');
      return;
    }

    const quantityWasted = parseInt(waste.quantityWasted, 10);
    const unitCost = parseFloat(waste.unitCost);

    if (quantityWasted < 1 || Number.isNaN(quantityWasted)) {
      setMessage('Informe uma quantidade válida.');
      return;
    }

    if (unitCost < 0 || Number.isNaN(unitCost)) {
      setMessage('Informe um custo unitário válido.');
      return;
    }

try {
  await registerWaste({
    productId: parseInt(waste.productId, 10),
    quantityWasted,
    reason: finalReason,
    unitCost,
    totalLoss: unitCost * quantityWasted,
    companyId: waste.companyId ? Number(waste.companyId) : null
  });

  setMessage('Desperdício registrado com sucesso!');

  setWaste({
    productId: '',
    quantityWasted: '',
    reason: '',
    customReason: '',
    unitCost: '',
    companyId: ''
  });

  setTimeout(() => {
    window.location.reload();
  }, 800);
} catch (err) {
  setMessage(`Erro: ${err.message}`);
}
  };

  return (
    <div className="content-box">
      <h2 className="content-box-title">Registrar Desperdício</h2>

      {message && (
        <div
          style={{
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: message.includes('Erro') ? '#ffebee' : '#e8f5e9',
            color: message.includes('Erro') ? '#c62828' : '#2e7d32',
            borderRadius: '5px'
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="styled-form">
        <div className="form-group">
          <label>Produto *</label>
          <select
            name="productId"
            value={waste.productId}
            onChange={handleProductChange}
            required
          >
            <option value="">Selecione um produto</option>

            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {getCompanyDisplayName(companies, product.companyId)} (Estoque: {product.quantity})
              </option>
            ))}
          </select>
          {waste.companyId && (
            <span className="company-context-text">
              {getCompanyDisplayName(companies, waste.companyId)}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>Quantidade desperdiçada *</label>
          <input
            type="number"
            name="quantityWasted"
            placeholder="Ex: 5"
            value={waste.quantityWasted}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Motivo *</label>
          <select
            name="reason"
            value={waste.reason}
            onChange={handleReasonChange}
            required
          >
            <option value="">Selecione um motivo</option>
            <option value="Vencimento">Vencimento</option>
            <option value="Queimado">Queimado</option>
            <option value="Estragado">Estragado</option>
            <option value="Não vendido">Não vendido</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        {waste.reason === 'Outro' && (
          <div className="form-group">
            <label>Informe o motivo *</label>
            <input
              type="text"
              name="customReason"
              placeholder="Ex: Produto caiu no chão"
              value={waste.customReason}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Custo unitário *</label>
          <input
            type="number"
            name="unitCost"
            placeholder="R$ 0,00"
            value={waste.unitCost}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
          {loading ? 'Registrando...' : 'Registrar desperdício'}
        </button>

        {error && (
          <div style={{ color: '#d32f2f', marginTop: '10px' }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default WasteForm;