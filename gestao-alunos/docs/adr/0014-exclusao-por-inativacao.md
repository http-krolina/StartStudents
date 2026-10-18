# Título
Exclusão de aluno por inativação (exclusão lógica) via DELETE

## Status
Aceito (substitui a versão "Proposto" de 2026-10-02)

## Contexto
A Feature 6 permite ao Administrador excluir um aluno. A RN-041 determina exclusão **lógica**: um campo na base deve sinalizar que o aluno foi excluído, preservando o histórico. Apagar o registro com `DELETE` físico perderia o histórico e quebraria referências futuras (notas, frequência). Era preciso decidir qual campo marca a exclusão e qual endpoint expõe a ação.

## Decisão
- O endpoint é `DELETE /api/alunos/{id}`, restrito a `ADMINISTRADOR`, e responde **204 No Content**.
- A exclusão é lógica: o service troca o `status` do aluno para `INATIVO`, usando a coluna e o enum que já existiam desde a Feature 2. O registro permanece no banco.

```java
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public ResponseEntity<Void> excluir(@PathVariable Long id) {
    alunoService.inativar(id);
    return ResponseEntity.noContent().build();
}

@Transactional
public void inativar(Long id) {
    Aluno aluno = alunoRepository.findById(id)
            .orElseThrow(() -> new NaoEncontradoException("Aluno não encontrado"));
    aluno.setStatus(StatusAluno.INATIVO);
    alunoRepository.save(aluno);
}
```

- Respostas: 204 (sucesso), 404 (aluno inexistente), 403 (Leitor), 401 (sem token).
- Excluir um aluno já inativo devolve 204 novamente: a operação é **idempotente** (repetir dá o mesmo resultado).
- O aluno inativo deixa de aparecer entre os ativos e continua consultável pelo filtro "Inativos" (RN-020 e RN-042).

## Alternativas consideradas
- **`DELETE` físico:** simples, mas irreversível e sem histórico; contraria a RN-041.
- **Campo próprio de exclusão (`excluido BOOLEAN`):** segue ao pé da letra o exemplo da RN-041 ("UsuarioExcluido") e faria o aluno sumir de todas as listas, mantendo o status como informação independente. Exigiria nova coluna, filtro em todas as consultas e decisão sobre a unicidade de e-mail entre registros "vigentes". Fica registrada como evolução possível se o gestor preferir essa leitura da regra.
- **Endpoint `PATCH /api/alunos/{id}/inativar`:** válido, mas o `DELETE` expressa melhor a intenção do usuário, que é excluir; como isso acontece por dentro é detalhe de implementação.
- **Responder 409 ao excluir um aluno já inativo:** avisaria o cliente, mas trataria como erro uma situação em que o resultado desejado já foi alcançado.

## Consequências
Pontos positivos:
- Histórico preservado e ação reversível: basta editar o status de volta para `ATIVO`.
- Reaproveita coluna, enum, `CHECK` e filtro que já existiam; nenhuma mudança no banco.
- O front só chama `DELETE` e trata 204, sem conhecer a regra interna (ADR 0036 do front).

Pontos negativos:
- "Excluído" e "inativo" passam a ser a mesma coisa: o aluno continua aparecendo no filtro "Todos" e "Inativos".
- Como o status também é editável (ADR 0017), a edição consegue fazer o mesmo que a exclusão.
- Alunos inativos continuam ocupando CPF e e-mail; não é possível recadastrar com os mesmos dados sem reativar.
- Não há registro de quem excluiu nem quando (extensão opcional da especificação).

## Explicação para iniciantes
É como desligar um funcionário: o crachá é desativado e ele não entra mais como ativo, mas a ficha dele continua arquivada no RH. Se ele voltar, basta reativar o crachá, sem precisar de uma ficha nova.
