# Título
Envio apenas dos campos alterados via PATCH


## Status
Aceito

## Contexto
A API aceita `PATCH /api/alunos/{id}` com corpo parcial (`nome`, `email`, `telefone`, `status`, todos opcionais). Enviar campos inalterados poderia disparar validações e conflitos desnecessários (por exemplo, e-mail já existente do próprio aluno).

## Decisão
`AlunoService.atualizar(id, dados: AlunoEdicao)` faz o PATCH com o modelo `AlunoEdicao` (campos opcionais). O modal monta o corpo só com os campos que diferem dos valores originais normalizados; o telefone vai apenas com dígitos e o status em maiúsculas. Erros 409 e 422 são mostrados abaixo do campo correspondente (e-mail no caso de 409, RN-037); 404 mostra "Aluno não encontrado"; status 0 mostra mensagem de conexão mantendo os dados digitados. Durante o envio o botão mostra "Salvando..." e fica desabilitado (RN-038).

## Alternativas consideradas
- PUT com o objeto completo.
- PATCH com todos os campos do formulário.

## Consequências
Pontos positivos:
- tráfego e validações menores no servidor;
- menos risco de sobrescrever dados alterados por outra pessoa.

Pontos negativos:
- exige calcular a diferença antes de enviar.

## Explicação para iniciantes
Se você só trocou o telefone, mandamos só o telefone. É como corrigir uma linha de um formulário em vez de reescrever o formulário inteiro.
