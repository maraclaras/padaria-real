import React, { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import './Management.css';
import { Pencil, Trash2 } from 'lucide-react';

function CategoryManagement() {
  const { categories, loading, createNewCategory, updateExistingCategory, deleteExistingCategory } = useCategories();
  const { products } = useProducts();
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('O nome da categoria não pode ser vazio.');
      return;
    }
    const name = newCategoryName.trim();
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      setError('Esta categoria já existe.');
      return;
    }
    
    try {
      await createNewCategory({
        name: name,
        description: newCategoryDescription.trim() || null
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
      setError('');
    } catch (err) {
      setError('Erro ao adicionar categoria: ' + err.message);
    }
  };

  const handleStartEdit = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description || '');
    setError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('O nome da categoria não pode ser vazio.');
      return;
    }
    
    const updatedName = newCategoryName.trim();
    
    // Validação para evitar duplicidade durante a edição
    const isDuplicate = categories.some(
      c => c.name.toLowerCase() === updatedName.toLowerCase() && c.id !== editingCategory.id
    );

    if (isDuplicate) {
      setError('Outra categoria com este nome já existe.');
      return;
    }
    
    try {
      await updateExistingCategory(editingCategory.id, {
        name: updatedName,
        description: newCategoryDescription.trim() || null
      });
      setEditingCategory(null);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setError('');
    } catch (err) {
      setError('Erro ao atualizar categoria: ' + err.message);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryDescription('');
    setError('');
  };

  const handleDelete = async (categoryId) => {
    const isAssociated = products.some(p => 
      // Verifica se o nome da categoria está associado a algum produto
      p.category === categories.find(c => c.id === categoryId)?.name
    );

    if (isAssociated) {
      alert("Validação: Não é possível excluir esta categoria. Há produtos ativos associados a ela.");
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      await deleteExistingCategory(categoryId);
    } catch (err) {
      alert('Erro ao excluir categoria: ' + err.message);
    }
  };

  const getProductsByCategory = (categoryName) => {
    return products.filter(product => product.category === categoryName).length;
  };

  const formCardStatusClass = error
    ? 'status-card--negative'
    : editingCategory
      ? 'status-card--warning'
      : 'status-card--info';

  const listCardStatusClass = categories.length > 0
    ? 'status-card--positive'
    : 'status-card--warning';

  return (
    // 1. Container principal para centralizar o bloco
    <div className="category-management-container"> 
      {/* 2. Container flexível para as duas colunas (Formulário e Lista) */}
      <div className="category-management-flex-content">
        <div className={`content-box category-form-box status-card ${formCardStatusClass}`}>
          <h2 className="content-box-title">
            {editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
          </h2>
          <form onSubmit={editingCategory ? handleSaveEdit : handleAddCategory} className="styled-form">
            <div className="form-group">
              <label>Nome *</label>
              <input
                type="text"
                placeholder="Nome da Categoria (ex: Laticínios)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                placeholder="Descrição da categoria (opcional)"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                rows="3"
              />
            </div>
            <div className="button-group-edit">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Salvando...' : (editingCategory ? 'Salvar Edição' : 'Adicionar')}
              </button>
              {editingCategory && (
                <button type="button" onClick={handleCancelEdit} className="cancel-button">
                  Cancelar
                </button>
              )}
            </div>
            {error && <p className="error" style={{color: '#D32F2F', marginTop: '10px'}}>{error}</p>}
          </form>
        </div>

        <div className={`content-box category-list-box status-card ${listCardStatusClass}`}>
          <h2 className="content-box-title">Categorias Cadastradas</h2>
          {loading && <p style={{ textAlign: 'center' }}>Carregando...</p>}
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Status</th>
                <th style={{width: '150px'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const linkedProducts = getProductsByCategory(category.name);
                const hasProducts = linkedProducts > 0;

                return (
                  <tr key={category.id} className={hasProducts ? 'row-status-positive' : 'row-status-warning'}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description || '-'}</td>
                    <td>
                      <span className={`status-badge ${hasProducts ? 'status-badge--positive' : 'status-badge--warning'}`}>
                        {hasProducts ? `${linkedProducts} produto(s)` : 'Sem produtos'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => handleStartEdit(category)}
                        className="action-button edit-button"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="action-button delete-button"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CategoryManagement;