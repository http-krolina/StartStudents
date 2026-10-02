# Título
Interceptor para anexar token e tratar sessão expirada

## Data
2026-10-01

## Status
Aceito

## Contexto
Com a listagem de alunos integrada ao backend, várias requisições autenticadas passam a existir no frontend. Repetir manualmente o header `Authorization` em cada chamada aumenta o risco de erro e espalha uma regra técnica por vários pontos da aplicação.

## Decisão
Foi criado um interceptor funcional em `src/app/interceptors/auth.interceptor.ts` e registrado em `src/app/app.config.ts`. Ele adiciona `Authorization: Bearer <token>` em toda chamada para a API, exceto no login. No mesmo ponto, respostas `401` limpam a sessão via `AuthService.logout()` e redirecionam para `/login` com a mensagem de sessão expirada.

## Alternativas consideradas
- Adicionar o token manualmente em cada serviço.
- Tratar `401` dentro de cada componente que consome API.

## Consequências
Pontos positivos:
- centraliza autenticação de requisições;
- reduz duplicação;
- padroniza o tratamento de sessão expirada.

Pontos negativos:
- adiciona uma camada implícita no fluxo HTTP;
- exige atenção para não interceptar indevidamente a chamada de login.

## Explicação para iniciantes
É como colocar uma catraca na entrada do prédio que confere o crachá automaticamente para todo mundo, em vez de cada sala conferir isso sozinha.