# 🔌 Integração React + Backend - Guia de Teste

## ✅ O que foi criado

### **1. Serviço de API (`src/services/api.js`)**
- Centraliza todas as requisições HTTP ao backend
- Métodos para CRUD de produtos
- Tratamento de erros automático
- Funções auxiliares para buscas e filtros

### **2. Hook useProducts (`src/hooks/useProducts.js`)**
- Hook customizado para gerenciar estado de produtos
- Métodos: `loadProducts`, `createNewProduct`, `updateExistingProduct`, `deleteExistingProduct`
- Métodos de filtro: `search`, `filterByCategory`, `loadLowStock`
- Gerencia `loading` e `error` automaticamente

### **3. Componente ProductList Atualizado**
- Conectado ao hook `useProducts`
- Carrega produtos automaticamente do backend
- Inclui busca por nome
- Botões para editar e deletar

### **4. Componente ProductForm (`src/components/forms/ProductFormNew.jsx`)**
- Formulário funcional para criar e editar produtos
- Validação de campos
- Integrado com o hook `useProducts`
- Suporta criação e edição

### **5. Componente de Teste (`src/components/APITest.jsx`)**
- Mostra se a API está conectada
- Lista todos os produtos carregados
- Útil para debug

---

## 🚀 Como Testar

### **Pré-requisitos**
- ✅ Backend rodando em `http://localhost:8080`
- ✅ Frontend rodando em `http://localhost:5173`
- ✅ Banco de dados MySQL criado e com dados

### **Passo 1: Inicie o Backend**
```powershell
cd c:\Users\prore\Documents\GitHub\padaria-real\Codigo\backend
mvn spring-boot:run
```

### **Passo 2: Inicie o Frontend**
```powershell
cd c:\Users\prore\Documents\GitHub\padaria-real\Codigo\front
npm run dev
```

### **Passo 3: Abra no navegador**
```
http://localhost:5173
```

---

## 📋 Testes a Fazer

### **Teste 1: Verificar conexão com API**
1. Procure por um componente com teste (APITest)
2. Clique em "Recarregar Produtos"
3. Verifique se os produtos aparecem na tabela
4. ✅ Se aparecer uma lista de produtos → **API conectada!**

### **Teste 2: Listar Produtos**
1. Navegue para a página de produtos
2. Verifique se os 3 produtos de teste aparecem (Pão Francês, Croissant, Bolo de Chocolate)
3. ✅ Se aparecer a tabela com os produtos → **Sucesso!**

### **Teste 3: Buscar Produto**
1. Na lista de produtos, use a barra de busca
2. Digite "Pão" (parte do nome)
3. Clique em "Buscar"
4. ✅ Se aparecer apenas o Pão Francês → **Busca funcionando!**

### **Teste 4: Criar Novo Produto**
1. Clique em "Criar Novo Produto"
2. Preencha os campos:
   - **Nome:** Baguete
   - **Descrição:** Baguete francesa
   - **Preço:** 12.50
   - **Quantidade:** 30
   - **Categoria:** Pães
3. Clique em "Salvar"
4. ✅ Se retornar para lista e o produto aparecer → **Criação funcionando!**

### **Teste 5: Editar Produto**
1. Na lista, clique em "Editar" ao lado de um produto
2. Altere algum campo (ex: quantidade)
3. Clique em "Salvar"
4. ✅ Se retornar com alterações aplicadas → **Edição funcionando!**

### **Teste 6: Deletar Produto**
1. Na lista, clique em "Excluir" ao lado de um produto
2. Confirme a deleção
3. ✅ Se o produto desaparecer da lista → **Deleção funcionando!**

---

## 🔧 Se algo não funcionar

### **Erro: "Impossível conectar-se ao servidor remoto"**
- ❌ Backend não está rodando
- ✅ Execute: `mvn spring-boot:run` na pasta backend

### **Erro: "Cannot find symbol" no VS Code**
- ❌ É apenas um erro visual do VS Code, não afeta a compilação
- ✅ O código compila corretamente via Maven

### **Erro: "Nenhum produto encontrado"**
- ❌ Banco de dados vazio
- ✅ Execute o script SQL no MySQL Workbench para inserir dados de teste

### **Erro: "CORS error" ou acesso negado**
- ❌ CORS não está configurado
- ✅ Verifique se `CorsConfig.java` está no backend

---

## 📝 Próximos Passos (Opcional)

1. **Implementar Autenticação**
   - Login/Logout com JWT
   - Tokens de sessão

2. **Adicionar Mais Funcionalidades**
   - Gerenciar categorias
   - Registrar vendas
   - Relatórios de estoque

3. **Melhorias de UX**
   - Paginação
   - Filtros avançados
   - Notificações de sucesso/erro

4. **Deploy**
   - Colocar backend em produção
   - Colocar frontend em produção
   - Configurar banco de dados na nuvem

---

## 🎯 Resumo da Arquitetura

```
Frontend (React)
├── Componentes
│   ├── ProductList (lista de produtos)
│   ├── ProductForm (criar/editar)
│   └── APITest (teste de conexão)
├── Hooks
│   └── useProducts (gerencia estado)
└── Services
    └── api.js (requisições HTTP)
        ↓
        ↓ HTTP Requests
        ↓
Backend (Spring Boot)
├── Controllers
│   └── ProductController (endpoints REST)
├── Services
│   └── ProductService (lógica de negócio)
├── Repositories
│   └── ProductRepository (acesso a dados)
└── Models
    └── Product (entidade do banco)
        ↓
        ↓ SQL Queries
        ↓
MySQL Database
└── products table
```

---

## ✅ Checklist Final

- [ ] Backend rodando em http://localhost:8080
- [ ] Frontend rodando em http://localhost:5173
- [ ] Banco de dados criado com dados de teste
- [ ] Produtos aparecem na lista
- [ ] Busca funciona
- [ ] Criar novo produto funciona
- [ ] Editar produto funciona
- [ ] Deletar produto funciona
- [ ] Sem erros no console do navegador
- [ ] Sem erros no terminal do backend

**Se tudo passar ✅, a integração está completa!** 🎉
