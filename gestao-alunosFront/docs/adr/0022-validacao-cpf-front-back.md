# Título
Validação de CPF no front com validador customizado e no back com @CPF

## Data
2026-10-02

## Status
Aceito

## Contexto
O CPF precisa ser aceito com ou sem máscara e rejeitar valores inválidos antes de enviar a requisição. A API também valida esse dado, então a regra deve existir nos dois lados.

## Decisão
Foi criado o validador customizado `src/app/validators/cpf.validator.ts`, que remove caracteres não numéricos, rejeita CPFs com todos os dígitos iguais e confere os dígitos verificadores. O backend continua como fonte final de validação com `@CPF`.

## Alternativas consideradas
- Validar CPF apenas no backend.
- Validar CPF apenas com regex no frontend.

## Consequências
Pontos positivos:
- reduz requisições desnecessárias com CPF inválido;
- melhora a experiência da pessoa usuária;
- mantém a mesma regra de negócio em duas camadas.

Pontos negativos:
- a regra fica replicada em mais de um lugar;
- o front precisa acompanhar qualquer mudança futura do backend.

## Explicação para iniciantes
É como conferir o número do documento na recepção e também na sala onde ele vai ser usado. A primeira checagem evita trabalho desnecessário, e a segunda garante segurança.