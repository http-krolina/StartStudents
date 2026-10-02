# Título
Detalhes do aluno em modal sobre a listagem

## Data
2026-10-02

## Status
Aceito

## Contexto
A listagem de alunos já concentra busca, filtro, ordenação e paginação. Abrir detalhes em uma rota separada exigiria sair da tela e poderia fazer a pessoa perder o contexto da lista.

## Decisão
A visualização de detalhes passou a abrir em um modal sobre a própria listagem, acionado pelo ícone de olho. Ao fechar o modal, a pessoa retorna à mesma tela, mantendo página, busca, filtro e ordenação.

## Alternativas consideradas
- Abrir a visualização em uma rota dedicada.
- Exibir os detalhes em um painel lateral permanente.

## Consequências
Pontos positivos:
- preserva o contexto da listagem;
- reduz navegação desnecessária;
- simplifica o retorno ao ponto de origem.

Pontos negativos:
- adiciona complexidade de acessibilidade e foco;
- exige controle extra para bloquear rolagem do fundo.

## Explicação para iniciantes
É como abrir uma folha transparente por cima da lista, em vez de levar a pessoa para outra sala só para olhar um registro.