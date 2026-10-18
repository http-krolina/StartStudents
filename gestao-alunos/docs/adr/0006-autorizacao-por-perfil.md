# Título
Autorização por perfil com @PreAuthorize

## Status
Aceito

## Contexto
Existem dois perfis: **Administrador** (lista, consulta e cadastra) e **Leitor** (apenas lista e consulta). Esconder botões no front não basta: alguém poderia chamar a API direto (ex.: pelo Bruno).

## Decisão
- O `UsuarioService` (implementa `UserDetailsService`) carrega o usuário e transforma o perfil em autoridade com o prefixo `ROLE_` (`ROLE_ADMINISTRADOR`, `ROLE_LEITOR`).
- O `@EnableMethodSecurity` ativa as anotações de permissão nos métodos dos controllers:

```java
@PostMapping
@PreAuthorize("hasRole('ADMINISTRADOR')")
public ResponseEntity<AlunoDetalheResponse> cadastrar(...)

@GetMapping
@PreAuthorize("hasAnyRole('ADMINISTRADOR', 'LEITOR')")
public ResponseEntity<PageResponse<AlunoListaResponse>> listar(...)
```

- Usuário autenticado sem permissão recebe **403**.

## Alternativas consideradas
- Regras por URL no `SecurityFilterChain` (`requestMatchers(...).hasRole(...)`): funciona, mas separa a regra do endpoint que ela protege.
- Checar o perfil manualmente dentro do service: repetitivo e fácil de esquecer.

## Consequências
Pontos positivos:
- A permissão fica visível ao lado de cada endpoint.
- A regra vale mesmo que o front seja burlado.

Pontos negativos:
- Cada novo endpoint precisa lembrar de receber a anotação.

## Explicação para iniciantes
O front esconder o botão é como tirar a placa da porta; o `@PreAuthorize` é a fechadura. Sem placa, alguém ainda pode achar a porta — mas sem a chave certa, não entra.
