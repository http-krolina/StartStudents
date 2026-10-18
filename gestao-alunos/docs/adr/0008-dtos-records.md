# Título
DTOs como records, separados das entidades

## Status
Aceito

## Contexto
A API precisa receber e devolver dados de alunos e usuários. Expor as entidades JPA diretamente mostraria campos internos (como `senhaHash`), acoplaria o formato da API ao banco e misturaria validações de formulário com o mapeamento da tabela.

## Decisão
- Toda entrada e saída da API usa DTOs no pacote `dto`, escritos como `record`:
  - Entrada: `LoginRequest`, `AlunoCadastroRequest`.
  - Saída: `LoginResponse`, `AlunoListaResponse` (só o que a lista mostra), `AlunoDetalheResponse`, `PageResponse<T>`, `ErroResponse`, `ErroValidarResponse`.
- A conversão entidade → DTO fica em métodos estáticos `de(...)` dentro do próprio DTO (ex.: `AlunoListaResponse::de`).
- As entidades (`Aluno`, `Usuario`) continuam como classes com Lombok, pois o JPA precisa de construtor vazio e setters.

## Alternativas consideradas
- Devolver a entidade direto: menos classes, mas expõe dados internos e trava a evolução da API.
- MapStruct para conversão: útil em projetos grandes, desnecessário para poucos campos.

## Consequências
Pontos positivos:
- A API mostra apenas o que cada tela precisa.
- Records são imutáveis e curtos (sem getters/setters manuais).
- O banco pode mudar sem quebrar o contrato com o front.

Pontos negativos:
- Mais classes para manter e conversões a escrever.

## Explicação para iniciantes
A entidade é a ficha completa do aluno guardada na secretaria; o DTO é a cópia que se entrega no balcão, só com as informações que quem pediu precisa ver.
