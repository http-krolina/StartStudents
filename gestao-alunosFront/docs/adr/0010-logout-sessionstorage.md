# Título
Logout no front limpando o sessionStorage

## Data
2026-09-30

## Status
Aceito

## Contexto
Depois do login bem-sucedido, o token e o perfil ficam armazenados no sessionStorage. Para simular a saída do usuário, era necessário limpar esses dados e enviar o usuário de volta para a tela de login. Isso também ajuda a manter a sessão controlada no frontend.

## Decisão
Foi implementado o método `sair()` no componente `PaginaInicialComponent`, que remove as chaves `token` e `perfil` do sessionStorage e navega para `/login` usando o Router.

Arquivo principal:
- `src/app/pages/pagina-inicial/pagina-inicial.ts`

Trecho relevante:
```ts
sair(): void {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('perfil');
  this.router.navigate(['/login']);
}
```

## Alternativas consideradas
- Só redirecionar para a tela de login sem limpar o storage.
- Guardar dados em outro local que não refletisse o comportamento real do login.

## Consequências
Pontos positivos:
- sai da sessão corretamente;
- mantém o estado consistente;
- permite testar a ausência de token na próxima abertura da página.

Pontos negativos:
- a sessão atual é encerrada imediatamente;
- a área protegida precisa ser acessada novamente após login.

## Explicação para iniciantes
É como tirar a credencial do bolso quando você sai da empresa. Se a credencial continuar lá, o sistema pode achar que você ainda está dentro do ambiente.
