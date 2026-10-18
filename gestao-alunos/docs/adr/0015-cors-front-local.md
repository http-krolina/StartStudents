# Título
CORS liberado para o front local

## Status
Aceito

## Contexto
O front roda em `http://localhost:4200` e o back em `http://localhost:8080`. Por segurança, o navegador bloqueia chamadas entre origens diferentes, a menos que o servidor autorize.

## Decisão
O `SecurityConfig` define um `CorsConfigurationSource`:
- Origem permitida: `http://localhost:4200`.
- Métodos: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`.
- Headers: `Authorization` e `Content-Type`.

O CORS é aplicado dentro do Spring Security (`http.cors(...)`), para que a verificação prévia do navegador (preflight `OPTIONS`) não seja barrada como 401.

## Alternativas consideradas
- `allowedOrigins("*")`: libera qualquer site a chamar a API.
- `@CrossOrigin` em cada controller: espalha a configuração.

## Consequências
Pontos positivos:
- Só o front do projeto consegue chamar a API pelo navegador.

Pontos negativos:
- Se o front rodar em outra porta ou for publicado em outro endereço, a origem precisa ser adicionada.

## Explicação para iniciantes
O CORS é a lista de convidados na portaria do prédio do back: o navegador só deixa o front entrar se o endereço dele estiver na lista.
