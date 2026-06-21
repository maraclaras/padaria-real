import { useState, useCallback, useEffect } from 'react';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/api';

/**
 * Hook customizado para gerenciar estado de categorias
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carrega todas as categorias do backend
   */
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cria uma nova categoria
   */
  const createNewCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await createCategory(categoryData);
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [categories]);

  /**
   * Atualiza uma categoria existente
   */
  const updateExistingCategory = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategory = await updateCategory(id, categoryData);
      setCategories(
        categories.map((c) => (c.id === id ? updatedCategory : c))
      );
      return updatedCategory;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [categories]);

  /**
   * Deleta uma categoria
   */
  const deleteExistingCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [categories]);

  // Carrega categorias ao montar o componente
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    loadCategories,
    createNewCategory,
    updateExistingCategory,
    deleteExistingCategory,
  };
};
