# Título
AlunoService e modelos tipados para a API de alunos

## Data
2026-10-01

## Status
Aceito

## Contexto
A listagem de alunos precisa consumir uma API com filtros, paginação e ordenação. Sem modelos tipados, o componente ficaria acoplado a estruturas soltas de JSON e ficaria mais fácil cometer erros de nome de campo.

## Decisão
Foram criados os modelos em `src/app/models/` (`StatusAluno`, `AlunoLista`, `PaginaResponse`) e o serviço `src/app/services/aluno.service.ts`. Toda comunicação HTTP da listagem ficou centralizada no serviço, com `HttpParams` para montar apenas os filtros preenchidos.

## Alternativas consideradas
- Fazer a chamada HTTP diretamente no componente.
- Usar objetos sem tipagem explícita.

## Consequências
Pontos positivos:
- melhora autocomplete e validação de tipos;
- reduz acoplamento do componente aos detalhes da API;
- mantém a regra "HTTP só no serviço".

Pontos negativos:
- exige arquivos extras para manter;
- requer mapear o contrato real do backend para o modelo usado no front.

## Explicação para iniciantes
É como criar formulários com campos nomeados antes de guardar dados no arquivo, em vez de jogar tudo em uma folha solta sem legenda.