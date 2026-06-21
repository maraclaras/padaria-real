import React from 'react';
import { useProducts } from '../hooks/useProducts';

/**
 * Componente de teste para verificar se a API estÃƒÆ’Ã‚Â¡ funcionando
 * Remove este componente apÃƒÆ’Ã‚Â³s testar
 */
function APITest() {
  const { products, loading, error, loadProducts } = useProducts();

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: '2px solid blue',
      borderRadius: '8px',
      backgroundColor: '#e3f2fd',
    }}>
      <h2>ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Âª Teste de IntegraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o API</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={loadProducts}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {loading ? 'Carregando...' : 'Recarregar Produtos'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffebee',
          border: '1px solid #ef5350',
          borderRadius: '4px',
          color: '#c62828',
          marginBottom: '20px',
        }}>
          âÃ‚ÂÃ…â€™ <strong>Erro:</strong> {error}
          <p style={{ fontSize: '12px', marginTop: '10px' }}>
            Verifique se o backend estÃƒÆ’Ã‚Â¡ rodando em http://localhost:8080
          </p>
        </div>
      )}

      {!error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#e8f5e9',
          border: '1px solid #66bb6a',
          borderRadius: '4px',
          color: '#2e7d32',
          marginBottom: '20px',
        }}>
          âÃ…â€œââ‚¬Â¦ <strong>Sucesso:</strong> Conectado ao backend!
        </div>
      )}

      <h3>Produtos Carregados ({products.length}):</h3>

      {products.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#666' }}>Nenhum produto encontrado</p>
      ) : (
        <div style={{
          overflowX: 'auto',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '4px',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Nome</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>PreÃƒÆ’Ã‚Â§o</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Quantidade</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Categoria</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{product.id}</td>
                  <td style={{ padding: '8px' }}>{product.name}</td>
                  <td style={{ padding: '8px' }}>R$ {product.price?.toFixed(2) || '0.00'}</td>
                  <td style={{ padding: '8px' }}>{product.quantity}</td>
                  <td style={{ padding: '8px' }}>{product.category || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#fff9c4',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#664d03',
      }}>
        <strong>ÃƒÂ°Ã…Â¸ââ‚¬Å“Ã‚Â Nota:</strong> Este ÃƒÆ’Ã‚Â© um componente de teste. Remova-o apÃƒÆ’Ã‚Â³s confirmar que a API estÃƒÆ’Ã‚Â¡ funcionando.
      </div>
    </div>
  );
}

export default APITest;
