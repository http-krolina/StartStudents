# Título
Edição de aluno em modal sobre a listagem

## Status
Aceito

## Contexto
O ícone de lápis da listagem (visível só para Administrador) precisava de uma tela de edição. A listagem guarda busca, filtro, ordenação e página, e o usuário não deve perdê-los ao editar. O modal de detalhes já existe e define o padrão visual e de acessibilidade.

## Decisão
A edição é um modal (`app-aluno-edicao-modal`) aberto sobre a listagem, no mesmo padrão do modal de detalhes (`alunoEdicaoSelecionadoId`). Reaproveita o CSS do modal de detalhes, prende o foco, fecha com Escape e devolve o foco ao lápis que o abriu. CPF e matrícula aparecem como texto somente leitura. Ao salvar com sucesso, o modal fecha, a listagem mostra "Aluno atualizado com sucesso." e recarrega mantendo busca, filtro, ordenação e página (RN-015). Fechar com alterações não salvas pede confirmação (RN-039).

## Alternativas consideradas
- Rota própria `/alunos/{id}/editar`, como no cadastro.
- Edição na própria linha da tabela.

## Consequências
Pontos positivos:
- a listagem e seu estado continuam intactos por trás do modal;
- consistência visual e de acessibilidade com os detalhes.

Pontos negativos:
- a edição não tem URL própria, então não pode ser linkada;
- o modal concentra bastante lógica (carregamento, validação, envio, confirmação).

## Explicação para iniciantes
É como abrir uma janelinha em cima da lista para corrigir os dados de um aluno. Ao terminar, a janela fecha e você continua exatamente onde estava na lista.
