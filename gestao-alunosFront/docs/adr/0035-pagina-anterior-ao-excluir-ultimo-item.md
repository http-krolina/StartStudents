# Título
Voltar para a página anterior ao excluir o último item da página


## Status
Aceito

## Contexto
A listagem é paginada no servidor. Se o usuário exclui o único aluno da última página, recarregar a mesma página devolveria uma página vazia ou ajustada de forma surpreendente (RN-046, CA-11).

## Decisão
Após a exclusão (ou um 404, que também indica que o aluno não está mais lá), se a página tinha apenas um item e não é a primeira, a página atual diminui em um antes de recarregar. O recarregamento usa o mesmo caminho dos demais controles da lista, atualizando também o query param `pagina`, e mantém busca, filtro e ordenação.

## Alternativas consideradas
- Recarregar a mesma página e deixar o servidor responder vazio.
- Voltar sempre para a primeira página.

## Consequências
Pontos positivos:
- o usuário nunca vê uma página vazia sem motivo;
- a URL reflete a página exibida.

Pontos negativos:
- a decisão usa a contagem local de itens, que pode estar defasada se outra pessoa alterou a lista; o ajuste de página existente cobre esse caso.

## Explicação para iniciantes
Se você apagar o único aluno da página 3, a página 3 deixa de existir. Então o sistema leva você para a página 2 em vez de mostrar uma tela vazia.
