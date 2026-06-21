# Artefatos do projeto

## Requisitos Funcionais
| Nº       | Requisito                              | Descrição                                                                                                   | Prioridade |
| -------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------- |
| **RF01** | **Login do Usuário**                    | Permite que usuários autenticados acessem o sistema utilizando login e senha.                             | **Alta**   |
| **RF02** | **Cadastrar Produto**                   | Permite cadastrar produtos informando nome, categoria, código de barras, preço de custo, preço de venda e data de vencimento. | **Alta**   |
| **RF03** | **Consultar Produtos**                  | Permite visualizar a lista de produtos cadastrados com seus detalhes.                                      | **Alta**   |
| **RF04** | **Controlar Validade**                  | O sistema identifica produtos com vencimento em até **7 dias** e notifica os usuários responsáveis.       | **Alta**   |
| **RF05** | **Registrar Desperdício**               | Permite registrar produtos descartados informando produto, quantidade e motivo do descarte.               | **Alta**   |
| **RF06** | **Calcular Taxa de Desperdício**        | Calcula a porcentagem de desperdício com base na quantidade descartada em relação ao total registrado.    | **Média**  |
| **RF07** | **Calcular Perda Financeira**           | Calcula o valor financeiro perdido com base no preço de custo dos produtos descartados.                   | **Alta**   |
| **RF08** | **Gerar Relatórios Gerenciais**         | Permite gerar relatórios com dados de desperdício, produtos mais descartados e perda financeira.          | **Alta**   |
| **RF09** | **Registrar Venda de Produto**          | Permite registrar vendas e atualizar automaticamente a quantidade em estoque.                             | **Alta**   |
| **RF10** | **Cadastrar Empresa**                   | Permite cadastrar empresas no sistema.                                                                     | **Alta**   |
| **RF11** | **Cadastrar Filial**                    | Permite cadastrar filiais vinculadas a uma empresa.                                                        | **Alta**   |
| **RF12** | **Identificar Matriz e Filial**         | Permite definir se a unidade cadastrada é matriz ou filial.                                                | **Alta**   |
| **RF13** | **Cadastrar Usuários**                  | Permite cadastrar novos usuários no sistema.                                                               | **Alta**   |
| **RF14** | **Definir Tipo de Acesso**              | Permite definir níveis de acesso para usuários (ex.: administrador, gerente, funcionário).                | **Alta**   |
| **RF15** | **Cadastrar Categoria de Produto**      | Permite cadastrar e gerenciar categorias de produtos.                                                      | **Alta**   |
| **RF16** | **Pré-Cadastro Semanal de Produção**    | Permite registrar semanalmente os produtos e materiais previstos para produção.                           | **Média**  |
| **RF17** | **Cadastrar Produto por Código de Barras** | Permite cadastrar ou identificar produtos utilizando leitura de código de barras.                         | **Alta**   |
| **RF18** | **Dashboard Gerencial**                 | Apresenta painel com indicadores de desperdício, perda financeira e produtos próximos do vencimento.      | **Alta**   |

## Requisitos Não Funcionais
| Nº        | Requisito            | Descrição                                                                 | Prioridade |
| --------- | -------------------- | ------------------------------------------------------------------------- | ---------- |
| **RNF01** | **Usabilidade**      | Interface simples e intuitiva para facilitar o uso pelos funcionários.   | **Alta**   |
| **RNF02** | **Confiabilidade**   | Os dados devem ser armazenados de forma segura, evitando perda de informações. | **Alta**   |
| **RNF03** | **Segurança**        | O sistema deve exigir autenticação por login e senha e controle de acesso por perfil. | **Alta**   |
| **RNF04** | **Performance**      | Consultas, registros e relatórios devem ser processados em até **3 segundos**. | **Alta**   |
| **RNF05** | **Portabilidade**    | O sistema deve funcionar em navegadores modernos (Chrome, Edge e Firefox). | **Média**  |
| **RNF06** | **Escalabilidade**   | O sistema deve suportar aumento no número de produtos e usuários sem perda significativa de desempenho. | **Média**  |
| **RNF07** | **Manutenibilidade** | O código deve ser organizado e documentado para facilitar manutenção e evolução. | **Média**  |
