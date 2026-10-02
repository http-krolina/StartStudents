# Título
Status com texto e indicador visual combinado

## Data
2026-10-01

## Status
Aceito

## Contexto
O status do aluno precisa ser fácil de identificar, mas não pode depender apenas de cor. Isso é importante para acessibilidade e atende às RN-017 e RN-018.

## Decisão
O status passou a ser exibido como selo com texto e um ponto visual. `Ativo` usa fundo verde claro com texto verde, e `Inativo` usa fundo cinza claro com texto cinza.

## Alternativas consideradas
- Usar apenas cor na célula da tabela.
- Exibir somente texto simples sem reforço visual.

## Consequências
Pontos positivos:
- melhora legibilidade e acessibilidade;
- mantém leitura rápida na tabela;
- evita depender exclusivamente de percepção de cor.

Pontos negativos:
- adiciona mais regras visuais ao CSS;
- precisa ser mantido consistente em telas futuras.

## Explicação para iniciantes
É como colocar uma etiqueta com palavra e símbolo no arquivo, para que a informação continue clara mesmo se alguém não distinguir bem a cor da etiqueta.