import React, { useState } from 'react';
import { KeyRound, Pencil, Trash2 } from 'lucide-react';
import './Management.css';
import { useUsers } from '../../hooks/useUsers';
import { useCompanies } from '../../hooks/useCompanies';

const ROLE_OPTIONS = [
  { value: 'USER', label: 'Usuário' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'GERENTE', label: 'Gerente' },
  { value: 'ATENDENTE', label: 'Atendente' },
  { value: 'ESTOQUISTA', label: 'Estoquista' },
];

const getRoleLabel = (role) => {
  const foundRole = ROLE_OPTIONS.find((item) => item.value === role);
  return foundRole?.label || role || 'Usuário';
};

const getCompanyName = (company) => {
  return company?.nome || company?.name || company?.nomeFantasia || company?.razaoSocial || 'Não informado';
};

const getCompanyTypeLabel = (company) => {
  const type = company?.tipo || company?.type;

  if (type === 'MATRIZ') {
    return 'Matriz';
  }

  if (type === 'FILIAL') {
    return 'Filial';
  }

  return type || '';
};

const getCompanyLabel = (company) => {
  if (!company) {
    return 'Não informado';
  }

  const name = getCompanyName(company);
  const type = getCompanyTypeLabel(company);

  return type ? `${name} (${type})` : name;
};

const getUserCompanyId = (user) => {
  return user?.companyId ?? user?.empresaId ?? user?.company_id ?? user?.company?.id ?? '';
};

const getUserCompanyLabel = (user, companies = []) => {
  const directName =
    user?.companyName ||
    user?.empresaNome ||
    user?.company?.nome ||
    user?.company?.name ||
    user?.company?.nomeFantasia;

  const directType =
    user?.companyType ||
    user?.tipoEmpresa ||
    user?.company?.tipo ||
    user?.company?.type;

  if (directName) {
    if (directType === 'MATRIZ') {
      return `${directName} (Matriz)`;
    }

    if (directType === 'FILIAL') {
      return `${directName} (Filial)`;
    }

    return directType ? `${directName} (${directType})` : directName;
  }

  const companyId = getUserCompanyId(user);
  const company = companies.find((item) => Number(item.id) === Number(companyId));

  return getCompanyLabel(company);
};

