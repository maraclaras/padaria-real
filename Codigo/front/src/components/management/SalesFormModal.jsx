import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCompanies } from '../../hooks/useCompanies';
import { getCompanyDisplayName } from '../../utils/companyUtils';

function SalesFormModal({
  onClose,
  onSubmit,
  products = [],
  initialData = {},
  isEditing = false
}) {
  const { companies } = useCompanies();

  const getInitialDate = () => {
    const rawDate = initialData.date || initialData.saleDate;

    if (!rawDate) {
      return new Date().toISOString().substring(0, 10);
    }

    if (typeof rawDate === 'string') {
      return rawDate.substring(0, 10);
    }

    if (typeof rawDate === 'number') {
      return new Date(rawDate).toISOString().substring(0, 10);
    }

    return new Date().toISOString().substring(0, 10);
  };

  const [date, setDate] = useState(getInitialDate());
  const [cart, setCart] = useState([]);

  const [currentItem, setCurrentItem] = useState({
    productId: initialData.productId || '',
    productName: initialData.productName || '',
    quantity: initialData.quantity ?? initialData.quantitySold ?? 1,
    costPrice: initialData.costPrice || '',
    salePrice: initialData.salePrice ?? initialData.unitPrice ?? '',
    paymentMethod: initialData.paymentMethod || 'Dinheiro',
    companyId: initialData.companyId || '',
  });

  useEffect(() => {
    if (isEditing && initialData) {
      const productById = products.find(
        product => Number(product.id) === Number(initialData.productId)
      );

      const productByName = products.find(
        product => product.name === initialData.productName
      );

      const product = productById || productByName;

      setDate(getInitialDate());

      setCurrentItem({
        productId: product ? product.id : initialData.productId || '',
        productName: product ? product.name : initialData.productName || '',
        quantity: initialData.quantity ?? initialData.quantitySold ?? 1,
        costPrice: initialData.costPrice ?? product?.costPrice ?? '',
        salePrice:
          initialData.salePrice ??
          initialData.unitPrice ??
          product?.price ??
          product?.salePrice ??
          '',
        paymentMethod: initialData.paymentMethod || 'Dinheiro',
        companyId: initialData.companyId || product?.companyId || '',
      });
    }
  }, [isEditing, initialData, products]);

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value, 10);

    const selectedProduct = products.find(
      product => Number(product.id) === Number(productId)
    );

    if (selectedProduct) {
      setCurrentItem(prev => ({
        ...prev,
        productId,
        productName: selectedProduct.name,
        costPrice: selectedProduct.costPrice ?? '',
        salePrice: selectedProduct.price ?? selectedProduct.salePrice ?? '',
        companyId: selectedProduct.companyId || '',
      }));
    } else {
      setCurrentItem(prev => ({
        ...prev,
        productId: '',
        productName: '',
        costPrice: '',
        salePrice: '',
        companyId: '',
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCurrentItem(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateCurrentItem = () => {
    if (!currentItem.productId && !currentItem.productName) {
      alert('Selecione um produto.');
      return false;
    }

    if (!currentItem.quantity || parseInt(currentItem.quantity, 10) < 1) {
      alert('Informe uma quantidade válida.');
      return false;
    }

    if (
      currentItem.costPrice === '' ||
      currentItem.costPrice === null ||
      currentItem.costPrice === undefined
    ) {
      alert('Informe o custo unitário.');
      return false;
    }

    if (
      currentItem.salePrice === '' ||
      currentItem.salePrice === null ||
      currentItem.salePrice === undefined
    ) {
      alert('Informe o valor de venda unitário.');
      return false;
    }

    return true;
  };

  const addToCart = () => {
    if (!validateCurrentItem()) {
      return;
    }

    const quantity = parseInt(currentItem.quantity, 10);
    const salePrice = parseFloat(currentItem.salePrice);
    const costPrice = parseFloat(currentItem.costPrice);

    const newItem = {
      productId: parseInt(currentItem.productId, 10),
      productName: currentItem.productName,
      quantity,
      quantitySold: quantity,
      costPrice,
      salePrice,
      unitPrice: salePrice,
      totalAmount: quantity * salePrice,
      paymentMethod: currentItem.paymentMethod || 'Dinheiro',
      companyId: currentItem.companyId || null,
      tempId: Date.now(),
    };

    setCart(prev => [...prev, newItem]);

    setCurrentItem(prev => ({
      ...prev,
      productId: '',
      productName: '',
      quantity: 1,
      costPrice: '',
      salePrice: '',
      paymentMethod: prev.paymentMethod || 'Dinheiro',
      companyId: '',
    }));
  };

  const removeFromCart = (tempId) => {
    setCart(prev => prev.filter(item => item.tempId !== tempId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      if (!validateCurrentItem()) {
        return;
      }

      const quantity = parseInt(currentItem.quantity, 10);
      const salePrice = parseFloat(currentItem.salePrice);
      const costPrice = parseFloat(currentItem.costPrice);
      const totalAmount = quantity * salePrice;

      onSubmit({
        ...initialData,

        productId: currentItem.productId
          ? parseInt(currentItem.productId, 10)
          : initialData.productId,

        productName: currentItem.productName,

        quantity,
        quantitySold: quantity,

        costPrice,

        salePrice,
        unitPrice: salePrice,

        totalAmount,

        paymentMethod: currentItem.paymentMethod || 'Dinheiro',
        companyId: currentItem.companyId || null,

        date,
        saleDate: date,
      });

      return;
    }

    if (cart.length === 0) {
      alert('Adicione pelo menos um item ao carrinho.');
      return;
    }

    const salesBatch = cart.map(item => ({
      productId: item.productId,
      productName: item.productName,

      quantity: item.quantity,
      quantitySold: item.quantity,

      costPrice: item.costPrice,

      salePrice: item.salePrice,
      unitPrice: item.salePrice,

      totalAmount: item.quantity * item.salePrice,

      paymentMethod: item.paymentMethod || 'Dinheiro',
      companyId: item.companyId || null,

      date,
      saleDate: date,
    }));

    onSubmit(salesBatch);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.salePrice,
    0
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <h2 className="modal-title">
          {isEditing ? 'Editar Venda' : 'Nova Venda'}
        </h2>

        <div className="form-group">
          <label>Data da Venda:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div
          className="add-item-box"
          style={{
            background: '#fff3e0',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}
        >
          <div
            className="form-row"
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '10px'
            }}
          >
            <div style={{ flex: 2 }}>
              <label>Produto</label>
              <select
                name="productId"
                value={currentItem.productId}
                onChange={handleProductChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="">Selecione...</option>

                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {getCompanyDisplayName(companies, product.companyId)}
                  </option>
                ))}
              </select>
              {currentItem.companyId && (
                <small style={{ display: 'block', marginTop: '6px', color: '#6f665d', fontWeight: 700 }}>
                  {getCompanyDisplayName(companies, currentItem.companyId)}
                </small>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <label>Qtd</label>
              <input
                type="number"
                name="quantity"
                value={currentItem.quantity}
                onChange={handleInputChange}
                min="1"
              />
            </div>
          </div>

          <div
            className="form-row"
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '10px'
            }}
          >
            <div style={{ flex: 1 }}>
              <label>Custo Unit.</label>
              <input
                type="number"
                name="costPrice"
                value={currentItem.costPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>Venda Unit.</label>
              <input
                type="number"
                name="salePrice"
                value={currentItem.salePrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div
            className="form-row"
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '10px'
            }}
          >
            <div style={{ flex: 1 }}>
              <label>Forma de Pagamento</label>
              <select
                name="paymentMethod"
                value={currentItem.paymentMethod || 'Dinheiro'}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão Crédito">Cartão Crédito</option>
                <option value="Cartão Débito">Cartão Débito</option>
                <option value="PIX">PIX</option>
              </select>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={addToCart}
              className="action-button primary"
              style={{
                marginTop: '15px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Plus size={16} />
              Adicionar ao Carrinho
            </button>
          )}
        </div>

        {!isEditing && (
          <div
            className="cart-list"
            style={{
              marginBottom: '20px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', color: '#a36c2f' }}>
              Itens no Carrinho ({cart.length})
            </h4>

            {cart.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#666' }}>
                Nenhum item adicionado.
              </p>
            ) : (
              <table className="data-table" style={{ fontSize: '0.9em' }}>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Pagamento</th>
                    <th>Empresa</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {cart.map(item => (
                    <tr key={item.tempId}>
                      <td style={{ padding: '8px' }}>{item.productName}</td>
                      <td style={{ padding: '8px' }}>{item.quantity}</td>
                      <td style={{ padding: '8px' }}>{item.paymentMethod}</td>
                      <td style={{ padding: '8px' }}>{getCompanyDisplayName(companies, item.companyId)}</td>
                      <td style={{ padding: '8px' }}>
                        R$ {(item.quantity * item.salePrice).toFixed(2)}
                      </td>
                      <td style={{ padding: '8px' }}>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.tempId)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#D32F2F',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {cart.length > 0 && (
              <div
                style={{
                  textAlign: 'right',
                  marginTop: '10px',
                  fontWeight: 'bold',
                  fontSize: '1.2em',
                  color: '#5c3c1e'
                }}
              >
                Total: R$ {cartTotal.toFixed(2)}
              </div>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="secondary-button"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="primary-button"
          >
            {isEditing ? 'Salvar Alterações' : 'Finalizar Venda'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SalesFormModal;