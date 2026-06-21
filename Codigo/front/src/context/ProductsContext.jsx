import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../services/api';

const ProductsContext = createContext(null);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega todos os produtos do backend
  const loadProducts = useCallback(async () => {
    console.log('[ProductsContext] Iniciando carregamento de produtos...');
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      console.log('[ProductsContext] Produtos carregados:', data);
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
      console.error('[ProductsContext] Erro ao carregar produtos:', err);
      setProducts([]); // Garante que products seja array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, []);

  // Cria um novo produto
  const createNewProduct = useCallback(async (productData) => {
    console.log('[ProductsContext] Criando produto:', productData);
    setLoading(true);
    setError(null);
    try {
      const newProduct = await createProduct(productData);
      console.log('[ProductsContext] Produto criado com sucesso:', newProduct);
      setProducts(prevProducts => [...prevProducts, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('[ProductsContext] Erro ao criar:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualiza um produto existente
  const updateExistingProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await updateProduct(id, productData);
      setProducts(prevProducts =>
        prevProducts.map((p) => (p.id === id ? updatedProduct : p))
      );
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar produto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deleta um produto
  const deleteExistingProduct = useCallback(async (id) => {
    console.log('[ProductsContext] Deletando produto:', id);
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      console.log('[ProductsContext] Produto deletado com sucesso');
      setProducts(prevProducts => prevProducts.filter((p) => p.id !== id));
    } catch (err) {
      console.error('[ProductsContext] Erro ao deletar:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca produtos
  const search = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(searchTerm);
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega produtos ao montar o componente
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const value = {
    products,
    loading,
    error,
    loadProducts,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    search,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext deve ser usado dentro de ProductsProvider');
  }
  return context;
};
