
# Título
Edição de aluno com atualização parcial (PATCH) e aplicação condicional por lambda

## Status
Aceito

## Contexto
A Feature 5 permite editar nome, e-mail, telefone e status de um aluno (RN-033), mantendo matrícula e CPF imutáveis (RN-032). Era preciso decidir se a edição exige todos os campos ou só os que mudaram, e como aplicar no service apenas os campos enviados sem encher o método de `if (campo != null)` repetidos.

## Decisão
- O endpoint é `PATCH /api/alunos/{id}`, restrito a `ADMINISTRADOR`, e devolve 200 com o aluno atualizado.
- O `AlunoEditarRequest` tem **todos os campos opcionais**. As anotações de formato (`@Email`, `@Size`, `@Pattern`) ignoram nulos e só validam o que vier preenchido. O e-mail tem um `@Pattern(".*\\S.*")` extra para recusar texto vazio.
- O `status` é do tipo `StatusAluno` no DTO: valores inválidos falham na conversão do JSON (400) em vez de estourar dentro do service (500).
- `cpf` e `matricula` não existem no DTO, então nunca são alterados.
- No `AlunoService`, um método auxiliar genérico aplica cada campo só quando ele vem preenchido:

```java
seInformado(request.email(),    email -> atualizarEmail(aluno, email));
seInformado(request.nome(),     nome  -> aluno.setNome(nome.trim().replaceAll("\\s+", " ")));
seInformado(request.telefone(), tel   -> aluno.setTelefone(tel.replaceAll("\\D", "")));
seInformado(request.status(),   aluno::setStatus);

private <T> void seInformado(T valor, Consumer<T> acao) {
    if (valor != null) {
        acao.accept(valor);
    }
}
```

- Usa-se **method reference** (`::`) quando a ação só repassa o valor para um método existente (`aluno::setStatus`) e **lambda** (`->`) quando há transformação ou mais de um parâmetro (nome, telefone, e-mail).
- A regra do e-mail fica em um método próprio, `atualizarEmail`, que só acusa conflito (409) se o e-mail pertencer a **outro** aluno.
- O método é `@Transactional`.

## Alternativas consideradas
- **PUT com todos os campos obrigatórios:** mais simples de validar, mas obriga o cliente a reenviar dados que não mudaram. Pela convenção HTTP, PUT substitui o recurso inteiro; para alteração parcial o método adequado é PATCH.
- **Um `if (campo != null)` por campo:** funciona e é legível, mas repete a mesma verificação quatro vezes e faz o método crescer a cada campo novo.
- **`Optional.ofNullable(...).map(...).ifPresent(...)`:** também elimina os `if`, porém cada campo ocupa três linhas encadeadas.
- **Criar um método por campo para usar `::` em todos (ex.: `atualizarNome` na entidade):** deixaria todas as linhas no mesmo formato, mas acrescenta métodos só para limpar uma linha de texto. Mantido como melhoria possível caso a normalização passe a ser reaproveitada no cadastro.

## Consequências
Pontos positivos:
- O cliente envia só o que mudou; o que não vier permanece igual.
- A verificação de nulo existe em um único lugar (`seInformado`), e cada linha do `atualizar` diz apenas o que fazer com o valor.
- Status inválido e e-mail em branco são recusados com 400 e 422, sem erro 500.
- RN-032 garantida pelo formato do DTO.

Pontos negativos:
- Quem não conhece lambda, `Consumer` e generics (`<T>`) precisa de um momento a mais para entender o `seInformado`.
- Um campo enviado como `null` explícito é tratado como "não informado"; não é possível usar o PATCH para limpar um campo (não há campo opcional que precise disso hoje).

## Explicação para iniciantes
É como um formulário de alteração de cadastro no banco: você marca só os campos que quer mudar e o resto da ficha fica como estava. O `seInformado` é o atendente que olha cada campo do formulário e só altera a ficha onde você escreveu alguma coisa. A lambda (`->`) é o bilhete que diz o que fazer com aquele campo; o `::` é o mesmo bilhete em versão curta, usado quando a instrução é só "copie para a ficha".
