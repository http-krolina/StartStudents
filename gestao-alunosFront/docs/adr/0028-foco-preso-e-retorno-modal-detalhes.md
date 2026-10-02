# Título
Foco preso e devolvido ao fechar o modal de detalhes

## Data
2026-10-02

## Status
Aceito

## Contexto
Um modal acessível precisa impedir que a navegação por teclado escape para a tela de trás enquanto ele estiver aberto. Ao fechar, o foco deve voltar para o elemento que abriu o modal para manter a continuidade da navegação.

## Decisão
O modal prende o foco dentro dele enquanto está aberto, aceita fechamento por `Escape`, pelo botão do topo, pelo botão de voltar e pelo clique fora. Ao fechar, o foco retorna ao ícone de olho que abriu os detalhes.

## Alternativas consideradas
- Não prender o foco e depender apenas da sobreposição visual.
- Mandar o foco para o início da página ao fechar.

## Consequências
Pontos positivos:
- melhora navegação por teclado;
- reduz confusão de contexto;
- reforça a experiência acessível do modal.

Pontos negativos:
- aumenta a lógica de interação;
- exige cuidado para não deixar o foco preso quando o modal desmonta.

## Explicação para iniciantes
É como prender o cursor na janela que está aberta e depois devolvê-lo exatamente para o botão que a abriu, em vez de jogá-lo para um lugar aleatório da tela.