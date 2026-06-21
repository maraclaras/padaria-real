import { useState, useCallback, useEffect } from 'react';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductQuantity,
  searchProducts,
  getProductsByCategory,
  getLowStockProducts,
} from '../services/api';

/**
 * Hook customizado para gerenciar estado de produtos
 * Fornece mÃƒÆ’Ã‚Â©todos para CRUD e operAções comuns
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carrega todos os produtos do backend
   */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cria um novo produto
   */
  const createNewProduct = useCallback(async (productData) => {
    console.log('[useProducts] Criando produto:', productData);
    setLoading(true);
    setError(null);
    try {
      const newProduct = await createProduct(productData);
      console.log('[useProducts] Produto criado com sucesso:', newProduct);
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('[useProducts] Erro ao criar:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [products]);

  /**
   * Atualiza um produto existente
   */
  const updateExistingProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await updateProduct(id, productData);
      setProducts(
        products.map((p) => (p.id === id ? updatedProduct : p))
      );
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar produto:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [products]);

  /**
   * Deleta um produto
   */
  const deleteExistingProduct = useCallback(async (id) => {
    console.log('[useProducts] Deletando produto:', id);
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(id);
      console.log('[useProducts] Produto deletado com sucesso');
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error('[useProducts] Erro ao deletar:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [products]);

  /**
   * Atualiza a quantidade de um produto
   */
  const updateQuantity = useCallback(async (id, quantity) => {
    setLoading(true);
    setError(null);
    try {
      await updateProductQuantity(id, quantity);
      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, quantity } : p
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar quantidade:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [products]);

  /**
   * Busca produtos por nome
   */
  const search = useCallback(async (name) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchProducts(name);
      setProducts(results || []);
      return results;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar produtos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filtra produtos por categoria
   */
  const filterByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      const results = await getProductsByCategory(category);
      setProducts(results || []);
      return results;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao filtrar por categoria:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carrega produtos com estoque baixo
   */
  const loadLowStock = useCallback(async (minimumQuantity = 10) => {
    setLoading(true);
    setError(null);
    try {
      const results = await getLowStockProducts(minimumQuantity);
      setProducts(results || []);
      return results;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar produtos com estoque baixo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carrega produtos na montagem do componente
   */
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    // Estado
    products,
    loading,
    error,
    
    // MÃƒÆ’Ã‚Â©todos CRUD
    loadProducts,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    updateQuantity,
    
    // Filtros e buscas
    search,
    filterByCategory,
    loadLowStock,
  };
};
