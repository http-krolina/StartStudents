# Título
Paginação, filtro e ordenação no servidor

## Status
Aceito

## Contexto
A listagem de alunos precisa de busca por nome ou matrícula, filtro por status, ordenação e paginação de 10 em 10. Enviar todos os alunos para o front filtrar não escala conforme a base cresce.

## Decisão
- `GET /api/alunos` recebe `nome`, `matricula`, `status`, `pagina` (começa em 0), `tamanho`, `ordenarPor` e `direcao`.
- O `AlunoService` protege os parâmetros:
  - ordenação só por `nome` ou `matricula` (lista permitida em `CAMPOS_ORDENACAO`);
  - tamanho padrão 10 e máximo 50;
  - textos com espaços nas pontas são limpos e texto vazio vira "sem filtro".
- O `AlunoRepository` faz a consulta com `Pageable` e devolve um `Page`.
- A resposta usa o record genérico `PageResponse<T>` (`conteudo`, `numeroPagina`, `tamanhoPagina`, `totalElementos`, `totalPaginas`), em vez de devolver o `Page` do Spring direto.

## Alternativas consideradas
- Paginação no front: simples, mas carrega todos os registros de uma vez.
- Devolver o `Page` do Spring: expõe muitos campos internos e muda conforme a versão do Spring.

## Consequências
Pontos positivos:
- Só a página pedida trafega pela rede.
- Parâmetros inválidos não quebram a consulta (caem no valor padrão).
- Formato de resposta estável e em português, combinando com o resto da API.

Pontos negativos:
- Cada troca de página, filtro ou ordenação é uma nova requisição.

## Explicação para iniciantes
É como um catálogo de biblioteca: em vez de trazer todos os livros para a mesa, o bibliotecário entrega só a página 1 do índice já filtrada e ordenada; quer a próxima, pede de novo.
