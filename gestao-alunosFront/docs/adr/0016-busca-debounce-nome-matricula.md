# Título
Busca com debounce e escolha automática entre nome e matrícula

## Data
2026-10-01

## Status
Aceito

## Contexto
A busca precisa ser responsiva sem disparar uma chamada HTTP a cada tecla. Além disso, o backend expõe dois filtros diferentes: `nome` e `matricula`.

## Decisão
Foi adotado `debounceTime(400)` no campo de busca. O valor digitado é normalizado com `trim()`. Se o texto contiver apenas números, o frontend envia `matricula`; caso contrário, envia `nome`.

## Alternativas consideradas
- Fazer busca imediata a cada tecla.
- Exigir dois campos separados, um para nome e outro para matrícula.

## Consequências
Pontos positivos:
- reduz chamadas desnecessárias;
- simplifica a interface com um único campo;
- traduz a intenção da pessoa usuária de forma automática.

Pontos negativos:
- cria um pequeno atraso proposital antes da busca;
- exige cuidado com casos limítrofes de texto numérico.

## Explicação para iniciantes
É como esperar a pessoa terminar a frase antes de procurar no arquivo, em vez de sair correndo para cada sílaba que ela fala.