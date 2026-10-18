# Título
Arquitetura em camadas

## Data
2026-10-02

## Status
Aceito

## Contexto
O back precisa atender login, listagem, cadastro e detalhes de alunos, e vai crescer com edição e inativação. Sem uma organização clara, regras de negócio, acesso ao banco e respostas HTTP acabariam misturadas na mesma classe, dificultando manutenção e testes.

## Decisão
O código foi dividido em pacotes por responsabilidade:

| Pacote | Responsabilidade |
|---|---|
| `controller` | Recebe a requisição HTTP e devolve a resposta (`UsuarioController`, `AlunoController`) |
| `service` | Regras de negócio (`AlunoService`, `UsuarioService`) |
| `repository` | Acesso ao banco com Spring Data JPA |
| `domain` | Entidades e enums (`Aluno`, `Usuario`, `Perfil`, `StatusAluno`) |
| `dto` | Objetos de entrada e saída da API |
| `security` | Configuração de segurança e JWT |
| `exception` | Exceções próprias e tratamento global de erros |

O fluxo é sempre: `Controller → Service → Repository → Banco`. O controller não acessa o repository diretamente.

## Alternativas consideradas
- Colocar tudo no controller: mais rápido no início, mas mistura responsabilidades.
- Organização por feature (`aluno/`, `auth/`): boa para sistemas grandes, mas exagerada para o tamanho atual.

## Consequências
Pontos positivos:
- Cada classe tem um papel claro, o que facilita encontrar e alterar código.
- As regras ficam no service, onde poderão ser testadas na próxima entrega.

Pontos negativos:
- Mais arquivos e pacotes do que uma solução "tudo em um".

## Explicação para iniciantes
Pense num restaurante: o garçom (controller) anota o pedido, o cozinheiro (service) prepara seguindo a receita, e o estoquista (repository) busca os ingredientes na despensa (banco). O garçom não entra na despensa.
