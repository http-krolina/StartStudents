# Start Students – Gestão de Alunos

Sistema web para consultar e manter o cadastro de alunos, desenvolvido como desafio técnico.

## Funcionalidades

- Login com usuário e senha, token JWT e logout
- Perfis de acesso: **Administrador** (lista, consulta e cadastra) e **Leitor** (lista e consulta)
- Listagem de alunos com busca por nome ou matrícula, filtro por status, ordenação e paginação (10 por página)
- Cadastro de aluno com matrícula gerada automaticamente
- Detalhes do aluno em modo somente leitura
- Rotas protegidas no front e no back

> Edição e inativação de alunos estão previstas para a próxima entrega.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Back-end | Java 25, Spring Boot 4, Spring Web, Spring Data JPA, Spring Security, JWT (JJWT), Bean Validation, Lombok |
| Banco de dados | H2 (arquivo local) |
| Front-end | Angular (componentes standalone), TypeScript, Reactive Forms |

## Estrutura

```
gestao-alunos/          → back-end (Spring Boot)
gestao-alunosFront/    → front-end (Angular)
```

## Pré-requisitos

- Java 25 (ou 21+)
- Maven (ou o wrapper `mvnw` do projeto)
- Node.js 20+

## Como rodar

### 1. Back-end

1. Na pasta do back, copie o arquivo `.env.example` e renomeie a cópia para `.env`.
2. No `.env`, preencha a chave do JWT (mínimo de 32 caracteres, sem espaços):
   ```properties
   JWT_SECRET=coloque-aqui-uma-chave-com-pelo-menos-32-caracteres
   ```
3. Rode a aplicação pela IDE (classe `GestaoAlunosApplication`) ou pelo terminal:
   ```bash
   ./mvnw spring-boot:run
   ```
4. A API sobe em `http://localhost:8080`.

As tabelas e os dados de teste são criados automaticamente na inicialização (`schema.sql` e `data.sql`).

### 2. Front-end

```bash
cd gestao-alunosFront
npm install
npm start
```

Acesse `http://localhost:4200`.

> Se o comando `ng` não estiver disponível na máquina, use `npx ng ...` no lugar.

## Usuários de teste

| Perfil | Login | Senha |
| --- | --- | --- |
| Administrador | `admin001` | `Admin1234` |
| Leitor | `leitor01` | `Leitor1234` |

A carga inicial também inclui **25 alunos** (22 ativos e 3 inativos).

> Credenciais apenas para avaliação local. A cada reinício do back, esses usuários e alunos voltam aos dados originais; alunos cadastrados pela tela são mantidos.

## Endpoints

Todas as rotas, exceto o login, exigem o header `Authorization: Bearer <token>`.

| Método | Rota | Perfis | Descrição |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Público | Autentica e devolve o token e o perfil |
| GET | `/api/alunos` | Admin, Leitor | Lista paginada com busca, filtro e ordenação |
| GET | `/api/alunos/{id}` | Admin, Leitor | Detalhes de um aluno |
| POST | `/api/alunos` | Admin | Cadastra um aluno |

Parâmetros da listagem: `nome`, `matricula`, `status` (`ATIVO`/`INATIVO`), `pagina` (começa em 0), `tamanho` (padrão 10), `ordenarPor` (`nome`/`matricula`), `direcao` (`asc`/`desc`).

### Códigos de resposta

| Código | Quando |
| --- | --- |
| 200 / 201 | Sucesso / aluno criado |
| 400 | Requisição malformada |
| 401 | Sem token ou token inválido |
| 403 | Perfil sem permissão |
| 404 | Aluno não encontrado |
| 409 | CPF ou e-mail já cadastrado |
| 422 | Campos inválidos (lista de erros por campo) |

## Banco de dados

- Console do H2: `http://localhost:8080/h2-console`
- JDBC URL: a mesma de `spring.datasource.url` no `application.properties`
- Usuário: `sa` · Senha: (vazia)
