# Título
Senhas armazenadas com BCrypt

## Status
Aceito

## Contexto
Guardar senha em texto puro no banco é uma falha grave: qualquer pessoa com acesso ao banco veria as senhas de todos os usuários.

## Decisão
- O `SecurityConfig` expõe um `PasswordEncoder` do tipo `BCryptPasswordEncoder`.
- A tabela `usuario` guarda apenas `senha_hash` (hash BCrypt de 60 caracteres).
- No login, o Spring Security compara a senha digitada com o hash usando o próprio encoder; a senha nunca é "descriptografada".

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

## Alternativas consideradas
- `NoOpPasswordEncoder` (texto puro): usado apenas em teste local durante o desenvolvimento, descartado.
- SHA-256 simples: rápido demais e sem salt automático, mais vulnerável a ataques de força bruta.

## Consequências
Pontos positivos:
- Mesmo com acesso ao banco, as senhas não ficam visíveis.
- O BCrypt inclui salt automático e é lento de propósito, dificultando ataques.

Pontos negativos:
- Para criar usuários pelo SQL é preciso gerar o hash antes (ex.: com um gerador de BCrypt).

## Explicação para iniciantes
O hash é como moer café: dá para moer o grão (senha) e comparar o pó com outro pó, mas não dá para transformar o pó de volta em grão.
