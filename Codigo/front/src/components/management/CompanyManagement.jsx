import React, { useMemo, useState } from 'react';
import { Building2, GitBranch, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCompanies } from '../../hooks/useCompanies';
import './Management.css';

const emptyForm = {
  id: null,
  razaoSocial: '',
  nome: '',
  cnpj: '',
  tipo: 'MATRIZ',
  matrizId: '',
  endereco: '',
  ativo: true,
  sistema: false,
};

const getCompanyName = (company) => company?.nome || company?.nomeFantasia || '';

function CompanyManagement() {
  const {
    companies,
    loading,
    error: apiError,
    createNewCompany,
    updateExistingCompany,
    deleteExistingCompany,
  } = useCompanies();

  const [formData, setFormData] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const matrizOptions = useMemo(
    () => companies.filter(company => company.tipo === 'MATRIZ' && company.id !== formData.id),
    [companies, formData.id]
  );

  const filteredCompanies = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return companies;
    }

    return companies.filter(company =>
      (company.razaoSocial || '').toLowerCase().includes(term) ||
      getCompanyName(company).toLowerCase().includes(term) ||
      (company.cnpj || '').toLowerCase().includes(term) ||
      (company.tipo || '').toLowerCase().includes(term)
    );
  }, [companies, searchTerm]);

  const getMatrizName = (matrizId) => {
    const matriz = companies.find(company => company.id === Number(matrizId));
    return matriz ? getCompanyName(matriz) : '-';
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setError('');
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData(previousData => {
      const nextData = {
        ...previousData,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (name === 'tipo' && value === 'MATRIZ') {
        nextData.matrizId = '';
      }

      return nextData;
    });

    setError('');
  };

  const validateForm = () => {
    if (!formData.razaoSocial.trim()) {
      return 'Informe a razão social da empresa.';
    }

    if (!formData.nome.trim()) {
      return 'Informe o nome da empresa.';
    }

    if (!formData.cnpj.trim()) {
      return 'Informe o CNPJ da empresa.';
    }

    const duplicatedCnpj = companies.some(
      company => (company.cnpj || '').trim() === formData.cnpj.trim() && company.id !== formData.id
    );

    if (duplicatedCnpj) {
      return 'Já existe uma empresa ou filial cadastrada com este CNPJ.';
    }

    if (formData.tipo === 'FILIAL' && !formData.matrizId) {
      return 'Selecione a matriz vinculada a esta filial.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const companyToSave = {
      razaoSocial: formData.razaoSocial.trim(),
      nome: formData.nome.trim(),
      cnpj: formData.cnpj.trim(),
      tipo: formData.sistema ? 'MATRIZ' : formData.tipo,
      matrizId: formData.tipo === 'MATRIZ' || formData.sistema ? null : Number(formData.matrizId),
      endereco: formData.endereco.trim(),
      ativo: formData.sistema ? true : formData.ativo,
    };

    try {
      if (formData.id) {
        await updateExistingCompany(formData.id, companyToSave);
      } else {
        await createNewCompany(companyToSave);
      }

      resetForm();
    } catch (err) {
      setError(err?.message || 'Não foi possível salvar o cadastro. Verifique se o backend está rodando.');
    }
  };

  const handleStartEdit = (company) => {
    setFormData({
      id: company.id,
      razaoSocial: company.razaoSocial || '',
      nome: getCompanyName(company),
      cnpj: company.cnpj || '',
      tipo: company.tipo || 'MATRIZ',
      matrizId: company.matrizId || '',
      endereco: company.endereco || '',
      ativo: company.ativo !== false,
      sistema: company.sistema === true,
    });

    setError('');
  };

  const handleDelete = async (company) => {
    if (company.sistema === true) {
      alert('A matriz padrão do sistema não pode ser excluída.');
      return;
    }

    const hasBranches = companies.some(item => Number(item.matrizId) === company.id);

    if (hasBranches) {
      alert('Não é possível excluir uma matriz que possui filiais vinculadas.');
      return;
    }

    if (window.confirm('Deseja realmente excluir este cadastro?')) {
      try {
        await deleteExistingCompany(company.id);

        if (formData.id === company.id) {
          resetForm();
        }
      } catch (err) {
        alert(err?.message || 'Não foi possível excluir o cadastro. Verifique se o backend está rodando.');
      }
    }
  };

  const totalMatrizes = companies.filter(company => company.tipo === 'MATRIZ').length;
  const totalFiliais = companies.filter(company => company.tipo === 'FILIAL').length;
  const activeCompanies = companies.filter(company => company.ativo !== false).length;

  return (
    <div className="company-management-container">
      <div className="company-summary-grid">
        <div className="company-summary-card status-card status-card--info">
          <Building2 size={28} />

          <div>
            <span>Empresas cadastradas</span>
            <strong>{companies.length}</strong>
          </div>
        </div>

        <div className="company-summary-card status-card status-card--positive">
          <Building2 size={28} />

          <div>
            <span>Matrizes</span>
            <strong>{totalMatrizes}</strong>
          </div>
        </div>

        <div className="company-summary-card status-card status-card--warning">
          <GitBranch size={28} />

          <div>
            <span>Filiais</span>
            <strong>{totalFiliais}</strong>
          </div>
        </div>

        <div className="company-summary-card status-card status-card--positive">
          <Plus size={28} />

          <div>
            <span>Cadastros ativos</span>
            <strong>{activeCompanies}</strong>
          </div>
        </div>
      </div>

      <div className="company-management-flex-content">
        <div className="content-box company-form-box">
          <h2 className="content-box-title">
            {formData.id ? 'Editar Empresa' : 'Cadastrar Empresa'}
          </h2>

          <p className="management-helper-text">
            Cadastre empresas, vincule filiais a uma matriz e identifique o tipo de cada unidade.
          </p>

          <form onSubmit={handleSubmit} className="styled-form">
            <label>
              Razão Social *
              <input
                type="text"
                name="razaoSocial"
                placeholder="Ex.: Padaria Real LTDA"
                value={formData.razaoSocial}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Nome *
              <input
                type="text"
                name="nome"
                placeholder="Ex.: Padaria Real Centro"
                value={formData.nome}
                onChange={handleInputChange}
              />
            </label>

            <label>
              CNPJ *
              <input
                type="text"
                name="cnpj"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={handleInputChange}
                disabled={formData.sistema}
              />
            </label>

            <label>
              Tipo da unidade *
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                disabled={formData.sistema}
              >
                <option value="MATRIZ">Matriz</option>
                <option value="FILIAL">Filial</option>
              </select>
            </label>

            {formData.tipo === 'FILIAL' && (
              <label>
                Matriz vinculada *
                <select
                  name="matrizId"
                  value={formData.matrizId}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione a matriz</option>

                  {matrizOptions.map(company => (
                    <option key={company.id} value={company.id}>
                      {getCompanyName(company)}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              Endereço
              <input
                type="text"
                name="endereco"
                placeholder="Endereço da unidade"
                value={formData.endereco}
                onChange={handleInputChange}
              />
            </label>

            <div className="form-checkbox-group">
              <input
                id="company-active"
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleInputChange}
                disabled={formData.sistema}
              />

              <label htmlFor="company-active">Cadastro ativo</label>
            </div>

            {formData.sistema && (
              <div className="company-form-info">
                Esta é a matriz padrão do sistema. Ela não pode ser excluída, desativada ou transformada em filial.
              </div>
            )}

            {error && (
              <div className="company-form-error">
                {error}
              </div>
            )}

            {apiError && (
              <div className="company-form-error">
                Erro ao carregar empresas. Verifique o backend em http://localhost:8080.
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Salvando...' : formData.id ? 'Salvar Alterações' : 'Cadastrar'}
              </button>

              {formData.id && (
                <button type="button" className="cancel-button" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="content-box company-list-box">
          <div className="company-list-header">
            <div>
              <h2 className="content-box-title">Empresas e Filiais</h2>

              <p className="management-helper-text">
                Visualize quais unidades são matrizes e quais estão vinculadas como filiais.
              </p>
            </div>

            <input
              type="text"
              className="company-search-input"
              placeholder="Buscar por nome, CNPJ ou tipo..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          {loading && companies.length === 0 ? (
            <p className="empty-state">Carregando empresas...</p>
          ) : filteredCompanies.length === 0 ? (
            <p className="empty-state">Nenhum cadastro encontrado.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table company-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CNPJ</th>
                    <th>Tipo</th>
                    <th>Matriz Vinculada</th>
                    <th>Status</th>
                    <th className="actions-cell">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCompanies.map(company => (
                    <tr key={company.id}>
                      <td data-label="Nome">
                        <div className="company-name-cell">
                          <strong>{getCompanyName(company)}</strong>
                          <span>{company.razaoSocial}</span>
                        </div>
                      </td>

                      <td data-label="CNPJ" className="company-cnpj-cell">
                        {company.cnpj}
                      </td>

                      <td data-label="Tipo">
                        <div className="company-type-cell">
                          <span className={`company-type-badge ${company.tipo === 'MATRIZ' ? 'matriz' : 'filial'}`}>
                            {company.tipo === 'MATRIZ' ? 'Matriz' : 'Filial'}
                          </span>

                          {company.sistema === true && (
                            <span className="system-company-badge">Padrão</span>
                          )}
                        </div>
                      </td>

                      <td data-label="Matriz Vinculada" className="company-matriz-cell">
                        {company.tipo === 'FILIAL' ? getMatrizName(company.matrizId) : '-'}
                      </td>

                      <td data-label="Status">
                        <span className={`company-status-badge ${company.ativo !== false ? 'ativo' : 'inativo'}`}>
                          {company.ativo !== false ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>

                      <td data-label="Ações" className="actions-cell">
                        <div className="actions-buttons">
                          <button
                            type="button"
                            className="action-button edit-button"
                            onClick={() => handleStartEdit(company)}
                          >
                            <Pencil size={16} />
                            Editar
                          </button>

                          <button
                            type="button"
                            className="action-button delete-button"
                            onClick={() => handleDelete(company)}
                            disabled={company.sistema === true}
                            title={company.sistema === true ? 'A matriz padrão não pode ser excluída' : 'Excluir'}
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyManagement;