# Título
Exclusão de aluno por inativação

## Status
Proposto

## Contexto
O sistema terá a ação de "excluir" aluno (próxima entrega). Apagar o registro do banco perderia o histórico e poderia quebrar referências futuras (notas, frequência etc.).

## Decisão
A exclusão será **lógica**: o aluno passa a ter `status = INATIVO` em vez de ser removido. A estrutura já está preparada:
- Enum `StatusAluno` com `ATIVO` e `INATIVO`.
- Coluna `status` com `CHECK (status IN ('ATIVO', 'INATIVO'))`.
- Listagem com filtro por status.

A implementação do endpoint fica para a Feature 6.

## Alternativas consideradas
- `DELETE` físico: simples, mas irreversível e sem histórico.

## Consequências
Pontos positivos:
- Histórico preservado e ação reversível.

Pontos negativos:
- Alunos inativos continuam ocupando CPF e e-mail (não é possível recadastrar com os mesmos dados sem reativar).

## Explicação para iniciantes
É como desligar um funcionário: o crachá é desativado, mas a ficha dele continua arquivada no RH.
