import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('padariaReal');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioDigitado = username.trim();
    const senhaDigitada = password.trim();

    if (!usuarioDigitado || !senhaDigitada) {
      setError('Preencha usuário e senha para continuar.');
      return;
    }

    if (typeof onLogin === 'function') {
      try {
        setLoading(true);
        setError('');

        const loginValido = await onLogin(usuarioDigitado, senhaDigitada);

        if (!loginValido) {
          setError('Usuário ou senha inválidos.');
        }
      } catch (err) {
        setError(err.message || 'Usuário ou senha inválidos.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="login-page">
      <section className="login-overlay">
        <div className="login-brand-panel">
          <div className="login-brand-text">
            <span className="login-kicker">Sistema de gestão</span>
            <h1>Padaria Real</h1>
            <p>
              Controle produtos, categorias, vendas e usuários em um só lugar.
            </p>
          </div>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-header">
            <img
              src="/novo_logo.png"
              alt="Logo Padaria Real"
              className="login-logo"
            />

            <div>
              <h2>Entrar</h2>
              <p>Acesse sua conta para continuar</p>
            </div>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;