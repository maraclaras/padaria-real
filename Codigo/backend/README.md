# Manual do Usuário - Sistema Padaria Real

## 📖 Bem-vindo ao Sistema Padaria Real!

Este manual contém todas as instruções necessárias para utilizar o sistema de gerenciamento da Padaria Real. O sistema permite controlar produtos, vendas, desperdícios, categorias e usuários de forma simples e eficiente.

---

## 🎯 Índice

1. [Primeiro Acesso](#primeiro-acesso)
2. [Como Fazer Login](#como-fazer-login)
3. [Painel Principal (Dashboard)](#painel-principal)
4. [Gerenciar Produtos](#gerenciar-produtos)
5. [Registrar Vendas](#registrar-vendas)
6. [Consultar Produtos](#consultar-produtos)
7. [Gerenciar Desperdícios](#gerenciar-desperdícios)
8. [Gerenciar Categorias](#gerenciar-categorias)
9. [Gerenciar Usuários](#gerenciar-usuários)
10. [Perguntas Frequentes](#perguntas-frequentes)

---

## 🔐 Primeiro Acesso

### Credenciais Padrão

Na primeira vez que acessar o sistema, use:

- **Usuário:** `padariaReal`
- **Senha:** `123456`

⚠️ **IMPORTANTE:** Após o primeiro acesso, recomendamos criar novos usuários e trocar a senha padrão.

---

## 🚪 Como Fazer Login

1. Abra o navegador e acesse: `http://localhost:5173`
2. Digite seu usuário e senha
3. Clique em **"Entrar"**
4. Você será direcionado ao Painel Principal

---

## 📊 Painel Principal (Dashboard)

O Dashboard é a primeira tela após o login e mostra:

### Indicadores (KPIs)

- **Total de Produtos:** Quantidade total de produtos cadastrados
- **Produtos em Estoque:** Soma de todas as unidades disponíveis
- **Faturamento Total:** Soma de todas as vendas realizadas
- **Lucro Total:** Faturamento menos custos dos produtos vendidos
- **Perda Financeira:** Valor total perdido com desperdícios
- **Taxa de Desperdício:** Percentual de perda em relação ao estoque

### Alertas de Estoque Baixo

Mostra produtos com menos de 10 unidades em estoque, permitindo ação rápida para reposição.

### Atividades Recentes

- Produtos cadastrados recentemente
- Últimas vendas realizadas
- Últimos desperdícios registrados

---

## 📦 Gerenciar Produtos

### Como Cadastrar um Novo Produto

1. Clique em **"Produtos"** no menu lateral
2. Preencha o formulário no lado esquerdo:
   - **Nome:** Nome do produto (ex: Pão Francês)
   - **Descrição:** Informações adicionais (opcional)
   - **Categoria:** Selecione a categoria
   - **Preço de Custo:** Quanto você paga pelo produto
   - **Preço de Venda:** Quanto você vende o produto
   - **Quantidade:** Estoque inicial
3. Clique em **"Adicionar Produto"**
4. O produto aparecerá imediatamente na lista à direita

### Como Editar um Produto

1. Na lista de produtos, clique em **"Editar"**
2. Modifique os campos desejados
3. Clique em **"Salvar Alterações"**

### Como Excluir um Produto

1. Na lista de produtos, clique em **"Excluir"**
2. Confirme a exclusão na janela de confirmação

⚠️ **Atenção:** Produtos excluídos não podem ser recuperados!

---

## 💰 Registrar Vendas

### Como Registrar uma Venda

1. Clique em **"Vendas"** no menu lateral
2. Preencha o formulário:
   - **Produto:** Selecione o produto vendido
   - **Quantidade:** Quantas unidades foram vendidas
   - **Forma de Pagamento:** Dinheiro, PIX, Cartão de Débito ou Crédito
   - **Data da Venda:** Data da transação
3. Clique em **"Registrar Venda"**
4. O sistema automaticamente:
   - Atualiza o estoque (diminui a quantidade vendida)
   - Calcula o valor total da venda
   - Atualiza o Dashboard com novos valores

### Visualizar Vendas Registradas

- A tabela mostra todas as vendas com:
  - Data da venda
  - Produto vendido
  - Quantidade
  - Valor total
  - Forma de pagamento
  - Ações (editar/excluir)

---

## 🔍 Consultar Produtos

A tela de **Consulta** oferece filtros avançados para encontrar produtos:

### Filtros Disponíveis

- **Nome do Produto:** Digite parte do nome para buscar
- **Categoria:** Filtre por categoria específica
- **Custo Mínimo/Máximo:** Produtos dentro de uma faixa de custo
- **Venda Mínima/Máxima:** Produtos dentro de uma faixa de preço de venda
- **Vencimento De/Até:** Produtos com vencimento em período específico

### Como Usar os Filtros

1. Clique em **"Consulta"** no menu lateral
2. Preencha os filtros desejados
3. Selecione a ordenação (por nome, custo, venda ou vencimento)
4. Escolha ordem crescente ou decrescente
5. Os resultados aparecem automaticamente
6. Clique em **"Limpar Filtros"** para resetar todos os campos

### Busca Rápida

Use a barra de busca abaixo dos filtros para procurar pelo nome dentro dos resultados filtrados.

---

## 🗑️ Gerenciar Desperdícios

### Como Registrar um Desperdício

1. Clique em **"Desperdício"** no menu lateral
2. Clique em **"+ Registrar Desperdício"**
3. Preencha o formulário:
   - **Produto:** Selecione qual produto foi desperdiçado
   - **Quantidade:** Quantas unidades foram perdidas
   - **Motivo:** Vencimento, Queimado, Estragado, Não vendido ou Outro
   - **Custo Unitário:** (preenchido automaticamente baseado no produto)
4. Clique em **"Registrar Desperdício"**
5. O sistema automaticamente:
   - Calcula a perda financeira total
   - Atualiza o Dashboard
   - Registra a data do desperdício

### Visualizar Desperdícios

A tabela mostra:
- Data do registro
- Produto desperdiçado
- Quantidade perdida
- Motivo
- Custo unitário
- Perda total (quantidade × custo)
- Resumo: Total de desperdícios e perda financeira acumulada

### Como Excluir um Registro

1. Clique em **"Excluir"** na linha do registro
2. Confirme a exclusão

---

## 🏷️ Gerenciar Categorias

### Como Criar uma Nova Categoria

1. Clique em **"Categorias"** no menu lateral
2. Preencha:
   - **Nome:** Nome da categoria (ex: Pães, Doces, Salgados)
   - **Descrição:** Detalhes sobre a categoria
3. Clique em **"Adicionar Categoria"**

### Como Editar/Excluir Categorias

- Use os botões na tabela de categorias
- **Editar:** Modifica nome e descrição
- **Excluir:** Remove a categoria (apenas se não houver produtos vinculados)

---

## 👥 Gerenciar Usuários

**Disponível apenas para administradores**

### Como Criar um Novo Usuário

1. Clique em **"Usuários"** no menu lateral
2. Preencha o formulário:
   - **Nome de Usuário:** Login único do usuário
   - **Nome Completo:** Nome da pessoa
   - **Senha:** Senha de acesso (mínimo 6 caracteres)
   - **Função:** Usuário ou Administrador
3. Clique em **"Criar Usuário"**

### Diferença entre Funções

- **Administrador:** Acesso total ao sistema, incluindo gerenciar usuários
- **Usuário:** Acesso às funcionalidades principais (produtos, vendas, desperdícios)

### Como Editar um Usuário

1. Clique em **"Editar"** na linha do usuário
2. Modifique os dados necessários
3. Marque/desmarque **"Conta Ativa"** para ativar/desativar
4. Clique em **"Salvar Alterações"**

### Como Redefinir Senha

1. Clique em **"Redefinir Senha"**
2. Digite a nova senha (mínimo 6 caracteres)
3. Clique em **OK**

### Como Excluir um Usuário

1. Clique em **"Excluir"**
2. Confirme a exclusão

⚠️ **Atenção:** O usuário padrão `padariaReal` não pode ser excluído.

---

## ❓ Perguntas Frequentes

### Como faço para atualizar o estoque?

O estoque é atualizado automaticamente ao:
- Registrar vendas (diminui)
- Registrar desperdícios (diminui)
- Editar o produto manualmente (aumenta ou diminui)

### Por que não consigo excluir uma categoria?

Categorias só podem ser excluídas se não houver produtos vinculados a elas. Primeiro remova ou mova os produtos para outra categoria.

### Como vejo o lucro de um produto específico?

No Dashboard, o lucro total é calculado automaticamente. Para lucro individual, compare:
- **Lucro = (Preço de Venda - Preço de Custo) × Quantidade Vendida**

### Esqueci minha senha, como recuperar?

Entre em contato com um administrador do sistema para que ele redefina sua senha através do menu "Usuários".

### Os dados ficam salvos mesmo se eu fechar o navegador?

Sim! Todos os dados são salvos no banco de dados e permanecerão disponíveis mesmo após fechar e reabrir o sistema.

### Como sei se uma venda foi registrada com sucesso?

Após registrar uma venda:
1. Uma mensagem de sucesso aparecerá
2. A venda aparecerá na tabela de vendas
3. O estoque do produto será reduzido
4. O Dashboard será atualizado com novos valores

### Posso desfazer uma venda ou desperdício?

Sim, use o botão **"Excluir"** na linha da venda ou desperdício que deseja remover. O estoque será automaticamente ajustado.

---

## 📞 Suporte

Para dúvidas adicionais ou problemas técnicos, entre em contato com o administrador do sistema.

---

**Versão do Sistema:** 1.0.0  
**Última Atualização:** Dezembro 2025
