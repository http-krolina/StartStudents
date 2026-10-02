# Título
Registro consciente de que a rota ainda não é protegida (sem guard)

## Data
2026-09-30

## Status
Substituído

## Contexto
A aplicação já tem uma página inicial temporária após o login, mas ainda não possui guard de rota. Isso significa que, por enquanto, a tela pode ser acessada sem validação estrita do token no frontend.

## Decisão
Foi registrado explicitamente que a rota `/pagina-inicial` ainda não está protegida por guard, porque a implementação atual visa validar o fluxo de login de forma simples, sem bloquear acesso antes que a camada de autorização tenha sido totalmente definida.

Arquivos diretamente envolvidos:
- `src/app/app.routes.ts`
- `src/app/pages/pagina-inicial/pagina-inicial.ts`

## Alternativas consideradas
- criar um guard imediatamente, mesmo sem a regra completa de autorização;
- impedir o acesso à página inicial antes de definir a arquitetura de rotas e permissões.

## Consequências
Pontos positivos:
- mantém o foco no fluxo de autenticação atual;
- não cria complexidade excessiva antes da arquitetura definitiva;
- deixa clara a necessidade futura de um guard.

Pontos negativos:
- a rota não é protegida de forma definitiva;
- qualquer pessoa pode tentar acessar a página sem autenticação em uma etapa futura.

## Explicação para iniciantes
É como deixar uma porta aberta enquanto a equipe ainda está organizando a chave da segurança. Isso funciona para testar o fluxo, mas a porta precisa ser fechada depois com um sistema real de controle de acesso.
