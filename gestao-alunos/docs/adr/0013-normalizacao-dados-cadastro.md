# Título
Normalização dos dados no cadastro e unicidade de CPF e e-mail

## Status
Aceito

## Contexto
O mesmo dado pode chegar em formatos diferentes (`123.456.789-09` ou `12345678909`; `Ana@Email.com` ou `ana@email.com`). Sem padronizar, a verificação de duplicidade falharia e o banco ficaria inconsistente.

## Decisão
Antes de salvar, o `AlunoService.cadastrar` normaliza:
- **CPF** e **telefone**: apenas dígitos (`replaceAll("\\D", "")`).
- **E-mail**: sem espaços nas pontas e em minúsculas.
- **Nome**: sem espaços nas pontas e sem espaços duplicados no meio.

Depois verifica duplicidade (`existsByCpf`, `existsByEmailIgnoreCase`) e, se encontrar, lança `ConflitoException` com o nome do campo → resposta **409**. O banco também tem `UNIQUE` em `cpf` e `email` como última barreira. Todo aluno novo nasce com status `ATIVO`.

## Alternativas consideradas
- Salvar como chegou: duplicidades passariam despercebidas.
- Confiar só no `UNIQUE` do banco: o erro viria como exceção genérica, sem dizer ao usuário qual campo está repetido.

## Consequências
Pontos positivos:
- Dados sempre no mesmo formato, facilitando buscas e exibição (a máscara é aplicada no front).
- Mensagem clara de qual campo já existe.

Pontos negativos:
- A regex de telefone do `AlunoCadastroRequest` hoje aceita apenas dígitos; o front deve enviar o telefone sem máscara.

## Explicação para iniciantes
É como guardar documentos numa pasta: antes de arquivar, você tira os clipes e grampos (pontos, traços, maiúsculas) para todos ficarem no mesmo formato — e assim percebe na hora se aquele documento já estava lá.
