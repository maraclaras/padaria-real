import { useState, useCallback, useEffect } from 'react';
import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../services/api';

/**
 * Hook customizado para gerenciar empresas e filiais pelo backend
 */
export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCompanies();
      setCompanies(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar empresas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewCompany = useCallback(async (companyData) => {
    setLoading(true);
    setError(null);
    try {
      const newCompany = await createCompany(companyData);
      setCompanies((previousCompanies) => [...previousCompanies, newCompany]);
      return newCompany;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingCompany = useCallback(async (id, companyData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCompany = await updateCompany(id, companyData);
      setCompanies((previousCompanies) =>
        previousCompanies.map((company) => (company.id === id ? updatedCompany : company))
      );
      return updatedCompany;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExistingCompany = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCompany(id);
      setCompanies((previousCompanies) => previousCompanies.filter((company) => company.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  return {
    companies,
    loading,
    error,
    loadCompanies,
    createNewCompany,
    updateExistingCompany,
    deleteExistingCompany,
  };
};
