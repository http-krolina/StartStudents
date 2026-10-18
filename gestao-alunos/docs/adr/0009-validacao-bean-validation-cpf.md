# Título
Validação de entrada com Bean Validation e @CPF

## Status
Aceito

## Contexto
O front já valida os formulários, mas o back não pode confiar nisso: a API pode ser chamada diretamente. Era preciso validar formato de login, senha, nome, e-mail, telefone e CPF (incluindo os dígitos verificadores).

## Decisão
- As regras ficam como anotações nos records de entrada, ativadas por `@Valid` no controller:
  - `LoginRequest`: `@NotBlank` + `@Pattern` (login com 8+ alfanuméricos; senha de 8 a 20 com letras e números).
  - `AlunoCadastroRequest`: `@NotBlank`, `@Size`, `@Pattern` (nome e telefone), `@Email` e `@CPF`.
- Para o CPF foi usada a anotação `@CPF` do Hibernate Validator (`org.hibernate.validator.constraints.br.CPF`), que já calcula os dígitos verificadores.
- Os campos inválidos geram resposta **422** com a lista de erros por campo (ver ADR 0010).

## Alternativas consideradas
- Classe `CpfValidator` própria: daria o mesmo resultado com mais código para manter.
- Validar manualmente com `if` no service: repetitivo e espalha as regras.

## Consequências
Pontos positivos:
- As regras ficam declaradas junto dos campos, fáceis de ler.
- Front e back aplicam as mesmas regras (o front para a experiência do usuário, o back para a segurança).

Pontos negativos:
- `@CPF` é específico do Hibernate Validator (não faz parte do padrão Jakarta).

## Explicação para iniciantes
A validação no front é o porteiro que avisa "falta preencher isso"; a do back é a conferência final no cartório — mesmo que alguém pule o porteiro, o cartório não aceita documento errado.