function UserManagement() {
  const {
    users,
    loading,
    error: apiError,
    addUser,
    editUser,
    removeUser,
  } = useUsers();

  const {
    companies = [],
    loading: companiesLoading,
  } = useCompanies();

  const initialFormData = {
    id: null,
    username: '',
    password: '',
    name: '',
    role: 'USER',
    companyId: '',
    active: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');

  const availableCompanies = companies.filter((company) => {
    const active = company.ativo ?? company.active ?? true;
    return active === true || active === 'true' || active === 1;
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setError('');
  };

  const handleStartEdit = (user) => {
    setFormData({
      id: user.id,
      username: user.username || '',
      password: '',
      name: user.name || '',
      role: user.role || 'USER',
      companyId: getUserCompanyId(user) || '',
      active: user.active === true || user.active === 'true' || user.active === 1,
    });

    setError('');
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setError('');
  };

  const buildPayload = () => {
    const payload = {
      username: formData.username.trim(),
      name: formData.name.trim(),
      role: formData.role,
      active: formData.active,
      companyId: formData.companyId ? Number(formData.companyId) : null,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.username.trim()) {
      setError('O nome de usuário não pode ser vazio.');
      return;
    }

    if (!formData.name.trim()) {
      setError('O nome completo é obrigatório.');
      return;
    }

    if (!formData.role) {
      setError('Selecione uma função para o usuário.');
      return;
    }

    if (!formData.companyId) {
      setError('Selecione a empresa ou filial do usuário.');
      return;
    }

    const isDuplicate = users.some(
      (user) =>
        user.username?.toLowerCase() === formData.username.trim().toLowerCase() &&
        user.id !== formData.id
    );

    if (isDuplicate) {
      setError('Este nome de usuário já existe.');
      return;
    }

    try {
      const payload = buildPayload();

      if (formData.id) {
        await editUser(formData.id, payload);
      } else {
        if (!formData.password) {
          setError('A senha é obrigatória para novos usuários.');
          return;
        }

        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres.');
          return;
        }

        await addUser(payload);
      }

      handleCancelEdit();
    } catch (err) {
      setError(err.message || 'Erro ao salvar usuário.');
    }
  };

  const handleReset = async (user) => {
    const newPassword = window.prompt(`Digite a nova senha para ${user.username}:`);

    if (newPassword === null) {
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await editUser(user.id, {
        username: user.username,
        name: user.name || '',
        role: user.role || 'USER',
        companyId: getUserCompanyId(user) || null,
        active: user.active === true || user.active === 'true' || user.active === 1,
        password: newPassword,
      });

      alert(`Senha de ${user.username} redefinida com sucesso.`);
    } catch (err) {
      alert('Erro ao redefinir senha: ' + err.message);
    }
  };

  const handleDelete = async (user) => {
    if (user.username === 'padariaReal') {
      alert('O usuário administrador padrão não pode ser excluído.');
      return;
    }

    if (window.confirm(`Deseja realmente excluir o usuário ${user.username}?`)) {
      try {
        await removeUser(user.id);
      } catch (err) {
        alert('Erro ao excluir usuário: ' + err.message);
      }
    }
  };

  const inactiveUsers = users.filter(
    (user) => !(user.active === true || user.active === 'true' || user.active === 1)
  ).length;

  const formCardStatusClass = error || apiError ? 'status-card--negative' : 'status-card--info';
  const listCardStatusClass = inactiveUsers > 0 ? 'status-card--warning' : 'status-card--positive';

  if (loading) {
    return <div className="loading">Carregando usuários...</div>;
  }

  return (
    <div className="user-management-container">
      <div className="user-management-flex-content">
        <div className={`content-box user-form-box status-card ${formCardStatusClass}`}>
          <h2 className="content-box-title">
            {formData.id ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>

          <form onSubmit={handleSubmit} className="styled-form">
            <input
              type="text"
              name="username"
              placeholder="Nome de usuário"
              value={formData.username}
              onChange={handleInputChange}
            />

            <input
              type="text"
              name="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleInputChange}
            />

            <input
              type="password"
              name="password"
              placeholder={formData.id ? 'Nova senha opcional' : 'Senha *'}
              value={formData.password}
              onChange={handleInputChange}
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleInputChange}
              disabled={companiesLoading}
            >
              <option value="">
                {companiesLoading ? 'Carregando empresas...' : 'Selecione a empresa/filial'}
              </option>

              {availableCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {getCompanyLabel(company)}
                </option>
              ))}
            </select>

            {formData.id && (
              <div className="form-checkbox-group">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />

                <label htmlFor="active">
                  Conta ativa
                </label>
              </div>
            )}

            <div className="button-group-edit">
              <button type="submit" className="save-button" disabled={loading}>
                {formData.id ? 'Salvar Alterações' : 'Criar Usuário'}
              </button>

              {formData.id && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="cancel-button"
                >
                  Cancelar
                </button>
              )}
            </div>

            {(error || apiError) && (
              <p className="error" style={{ color: '#D32F2F', marginTop: '10px' }}>
                {error || apiError}
              </p>
            )}
          </form>
        </div>

        <div className={`content-box user-list-box status-card ${listCardStatusClass}`}>
          <h2 className="content-box-title">Usuários Cadastrados</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuário</th>
                <th>Nome</th>
                <th>Função</th>
                <th>Empresa</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-message">
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isActive =
                    user.active === true ||
                    user.active === 'true' ||
                    user.active === 1;

                  return (
                    <tr
                      key={user.id}
                      className={isActive ? 'row-status-positive' : 'row-status-negative'}
                    >
                      <td>{user.id}</td>

                      <td>{user.username}</td>

                      <td>{user.name || '-'}</td>

                      <td>{getRoleLabel(user.role)}</td>

                      <td className="user-company-cell">
                        {getUserCompanyLabel(user, companies)}
                      </td>

                      <td>
                        <span className={`status-badge ${isActive ? 'status-badge--positive' : 'status-badge--negative'}`}>
                          {isActive ? 'Ativo' : 'Desativado'}
                        </span>
                      </td>

                      <td className="actions-cell">
                        <div className="actions-buttons">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(user)}
                            className="action-button edit-button"
                          >
                            <Pencil size={16} />
                            Editar
                          </button>

                          {/* <button
                            type="button"
                            onClick={() => handleReset(user)}
                            className="action-button action-button-reset"
                          >
                            <KeyRound size={16} />
                            Senha
                          </button> */}

                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
                            className="action-button delete-button"
                            disabled={user.username === 'padariaReal'}
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;