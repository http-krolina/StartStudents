# Título
Detalhes do aluno em texto descritivo com lista de definição

## Data
2026-10-02

## Status
Aceito

## Contexto
Os detalhes do aluno são somente leitura. Usar campos de formulário desabilitados criaria a impressão de edição e aumentaria o custo visual e semântico da tela.

## Decisão
As informações do aluno no modal são exibidas em texto descritivo usando uma lista de definição (`<dl>`, `<dt>`, `<dd>`), estilizada para se parecer com caixas informativas.

## Alternativas consideradas
- Usar inputs desabilitados.
- Renderizar apenas parágrafos soltos sem estrutura semântica.

## Consequências
Pontos positivos:
- comunica claramente que a tela é somente leitura;
- melhora semântica e acessibilidade;
- evita elementos de formulário desnecessários.

Pontos negativos:
- exige mais trabalho de estilização;
- precisa manter o padrão visual consistente com a listagem.

## Explicação para iniciantes
É como usar etiquetas e quadros informativos para mostrar os dados, em vez de colocar caixas que parecem editáveis e depois desativá-las.