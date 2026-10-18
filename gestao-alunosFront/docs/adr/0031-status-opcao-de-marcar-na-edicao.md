# Título
Status do aluno como opção de marcar na edição


## Status
Aceito

## Contexto
O status só pode ser "Ativo" ou "Inativo". Um campo de texto permitiria valores inválidos, e o status deve ter texto e indicador visual, nunca só cor (RN-017/018, ADR 0019).

## Decisão
O status é um grupo de dois botões de alternância (`aria-pressed`) dentro de um `role="group"` rotulado "Status". "Ativo" fica verde e "Inativo" cinza, cada um com um ponto indicador e o texto. O valor interno é `ATIVO` ou `INATIVO`.

## Alternativas consideradas
- Campo de texto livre.
- `select` nativo.
- Radio buttons nativos escondidos e estilizados.

## Consequências
Pontos positivos:
- impossível digitar um status inválido;
- texto, cor e indicador juntos, acessível a quem não distingue cores;
- cada opção é um botão simples no ciclo de foco do modal.

Pontos negativos:
- navegação por setas de um radio group nativo não existe; usa-se Tab entre as duas opções.

## Explicação para iniciantes
Em vez de deixar a pessoa escrever "ativo" ou "inativo" (e errar), mostramos dois botões e ela escolhe um. O escolhido fica colorido e tem sempre a palavra escrita.
