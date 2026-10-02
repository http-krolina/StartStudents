# Título
Guard de rota para páginas internas protegidas

## Data
2026-10-01

## Status
Aceito

## Contexto
A rota `/pagina-inicial` passou a representar uma área interna da aplicação. Sem uma verificação de token no frontend, a pessoa poderia abrir a URL diretamente mesmo sem ter feito login.

## Decisão
Foi criado o guard funcional `src/app/guards/auth.guard.ts` e aplicado à rota `pagina-inicial` em `src/app/app.routes.ts`. Quando não há token salvo na sessão, o acesso é bloqueado e a navegação volta para `/login`.

## Alternativas consideradas
- Deixar a rota aberta e confiar apenas no backend.
- Validar autenticação dentro do componente, depois que a rota já abriu.

## Consequências
Pontos positivos:
- melhora a experiência de navegação;
- evita abrir telas internas sem sessão;
- implementa a RN-007 de forma explícita.

Pontos negativos:
- não substitui a proteção real da API;
- depende de o token existir no `sessionStorage` para liberar a rota.

## Explicação para iniciantes
É como verificar na portaria se a pessoa tem crachá antes de deixá-la entrar no corredor interno, em vez de descobrir isso só quando ela já entrou na sala.