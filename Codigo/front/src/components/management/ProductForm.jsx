import React, { useState } from 'react';

// Recebe a lista de categorias como prop
function ProductForm({ onAddProduct, categories }) {
  const [product, setProduct] = useState({
    name: '', category: '', costPrice: '', salePrice: '', expiryDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product.name && product.costPrice && product.salePrice && product.category) {
      onAddProduct(product);
      setProduct({ name: '', category: '', costPrice: '', salePrice: '', expiryDate: '' });
    }
  };

  return (
    <div className="content-box">
      <h2 className="content-box-title">Cadastrar Produto</h2>
      <form onSubmit={handleSubmit} className="styled-form">
        <input type="text" name="name" placeholder="Nome do Produto" value={product.name} onChange={handleChange} />
        
        {/* Usando <select> com categorias dinâmicas */}
        <select name="category" value={product.category} onChange={handleChange}>
            <option value="">Selecione a Categoria</option>
            {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
            ))}
        </select>

        <input type="number" name="costPrice" placeholder="Preço de Custo" value={product.costPrice} onChange={handleChange} />
        <input type="number" name="salePrice" placeholder="Preço de Venda" value={product.salePrice} onChange={handleChange} />
        <input type="date" name="expiryDate" placeholder="Data de Vencimento" value={product.expiryDate} onChange={handleChange} />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default ProductForm;