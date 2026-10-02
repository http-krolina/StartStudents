# Título
Formulário de cadastro simples, sem estilização nesta entrega

## Data
2026-10-02

## Status
Aceito

## Contexto
O sistema precisava de uma primeira versão do cadastro de aluno apenas para validar a integração com a API. Nesta etapa, o foco era comportamento e validação, não apresentação visual.

## Decisão
Foi criado o componente standalone `src/app/pages/aluno-novo` com Reactive Forms e HTML simples, usando o mínimo de CSS apenas para empilhar os campos verticalmente. A tela não inclui matrícula, status nem foto, porque esses dados são gerados pelo backend.

## Alternativas consideradas
- Fazer a tela já com layout completo e visual refinado.
- Colocar o formulário dentro da listagem de alunos.

## Consequências
Pontos positivos:
- entrega rápida da integração com a API;
- foco na validação e no fluxo de cadastro;
- menor risco de misturar comportamento com visual.

Pontos negativos:
- a aparência ainda é básica;
- a interface precisará de evolução em uma próxima etapa.

## Explicação para iniciantes
É como montar primeiro o motor do carro e só depois caprichar no acabamento do painel: nesta versão, o importante é fazer o cadastro funcionar.