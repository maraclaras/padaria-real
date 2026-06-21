import { useState, useEffect } from 'react';
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../services/api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar Usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (userData) => {
    try {
      console.log('[useUsers] Enviando para API:', userData);
      const newUser = await createUser(userData);
      console.log('[useUsers] Usuário criado:', newUser);
      setUsers([...users, newUser]);
      return newUser;
    } catch (err) {
      console.error('[useUsers] Erro ao criar:', err);
      setError(err.message);
      throw err;
    }
  };

  const editUser = async (id, userData) => {
    try {
      const updatedUser = await updateUser(id, userData);
      setUsers(users.map(u => u.id === id ? updatedUser : u));
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    addUser,
    editUser,
    removeUser,
    refreshUsers: fetchUsers
  };
};
