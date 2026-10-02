# Título
Alternativa neutra para aluno sem foto

## Data
2026-10-02

## Status
Aceito

## Contexto
Nem todos os alunos terão foto cadastrada. Deixar o espaço vazio quebraria a composição do modal e dificultaria reconhecer que há um placeholder intencional.

## Decisão
Quando a foto estiver ausente, o modal mostra um bloco neutro no mesmo tamanho da imagem, com as iniciais do aluno e indicação acessível de que a foto não existe.

## Alternativas consideradas
- Deixar o espaço em branco.
- Exibir um ícone genérico sem contexto.

## Consequências
Pontos positivos:
- mantém equilíbrio visual;
- deixa claro que a ausência de foto foi tratada de propósito;
- evita depender de uma imagem quebrada.

Pontos negativos:
- requer regra específica para extrair iniciais;
- cria mais um estado visual para manter.

## Explicação para iniciantes
É como colocar um cartão neutro com as iniciais quando não há foto, em vez de deixar um buraco vazio no lugar.