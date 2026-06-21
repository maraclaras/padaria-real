import React, { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  KeyRound,
  Pencil,
  ShieldCheck,
  Store,
  UserCircle,
  XCircle,
} from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import './ProfilePage.css';

const formatRole = (role) => {
  const normalizedRole = String(role || '').trim().toUpperCase();

  const labels = {
    ADMIN: 'Administrador',
    USER: 'Usuário',
    GERENTE: 'Gerente',
    ATENDENTE: 'Atendente',
    ESTOQUISTA: 'Estoquista',
  };

  return labels[normalizedRole] || role || 'Não informado';
};

const formatCompanyType = (type) => {
  const normalizedType = String(type || '').trim().toUpperCase();

  if (!type || type === 'Não informado') {
    return 'Não informado';
  }

  if (normalizedType === 'MATRIZ') {
    return 'Matriz';
  }

  if (normalizedType === 'FILIAL') {
    return 'Filial';
  }

  return type;
};

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);

  if (parts.length === 0) {
    return 'U';
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

function ProfilePage() {
  const {
    profile,
    loading,
    changingPassword,
    error,
    changePassword,
    updateProfileData,
  } = useProfile();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: '',
    username: '',
  });
  const [accountMessage, setAccountMessage] = useState('');
  const [accountError, setAccountError] = useState('');
  const [savingAccount, setSavingAccount] = useState(false);

  const normalizedRole = String(profile?.role || '').trim().toUpperCase();

  const isAdmin = useMemo(
    () => normalizedRole === 'ADMIN',
    [normalizedRole]
  );

  const accessLabel = isAdmin ? 'Acesso total' : 'Acesso limitado';

  const handleStartEditAccount = () => {
    setAccountForm({
      name: profile?.name || '',
      username: profile?.username || '',
    });

    setAccountError('');
    setAccountMessage('');
    setIsEditingAccount(true);
  };

  const handleCancelEditAccount = () => {
    setIsEditingAccount(false);
    setAccountForm({
      name: '',
      username: '',
    });
    setAccountError('');
    setAccountMessage('');
  };

  const handleAccountInputChange = (event) => {
    const { name, value } = event.target;

    setAccountForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setAccountError('');
    setAccountMessage('');
  };

  const handleSaveAccount = async () => {
    try {
      setSavingAccount(true);
      setAccountError('');
      setAccountMessage('');

      const name = accountForm.name.trim();
      const username = accountForm.username.trim();

      if (!name) {
        setAccountError('O nome não pode ser vazio.');
        return;
      }

      if (name.length < 3) {
        setAccountError('O nome deve ter pelo menos 3 caracteres.');
        return;
      }

      if (!username) {
        setAccountError('O usuário não pode ser vazio.');
        return;
      }

      if (username.length < 3) {
        setAccountError('O usuário deve ter pelo menos 3 caracteres.');
        return;
      }

      if (typeof updateProfileData !== 'function') {
        setAccountError('A função de atualizar perfil ainda não foi configurada no useProfile.js.');
        return;
      }

      await updateProfileData({
        name,
        username,
      });

      setAccountMessage('Dados atualizados com sucesso.');
      setIsEditingAccount(false);
    } catch (err) {
      setAccountError(err.message || 'Não foi possível atualizar os dados.');
    } finally {
      setSavingAccount(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordError('');
    setPasswordMessage('');
  };

  const handleSubmitPassword = async (event) => {
    event.preventDefault();

    try {
      setPasswordError('');
      setPasswordMessage('');

      await changePassword(passwordForm);

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setPasswordMessage('Senha alterada com sucesso.');
    } catch (err) {
      setPasswordError(err.message || 'Não foi possível alterar a senha.');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-state-card">
          <UserCircle size={32} />
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-state-card error">
          <XCircle size={32} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-clean-hero">
        <div className="profile-clean-avatar">
          {getInitials(profile?.name)}
        </div>

        <div className="profile-clean-main">
          <span>Meu perfil</span>
          <h2>{profile?.name || 'Usuário'}</h2>
          <p>@{profile?.username || 'usuario'}</p>

          <div className="profile-clean-badges">
            <strong className={isAdmin ? 'admin' : 'user'}>
              <BadgeCheck size={16} />
              {formatRole(profile?.role)}
            </strong>

            <strong className={profile?.active !== false ? 'active' : 'inactive'}>
              {profile?.active !== false ? 'Conta ativa' : 'Conta desativada'}
            </strong>
          </div>
        </div>

        <div className="profile-clean-company">
          <Store size={24} />
          <div>
            <span>Empresa vinculada</span>
            <strong>{profile?.companyName || 'Não informado'}</strong>
            <small>{formatCompanyType(profile?.companyType)}</small>
          </div>
        </div>
      </section>

      <div className="profile-clean-grid">
        <section className="profile-clean-card">
<div className="profile-card-heading profile-card-heading-with-action">
  <div className="profile-card-heading-title">
    <UserCircle size={24} />
    <h3>Dados da conta</h3>
  </div>

  {!isEditingAccount && (
    <button
      type="button"
      onClick={handleStartEditAccount}
      className="profile-edit-account-header-button"
    >
      <Pencil size={15} />
      Editar dados
    </button>
  )}
</div>

          <div className="profile-clean-list">
            {isEditingAccount ? (
              <>
                <div className="profile-edit-account-row">
                  <span>Nome</span>

                  <input
                    type="text"
                    name="name"
                    value={accountForm.name}
                    onChange={handleAccountInputChange}
                    placeholder="Digite o nome"
                    className="profile-account-input"
                  />
                </div>

                <div className="profile-edit-account-row">
                  <span>Usuário</span>

                  <input
                    type="text"
                    name="username"
                    value={accountForm.username}
                    onChange={handleAccountInputChange}
                    placeholder="Digite o usuário"
                    className="profile-account-input"
                  />
                </div>

                <div className="profile-account-actions-row">
                  <span></span>

                  <div className="profile-account-actions">
                    <button
                      type="button"
                      onClick={handleSaveAccount}
                      disabled={savingAccount}
                      className="profile-save-name-button"
                    >
                      {savingAccount ? 'Salvando...' : 'Salvar'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEditAccount}
                      className="profile-cancel-name-button"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
<div>
  <span>Nome</span>
  <strong>{profile?.name || 'Não informado'}</strong>
</div>

                <div>
                  <span>Usuário</span>
                  <strong>{profile?.username || 'Não informado'}</strong>
                </div>
              </>
            )}

            {accountError && (
              <div className="profile-account-feedback profile-account-feedback-error">
                {accountError}
              </div>
            )}

            {accountMessage && (
              <div className="profile-account-feedback profile-account-feedback-success">
                {accountMessage}
              </div>
            )}

            <div>
              <span>Função</span>
              <strong>{formatRole(profile?.role)}</strong>
            </div>

            <div>
              <span>Nível de acesso</span>
              <strong>{accessLabel}</strong>
            </div>
          </div>
        </section>

        <section className="profile-clean-card">
          <div className="profile-card-heading">
            <Building2 size={24} />
            <h3>Empresa / Filial</h3>
          </div>

          <div className="profile-clean-list">
            <div>
              <span>Nome</span>
              <strong>{profile?.companyName || 'Não informado'}</strong>
            </div>

            <div>
              <span>Tipo</span>
              <strong>{formatCompanyType(profile?.companyType)}</strong>
            </div>

            <div>
              <span>CNPJ</span>
              <strong>{profile?.companyCnpj || 'Não informado'}</strong>
            </div>

            <div>
              <span>Endereço</span>
              <strong>{profile?.companyEndereco || 'Não informado'}</strong>
            </div>

            {String(profile?.companyType || '').trim().toUpperCase() === 'FILIAL' && (
              <div>
                <span>Matriz</span>
                <strong>{profile?.matrizName || 'Não informado'}</strong>
              </div>
            )}
          </div>
        </section>

        <section className="profile-clean-card profile-security-card">
          <div className="profile-card-heading">
            <ShieldCheck size={24} />
            <h3>Segurança</h3>
          </div>

          <p className="profile-security-text">
            Altere sua senha quando necessário para manter sua conta protegida.
          </p>

          <form className="profile-password-form" onSubmit={handleSubmitPassword}>
            <label>
              Senha atual
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Digite sua senha atual"
              />
            </label>

            <label>
              Nova senha
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Mínimo de 6 caracteres"
              />
            </label>

            <label>
              Confirmar senha
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Repita a nova senha"
              />
            </label>

            {passwordError && (
              <div className="profile-password-error">
                {passwordError}
              </div>
            )}

            {passwordMessage && (
              <div className="profile-password-success">
                {passwordMessage}
              </div>
            )}

            <button type="submit" disabled={changingPassword}>
              <KeyRound size={18} />
              {changingPassword ? 'Alterando...' : 'Alterar senha'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;