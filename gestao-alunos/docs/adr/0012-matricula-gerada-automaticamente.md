# Título
Matrícula gerada automaticamente

## Status
Aceito

## Contexto
Todo aluno precisa de uma matrícula única. Se o usuário digitasse a matrícula, haveria risco de duplicidade e de formatos diferentes.

## Decisão
A matrícula é gerada no `AlunoService` no momento do cadastro, no formato **ano atual + sequência de 4 dígitos** (ex.: `20260026`):

```java
private String gerarMatricula() {
    String prefixo = String.valueOf(Year.now().getValue());
    int proximo = alunoRepository.findTopByMatriculaStartingWithOrderByMatriculaDesc(prefixo)
            .map(a -> Integer.parseInt(a.getMatricula().substring(prefixo.length())) + 1)
            .orElse(1);
    return prefixo + String.format("%04d", proximo);
}
```

A coluna é `UNIQUE` e `updatable = false` (não pode ser alterada depois).

## Alternativas consideradas
- Matrícula digitada pelo usuário: risco de erro e duplicidade.
- Usar o `id` do banco como matrícula: não traz o ano e expõe a chave interna.
- UUID: único, mas ilegível para pessoas.

## Consequências
Pontos positivos:
- Formato padronizado e legível, com o ano de ingresso.
- O usuário não precisa se preocupar com esse campo.

Pontos negativos:
- Limite de 9.999 alunos por ano.
- Em cadastros simultâneos, dois pedidos poderiam calcular o mesmo número; a restrição `UNIQUE` impede a gravação duplicada, mas o segundo pedido falharia. Aceitável para o volume do protótipo.

## Explicação para iniciantes
É como a senha de atendimento do banco: a máquina olha qual foi o último número chamado hoje e entrega o próximo — ninguém escolhe o próprio número.
