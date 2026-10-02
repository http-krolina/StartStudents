# Título
Estado da listagem preservado nos query params da URL

## Data
2026-10-01

## Status
Aceito

## Contexto
A listagem possui busca, filtro, ordenação e paginação. Sem persistir esse estado na URL, ao voltar de outra tela a pessoa perderia o contexto anterior.

## Decisão
Os estados `busca`, `status`, `pagina`, `ordenarPor` e `direcao` passaram a ser lidos e escritos nos query params da rota `pagina-inicial`. A tela reconstrói o estado a partir da URL ao ser aberta.

## Alternativas consideradas
- Guardar esse estado apenas em memória no componente.
- Persistir o estado no `sessionStorage`.

## Consequências
Pontos positivos:
- preserva contexto ao navegar e voltar;
- permite compartilhar a URL com a mesma visão filtrada;
- atende a RN-015 de forma explícita.

Pontos negativos:
- adiciona lógica extra de sincronização entre UI e rota;
- a URL fica um pouco mais longa.

## Explicação para iniciantes
É como anotar na capa do processo em que página e com quais filtros você estava, para retomar depois exatamente do mesmo ponto.