# Título
Armazenamento do token em sessionStorage

## Data
2026-09-30

## Status
Aceito

## Contexto
Depois de autenticar, o frontend precisa guardar o token para reutilizar em futuras requisições e manter o usuário validado na sessão atual. A decisão entre `sessionStorage` e `localStorage` influencia a duração e o escopo da persistência.

## Decisão
Foi escolhido o `sessionStorage` para guardar o token e o perfil do usuário. O token é salvo depois da resposta bem-sucedida da autenticação e é usado como base para a navegação para `/alunos`.

Arquivo principal:
- `src/app/pages/login/login.ts`

Trecho relevante:
```ts
next: ({ token, perfil }) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('perfil', perfil);
  this.router.navigate(['/alunos']);
}
```

## Alternativas consideradas
- `localStorage`, que mantém os dados mesmo após fechar o navegador.
- Não persistir o token, o que impediria manter a sessão ativa em outras etapas do sistema.

## Consequências
Pontos positivos:
- Os dados ficam disponíveis apenas durante a sessão do navegador.
- Reduz o risco de manter informações sensíveis em persistência longa.
- É adequado para autenticação temporária em um ambiente como o do desafio.

Pontos negativos:
- O login é perdido quando a aba ou o navegador for fechado.
- Em alguns cenários, é necessário um comportamento de “manter conectado”.

## Explicação para iniciantes
`sessionStorage` é como guardar um crachá na gaveta da sua sessão de trabalho: ele fica disponível durante a sua atividade atual, mas não continua no armário depois que você fecha o expediente. Já o `localStorage` seria como deixar o crachá em um armário permanente.
