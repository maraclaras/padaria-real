import { useState, useCallback, useEffect } from 'react';
import * as api from '../services/api';

export function useSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega todas as vendas
  const loadSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllSales();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega vendas na montagem
  useEffect(() => {
    loadSales();
  }, [loadSales]);

  // Criar nova venda e atualiza estoque
  const createNewSale = useCallback(async (saleData) => {
    try {
      const newSale = await api.createSale(saleData);
      // Recarrega a lista de vendas para garantir sincronizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o
      await loadSales();
      return newSale;
    } catch (err) {
      throw new Error(`Erro ao registrar venda: ${err.message}`);
    }
  }, [loadSales]);

  // Atualizar venda existente
  const updateExistingSale = useCallback(async (id, saleData) => {
    try {
      const updated = await api.updateSale(id, saleData);
      setSales(sales.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err) {
      throw new Error(`Erro ao atualizar venda: ${err.message}`);
    }
  }, [sales]);

  // Deletar venda
  const deleteSale = useCallback(async (id) => {
    try {
      await api.deleteSale(id);
      setSales(sales.filter(s => s.id !== id));
    } catch (err) {
      throw new Error(`Erro ao deletar venda: ${err.message}`);
    }
  }, [sales]);

  // Buscar vendas de um produto
  const searchByProduct = useCallback(async (productId) => {
    try {
      const data = await api.getSalesByProduct(productId);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      throw new Error(`Erro ao buscar vendas: ${err.message}`);
    }
  }, []);

  // Buscar vendas por perÃƒÆ’Ã‚Â­odo
  const searchByDateRange = useCallback(async (startDate, endDate) => {
    try {
      const data = await api.getSalesByDateRange(startDate, endDate);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      throw new Error(`Erro ao buscar vendas: ${err.message}`);
    }
  }, []);

  return {
    sales,
    loading,
    error,
    loadSales,
    createNewSale,
    updateExistingSale,
    deleteSale,
    searchByProduct,
    searchByDateRange,
  };
}
