# Título
Paginação no servidor para a listagem de alunos

## Data
2026-10-01

## Status
Aceito

## Contexto
A API de alunos já devolve resultados paginados. Carregar todos os alunos no frontend para paginar localmente aumentaria tráfego, consumo de memória e acoplamento a uma estratégia diferente da definida no backend.

## Decisão
Foi adotada paginação no servidor. O frontend sempre solicita uma página por vez com `pagina`, `tamanho`, `ordenarPor` e `direcao`, e a interface de paginação usa `totalPaginas` e `totalElementos` retornados pela API.

## Alternativas consideradas
- Carregar todos os alunos e paginar no navegador.
- Solicitar todos os dados e paginar só visualmente.

## Consequências
Pontos positivos:
- reduz volume de dados por requisição;
- escala melhor conforme a base cresce;
- mantém frontend e backend alinhados.

Pontos negativos:
- cada troca de página depende da rede;
- exige sincronização entre estado da tela e parâmetros da URL.

## Explicação para iniciantes
É como pedir ao arquivo morto só a gaveta da letra que você precisa agora, em vez de trazer o armário inteiro para a mesa.