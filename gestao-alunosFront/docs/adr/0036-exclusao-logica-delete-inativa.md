# Título
Exclusão lógica: o front chama DELETE e o back inativa o registro


## Status
Aceito

## Contexto
O back-end adota exclusão por inativação (ADR 0014 do back-end): o registro não é apagado do banco. O front precisa refletir isso sem expor detalhes de implementação ao usuário.

## Decisão
O front chama `DELETE /api/alunos/{id}` via `AlunoService.excluir(id)` (`http.delete<void>`) e trata 204 como sucesso. O aviso ao usuário informa que o aluno "deixará de aparecer entre os ativos" e o feedback é "Aluno excluído com sucesso.". Quem inativa o registro é o back-end; o front não envia `PATCH` de status para excluir.

## Alternativas consideradas
- Usar `PATCH` com `status: INATIVO` como "exclusão".
- Dizer ao usuário que o dado é apagado definitivamente.

## Consequências
Pontos positivos:
- contrato HTTP claro e semântico;
- a regra de inativação fica em um só lugar, no servidor;
- texto honesto para o usuário.

Pontos negativos:
- o aluno ainda pode aparecer ao filtrar por inativos.

## Explicação para iniciantes
"Excluir" aqui é como mover para o arquivo morto: o aluno some da lista de ativos, mas o registro continua guardado. O front só pede "exclua"; o servidor decide guardar como inativo.
