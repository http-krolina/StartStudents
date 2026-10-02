# Título
Criação de uma página inicial provisória para validar o login

## Data
2026-09-30

## Status
Substituído

## Contexto
Após o login o sistema precisava confirmar visualmente que a autenticação tinha funcionado. Antes de criar a listagem real de alunos, era necessário ter uma página simples que mostrasse que o usuário entrou com sucesso e que pudesse testar o fluxo completo da autenticação.

## Decisão
Foi criada a página `pagina-inicial` em `src/app/pages/pagina-inicial`, com texto "Login realizado com sucesso!" e uma mensagem com o perfil do usuário caso o token exista. Esta página é apenas uma etapa de validação do fluxo. O componente e os arquivos envolvidos são:
- `src/app/pages/pagina-inicial/pagina-inicial.ts`
- `src/app/pages/pagina-inicial/pagina-inicial.html`
- `src/app/pages/pagina-inicial/pagina-inicial.css`

## Alternativas consideradas
- Redirecionar para uma tela vazia sem feedback visual.
- Direcionar diretamente para a futura listagem de alunos antes de validar o fluxo de autenticação.

## Consequências
Pontos positivos:
- facilita a verificação do login bem-sucedido;
- mostra o perfil do usuário e confirma que o token foi salvo;
- reduz o risco de avançar para telas futuras sem validar a autenticação.

Pontos negativos:
- essa página não é a funcionalidade final da aplicação;
- ela será substituída quando a área de alunos estiver pronta.

## Explicação para iniciantes
É como uma porta de entrada que acende uma luz verde depois que a pessoa entra no prédio. Antes de mostrar o escritório completo, é útil confirmar que a entrada foi aprovada.
