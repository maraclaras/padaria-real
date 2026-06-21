import { useCallback, useEffect, useState } from 'react';
import { profileApi } from '../services/profileApi';

const STORAGE_KEYS = ['loggedUser', 'currentUser', 'user', 'authUser'];

const parseStoredUser = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getStoredUser = () => {
  for (const key of STORAGE_KEYS) {
    const user = parseStoredUser(localStorage.getItem(key));

    if (user) {
      return user;
    }
  }

  return null;
};

const normalizeRole = (role) => {
  return String(role || 'USER').trim().toUpperCase();
};

const getPermissionsByRole = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'ADMIN') {
    return [
      'Visualizar dashboard',
      'Visualizar produtos',
      'Cadastrar e editar produtos',
      'Registrar vendas',
      'Registrar desperdícios',
      'Consultar dados',
      'Gerenciar empresas e filiais',
      'Gerenciar usuários',
      'Alterar permissões de usuários',
    ];
  }

  if (normalizedRole === 'GERENTE') {
    return [
      'Visualizar dashboard',
      'Visualizar produtos',
      'Cadastrar e editar produtos',
      'Registrar vendas',
      'Registrar desperdícios',
      'Consultar dados',
    ];
  }

  if (normalizedRole === 'ATENDENTE') {
    return [
      'Visualizar dashboard',
      'Visualizar produtos',
      'Registrar vendas',
      'Consultar dados',
    ];
  }

  if (normalizedRole === 'ESTOQUISTA') {
    return [
      'Visualizar dashboard',
      'Visualizar produtos',
      'Cadastrar e editar produtos',
      'Registrar desperdícios',
      'Consultar dados',
    ];
  }

  return [
    'Visualizar dashboard',
    'Visualizar produtos',
    'Registrar vendas',
    'Consultar dados',
  ];
};

const buildFallbackProfile = (user) => {
  if (!user) {
    return null;
  }

  const role = normalizeRole(user.role || user.funcao);

  return {
    userId: user.id || user.userId || user.usuarioId || null,
    username: user.username || user.usuario || '',
    name: user.name || user.nome || user.username || 'Usuário',
    role,
    active: user.active !== false,

    companyId: user.companyId || user.empresaId || null,
    companyName:
      user.companyName ||
      user.empresaNome ||
      user.company?.nome ||
      user.company?.name ||
      'Não informado',
    companyType:
      user.companyType ||
      user.tipoEmpresa ||
      user.company?.tipo ||
      'Não informado',
    companyCnpj:
      user.companyCnpj ||
      user.cnpjEmpresa ||
      user.company?.cnpj ||
      'Não informado',
    companyEndereco:
      user.companyEndereco ||
      user.enderecoEmpresa ||
      user.company?.endereco ||
      'Não informado',

    matrizId: user.matrizId || user.company?.matrizId || null,
    matrizName:
      user.matrizName ||
      user.nomeMatriz ||
      user.company?.matrizName ||
      '',

    permissions: getPermissionsByRole(role),
  };
};

export function useProfile() {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [profile, setProfile] = useState(() => buildFallbackProfile(getStoredUser()));
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');

  const userId =
    currentUser?.id ??
    currentUser?.userId ??
    currentUser?.usuarioId ??
    null;

  const loadProfile = useCallback(async () => {
    const storedUser = getStoredUser();
    setCurrentUser(storedUser);

    const fallbackProfile = buildFallbackProfile(storedUser);

    if (!storedUser) {
      setError('Não foi possível identificar o usuário logado.');
      setProfile(null);
      return;
    }

    if (!userId) {
      setProfile(fallbackProfile);
      setError('');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await profileApi.getProfile(userId);

      const backendRole = normalizeRole(data.role || fallbackProfile?.role);

      setProfile({
        ...fallbackProfile,
        ...data,
        role: backendRole,
        permissions: data.permissions?.length
          ? data.permissions
          : getPermissionsByRole(backendRole),
      });
    } catch (err) {
      console.warn('Não foi possível carregar perfil pelo backend:', err);

      setProfile(fallbackProfile);
      setError('');
    } finally {
      setLoading(false);
    }
  }, [userId]);

const updateProfileData = useCallback(
  async (profileData) => {
    if (!userId) {
      throw new Error('Não foi possível identificar o usuário logado.');
    }

    const updatedProfile = await profileApi.updateProfile(userId, profileData);

    const updatedUser = {
      ...currentUser,
      name: updatedProfile.name || profileData.name,
      username: updatedProfile.username || profileData.username,
    };

    localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
    localStorage.setItem('loggedUsername', updatedUser.username);

    setCurrentUser(updatedUser);

    setProfile((previous) => ({
      ...previous,
      ...updatedProfile,
      name: updatedProfile.name || profileData.name,
      username: updatedProfile.username || profileData.username,
    }));

    return updatedProfile;
  },
  [userId, currentUser]
);

  const changePassword = useCallback(
    async (passwordData) => {
      if (!userId) {
        throw new Error('Não foi possível identificar o usuário logado.');
      }

      try {
        setChangingPassword(true);
        setError('');

        const data = await profileApi.changePassword(userId, passwordData);
        return data;
      } finally {
        setChangingPassword(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

return {
  currentUser,
  profile,
  loading,
  changingPassword,
  error,
  loadProfile,
  changePassword,
  updateProfileData,
};
}