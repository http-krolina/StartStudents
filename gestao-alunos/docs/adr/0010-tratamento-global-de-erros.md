# Título
Tratamento centralizado de erros e códigos HTTP

## Status
Aceito

## Contexto
Sem tratamento, as exceções voltariam como erro 500 genérico ou em formatos diferentes, e o front não conseguiria mostrar a mensagem certa no campo certo.

## Decisão
Um `@RestControllerAdvice` (`GlobalExceptionHandler`) converte exceções em respostas padronizadas:

| Situação | Exceção | Código | Corpo |
|---|---|---|---|
| Campos inválidos | `MethodArgumentNotValidException` | 422 | `ErroValidarResponse` com lista `erros[{campo, mensagem}]` |
| CPF ou e-mail duplicado | `ConflitoException` | 409 | `ErroValidarResponse` apontando o campo |
| Aluno inexistente | `NaoEncontradoException` | 404 | `ErroResponse` |

Outros códigos vêm do Spring Security: **401** (sem token, token inválido ou login incorreto) e **403** (perfil sem permissão). A rota `/error` é liberada no `SecurityFilterChain` para que esses erros não sejam mascarados como 401.

## Alternativas consideradas
- `try/catch` em cada controller: repetitivo.
- Deixar o formato padrão do Spring: não traz o campo de cada erro de forma simples para o front.

## Consequências
Pontos positivos:
- O front recebe sempre o mesmo formato e consegue marcar o erro no campo correspondente.
- Controllers e services ficam limpos, só lançando a exceção.

Pontos negativos:
- Exceções não mapeadas ainda resultam em 500 genérico.

## Explicação para iniciantes
O `GlobalExceptionHandler` é a central de atendimento: qualquer setor que tiver um problema encaminha para lá, e a central responde ao cliente sempre no mesmo formato de protocolo.
