import { useState, useCallback, useEffect } from 'react';
import * as api from '../services/api';

export function useWaste() {
  const [waste, setWaste] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega todos os registros de Desperdício
  const loadWaste = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllWaste();
      setWaste(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setWaste([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega Desperdício na montagem
  useEffect(() => {
    loadWaste();
  }, [loadWaste]);

  // Registrar novo Desperdício e atualiza estoque
  const registerWaste = useCallback(async (wasteData) => {
    try {
      const newWaste = await api.createWaste(wasteData);
      // Recarrega a lista completa para garantir sincronizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o
      await loadWaste();
      return newWaste;
    } catch (err) {
      throw new Error(`Erro ao registrar Desperdício: ${err.message}`);
    }
  }, [loadWaste]);

  // Atualizar registro de Desperdício
  const updateExistingWaste = useCallback(async (id, wasteData) => {
    try {
      const updated = await api.updateWaste(id, wasteData);
      setWaste(waste.map(w => w.id === id ? updated : w));
      return updated;
    } catch (err) {
      throw new Error(`Erro ao atualizar Desperdício: ${err.message}`);
    }
  }, [waste]);

  // Deletar registro de Desperdício
  const deleteExistingWaste = useCallback(async (id) => {
    try {
      await api.deleteWaste(id);
      setWaste(waste.filter(w => w.id !== id));
    } catch (err) {
      throw new Error(`Erro ao deletar Desperdício: ${err.message}`);
    }
  }, [waste]);

  // Buscar Desperdício de um produto
  const searchByProduct = useCallback(async (productId) => {
    try {
      const data = await api.getWasteByProduct(productId);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      throw new Error(`Erro ao buscar Desperdício: ${err.message}`);
    }
  }, []);

  // Buscar Desperdício por perÃƒÆ’Ã‚Â­odo
  const searchByDateRange = useCallback(async (startDate, endDate) => {
    try {
      const data = await api.getWasteByDateRange(startDate, endDate);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      throw new Error(`Erro ao buscar Desperdício: ${err.message}`);
    }
  }, []);

  return {
    waste,
    loading,
    error,
    loadWaste,
    registerWaste,
    updateWaste: updateExistingWaste,
    deleteWaste: deleteExistingWaste,
    searchByProduct,
    searchByDateRange,
  };
}
