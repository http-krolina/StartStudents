# Título
Banco de dados H2 em arquivo

## Data
2026-10-02

## Status
Aceito

## Contexto
O desafio é um protótipo para avaliação. Quem for rodar o projeto não deve precisar instalar e configurar um servidor de banco (como PostgreSQL) para testar. Ao mesmo tempo, os dados cadastrados não devem sumir a cada reinício.

## Decisão
Foi usado o H2 em modo **arquivo**, com o console web habilitado:

```properties
spring.datasource.url=jdbc:h2:file:./data/gestao-alunos;AUTO_SERVER=TRUE
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

- `file:./data/...` grava o banco numa pasta `data/` dentro do projeto (caminho relativo, funciona em qualquer máquina).
- `AUTO_SERVER=TRUE` permite abrir o console ou o DBeaver enquanto a aplicação está rodando.
- A pasta `data/` e os arquivos `*.mv.db` / `*.trace.db` estão no `.gitignore`.

## Alternativas consideradas
- PostgreSQL: mais próximo de produção, mas exige instalação e configuração por quem avalia.
- H2 em memória (`jdbc:h2:mem:`): mais simples, mas perde os dados a cada reinício.

## Consequências
Pontos positivos:
- Nenhuma instalação extra: basta rodar a aplicação.
- Os dados persistem entre reinícios.

Pontos negativos:
- H2 não é indicado para produção; uma futura migração para PostgreSQL exigirá revisar o SQL (ex.: o `MERGE INTO ... KEY` é específico do H2).

## Explicação para iniciantes
O H2 é como um caderno que fica dentro da mochila do projeto: vai junto para onde o projeto for. O PostgreSQL seria um arquivo de escritório — mais robusto, mas cada pessoa precisaria ter um instalado.
