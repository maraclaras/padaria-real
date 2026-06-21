import React, { useState } from 'react';
import { useSales } from '../../hooks/useSales';
import { useProducts } from '../../hooks/useProducts';
import { useCompanies } from '../../hooks/useCompanies';
import { getCompanyDisplayName } from '../../utils/companyUtils';
import { Plus, Trash2 } from 'lucide-react';

function SalesFormNew() {
  const { createNewSale, loading, error } = useSales();
  const { products } = useProducts();
  const { companies } = useCompanies();

  const [cart, setCart] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1,
    unitPrice: 0,
    paymentMethod: 'Dinheiro',
    companyId: ''
  });

  const [message, setMessage] = useState('');

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value, 10);
    const product = products.find(p => p.id === productId);

    setCurrentItem({
      ...currentItem,
      productId,
      unitPrice: product ? product.price : 0,
      companyId: product ? product.companyId : ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCurrentItem({
      ...currentItem,
      [name]: name === 'quantity'
        ? parseInt(value, 10)
        : name === 'unitPrice'
          ? parseFloat(value)
          : value
    });
  };

  const addToCart = () => {
    if (!currentItem.productId || currentItem.quantity < 1) {
      setMessage('Selecione um produto e uma quantidade válida.');
      return;
    }

    const product = products.find(p => p.id === currentItem.productId);

    if (!product) {
      setMessage('Produto não encontrado.');
      return;
    }

    if (product.quantity < currentItem.quantity) {
      setMessage(`Estoque insuficiente. Disponível: ${product.quantity}`);
      return;
    }

    const newItem = {
      id: Date.now(),
      productId: currentItem.productId,
      productName: product.name,
      quantity: currentItem.quantity,
      unitPrice: currentItem.unitPrice,
      totalAmount: currentItem.quantity * currentItem.unitPrice,
      paymentMethod: currentItem.paymentMethod,
      companyId: product.companyId || null
    };

    setCart([...cart, newItem]);
    setCurrentItem({
      productId: '',
      quantity: 1,
      unitPrice: 0,
      paymentMethod: 'Dinheiro',
      companyId: ''
    });
    setMessage('');
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setMessage('Adicione pelo menos um item ao carrinho.');
      return;
    }

    try {
      for (const item of cart) {
        await createNewSale({
          productId: item.productId,
          quantitySold: item.quantity,
          unitPrice: item.unitPrice,
          totalAmount: item.quantity * item.unitPrice,
          paymentMethod: item.paymentMethod,
          notes: '',
          companyId: item.companyId || null
        });
      }

      setMessage('Vendas registradas com sucesso!');
      setCart([]);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Erro: ${err.message}`);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalAmount, 0);
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="content-box">
      <h2 className="content-box-title">Registrar Venda</h2>

      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: message.includes('Erro') ? '#ffebee' : '#e8f5e9',
          color: message.includes('Erro') ? '#c62828' : '#2e7d32',
          borderRadius: '5px'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Seção de adição de item */}
        <div style={{
          backgroundColor: '#fff3e0',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#a36c2f' }}>
            Adicionar Item
          </h3>

          <div className="form-group">
            <label>Produto *</label>
            <select
              value={currentItem.productId}
              onChange={handleProductChange}
              required
            >
              <option value="">Selecione um produto</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} - {getCompanyDisplayName(companies, p.companyId)} - R$ {p.price.toFixed(2)} (Estoque: {p.quantity})
                </option>
              ))}
            </select>
          </div>

          {currentItem.productId && (() => {
            const selectedProduct = products.find(p => p.id === parseInt(currentItem.productId, 10));

            return selectedProduct ? (
              <div style={{
                backgroundColor: '#e3f2fd',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '10px',
                fontSize: '0.9em'
              }}>
                <strong>Informações do produto:</strong>
                <br />
                Preço de custo: R$ {selectedProduct.costPrice.toFixed(2)}
                <br />
                Preço de venda: R$ {selectedProduct.price.toFixed(2)}
                <br />
                Empresa/Filial: {getCompanyDisplayName(companies, selectedProduct.companyId)}
              </div>
            ) : null;
          })()}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>Quantidade *</label>
              <input
                type="number"
                name="quantity"
                value={currentItem.quantity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Preço unitário *</label>
              <input
                type="number"
                name="unitPrice"
                value={currentItem.unitPrice}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Total do item</label>
            <input
              type="text"
              value={`R$ ${(currentItem.quantity * currentItem.unitPrice).toFixed(2)}`}
              disabled
              style={{
                backgroundColor: '#f0f0f0',
                fontWeight: 'bold',
                color: '#2e7d32'
              }}
            />
          </div>

          <div className="form-group">
            <label>Forma de pagamento</label>
            <select
              name="paymentMethod"
              value={currentItem.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão Crédito">Cartão Crédito</option>
              <option value="Cartão Débito">Cartão Débito</option>
              <option value="PIX">PIX</option>
            </select>
          </div>

          <button
            type="button"
            onClick={addToCart}
            style={{
              backgroundColor: '#a36c2f',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Plus size={18} /> Adicionar ao carrinho
          </button>
        </div>

        {/* Carrinho de itens */}
        {cart.length > 0 && (
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>
              Carrinho ({itemsCount} itens)
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Produto</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Qtd.</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Unitário</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Empresa</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Ação</th>
                </tr>
              </thead>

              <tbody>
                {cart.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{item.productName}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      R$ {item.unitPrice.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px' }}>{getCompanyDisplayName(companies, item.companyId)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                      R$ {item.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#d32f2f',
                          cursor: 'pointer',
                          padding: '5px'
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{
              marginTop: '15px',
              paddingTop: '15px',
              borderTop: '2px solid #ddd',
              textAlign: 'right'
            }}>
              <strong style={{ fontSize: '1.2em', color: '#a36c2f' }}>
                Total: R$ {cartTotal.toFixed(2)}
              </strong>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || cart.length === 0}
          style={{
            backgroundColor: '#2e7d32',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            fontSize: '1em',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            opacity: loading || cart.length === 0 ? 0.6 : 1
          }}
        >
          {loading ? 'Processando...' : 'Confirmar vendas'}
        </button>

        {error && <div style={{ color: '#d32f2f', marginTop: '10px' }}>{error}</div>}
      </form>
    </div>
  );
}

export default SalesFormNew;