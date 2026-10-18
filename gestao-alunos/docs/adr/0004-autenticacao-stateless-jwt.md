# Título
Autenticação stateless com JWT

## Status
Aceito

## Contexto
O front (Angular) e o back rodam separados e conversam por HTTP. Depois do login, cada requisição precisa provar quem é o usuário e qual o seu perfil, sem que o servidor guarde sessão em memória.

## Decisão
- O login (`POST /api/auth/login`) usa o `AuthenticationManager` do Spring Security para conferir usuário e senha.
- Se estiver correto, o `JwtService` gera um token assinado (HMAC-SHA, biblioteca `jjwt` 0.12.6) com o login no `subject`, o perfil numa claim e validade de 1 hora (`jwt.expiration=3600000`).
- O front envia o token no header `Authorization: Bearer <token>`.
- O `JwtAuthFilter` (`OncePerRequestFilter`) lê o header, valida a assinatura e a validade, e registra o usuário no `SecurityContext`.
- A sessão é `STATELESS` e requisições sem token válido recebem **401** (`HttpStatusEntryPoint`).

## Alternativas consideradas
- Sessão no servidor com cookie: exigiria guardar estado e tratar CSRF.
- HTTP Basic (usuário e senha em toda requisição): expõe a senha a cada chamada.

## Consequências
Pontos positivos:
- O servidor não guarda sessão; cada requisição se valida sozinha.
- Padrão de mercado para APIs consumidas por SPAs.

Pontos negativos:
- Não há como invalidar um token antes de expirar; o logout é feito apagando o token no front.
- Não há refresh token: após 1 hora o usuário precisa logar de novo.

## Explicação para iniciantes
O JWT é como a pulseira de um evento: na entrada (login) conferem seu documento e te dão a pulseira. Depois, em cada área, o segurança só olha a pulseira (filtro), sem consultar a lista de convidados de novo.
