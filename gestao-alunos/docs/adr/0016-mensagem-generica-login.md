# Título
Resposta genérica para login inválido


## Status
Aceito

## Contexto
Ao errar o login, o sistema poderia dizer "usuário não encontrado" ou "senha incorreta". Mensagens diferentes revelam se um usuário existe, ajudando quem tenta adivinhar credenciais.

## Decisão
O `UsuarioController` captura qualquer `AuthenticationException` e responde sempre:

```java
return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(new ErroResponse("Credenciais inválidas"));
```

O front exibe a mesma mensagem genérica (ver ADR 0007 do front).

## Alternativas consideradas
- Mensagens específicas para usuário inexistente e senha errada: mais claras, porém menos seguras.

## Consequências
Pontos positivos:
- Não revela quais logins existem.

Pontos negativos:
- O usuário não sabe se errou o login ou a senha.

## Explicação para iniciantes
É como o cofre que só diz "combinação incorreta", sem contar quais números estavam certos.
