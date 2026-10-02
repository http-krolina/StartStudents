# Título
Erros do servidor associados aos campos do formulário

## Data
2026-10-02

## Status
Aceito

## Contexto
O endpoint de cadastro pode retornar erros de validação (`422`) ou conflito (`409`) com uma lista de campos. Se esses erros não forem mostrados no local correto, a pessoa usuária não sabe o que corrigir.

## Decisão
O componente de cadastro passou a ler `mensagem` e `erros` retornados pela API. Cada erro com `campo` é associado ao control correspondente com `setErrors({ servidor: ... })`, e erros sem campo vão para uma mensagem geral acima do botão.

## Alternativas consideradas
- Mostrar apenas um alerta genérico.
- Limpar os campos e obrigar o preenchimento novamente.

## Consequências
Pontos positivos:
- feedback mais preciso;
- evita perda de dados digitados;
- ajuda a resolver conflitos de CPF ou e-mail mais rápido.

Pontos negativos:
- aumenta um pouco a lógica do componente;
- exige cuidado para limpar os erros de servidor quando a pessoa edita o campo.

## Explicação para iniciantes
É como devolver uma ficha com as anotações exatamente no campo que precisa ser corrigido, em vez de mandar um aviso solto sem dizer onde está o problema.