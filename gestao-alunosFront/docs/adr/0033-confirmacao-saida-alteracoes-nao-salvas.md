# Título
Confirmação ao sair da edição com alterações não salvas (RN-039)


## Status
Aceito

## Contexto
Fechar o modal por engano (Cancelar, seta, Escape ou clique fora) apagaria o que o usuário digitou.

## Decisão
Se houver alterações em relação aos valores originais, uma confirmação aparece dentro do próprio modal (`role="alertdialog"`): "Existem alterações não salvas. Deseja sair sem salvar?", com "Continuar editando" e "Sair sem salvar". Sem alterações, o modal fecha direto. Escape durante a confirmação volta à edição. Durante o envio, o fechamento é ignorado.

## Alternativas consideradas
- `window.confirm` do navegador.
- Fechar sempre sem perguntar.

## Consequências
Pontos positivos:
- mesma estética e foco preso do modal;
- fácil de testar.

Pontos negativos:
- mais um estado visual no componente.

## Explicação para iniciantes
Se você já mexeu nos dados e tenta fechar a janela, ela pergunta "tem certeza?". Se não mexeu em nada, fecha na hora.
