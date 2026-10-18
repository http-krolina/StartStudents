# Título
Modal de confirmação de exclusão com foco inicial em Cancelar


## Status
Aceito

## Contexto
Excluir é uma ação destrutiva e disparada por um ícone pequeno na linha da tabela. Um clique ou Enter acidental não deve apagar nada.

## Decisão
Um modal (`app-aluno-exclusao-modal`, `role="alertdialog"`, com `aria-labelledby` no título e `aria-describedby` no texto) mostra nome e matrícula do aluno e pede confirmação (RN-042 a RN-047). O foco inicial vai para "Cancelar", a ação segura. O foco fica preso no modal, Escape age como Cancelar e, ao fechar, o foco volta ao ícone de lixeira. Durante o envio, "Excluir" mostra "Excluindo..." e ambos os botões ficam desabilitados, impedindo clique duplo e fechamento no meio da requisição. Erros 403 e status 0 mantêm o modal aberto com mensagem.

## Alternativas consideradas
- `window.confirm` do navegador.
- Foco inicial em "Excluir".
- Excluir direto com opção de desfazer.

## Consequências
Pontos positivos:
- reduz exclusões acidentais;
- consistente com os outros modais e acessível.

Pontos negativos:
- mais um clique para o administrador.

## Explicação para iniciantes
Antes de apagar, o sistema pergunta "tem certeza?". O cursor já começa no botão seguro (Cancelar), então apertar Enter sem pensar não apaga ninguém.
