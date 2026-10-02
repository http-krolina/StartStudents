# Título
Mensagem de erro genérica

## Data
2026-09-30

## Status
Aceito

## Contexto
O cenário de login inválido deve informar ao usuário que as credenciais estão incorretas sem revelar detalhes internos da aplicação. O desafio também pede que não seja apontado um campo específico como “errado”.

## Decisão
Foi adotada a mensagem genérica `Usuário ou senha inválidos`, exibida acima do botão, para qualquer situação de falha de autenticação ou erro HTTP de autenticação. A mensagem é exibida com `role="alert"` para acessibilidade.

Arquivo principal:
- `src/app/pages/login/login.html`
- `src/app/pages/login/login.ts`

Trechos relevantes:
```ts
if (error?.status === 0) {
  this.generalError = 'Não foi possível conectar ao servidor. Tente novamente.';
  return;
}

this.generalError = 'Usuário ou senha inválidos';
```

```html
<div *ngIf="generalError" class="form-error" role="alert">
  {{ generalError }}
</div>
```

## Alternativas consideradas
- Mostrar erro específico por campo, o que revelaria detalhes de validação e dificultaria a política de segurança.
- Mostrar mensagens técnicas do backend, como stack traces ou texto bruto da API.

## Consequências
Pontos positivos:
- Protege a experiência do usuário e a segurança da aplicação.
- Simplifica a mensagem e reduz a possibilidade de interpretações erradas.
- Mantém os dados digitados e evita interromper o fluxo sem necessidade.

Pontos negativos:
- O usuário recebe menos contexto sobre qual dado está errado.
- Em alguns casos, uma mensagem mais específica pode ser útil para diagnóstico técnico.

## Explicação para iniciantes
É como um portão de segurança: em vez de dizer “o seu cartão tem defeito”, ele informa apenas que o acesso foi negado. Isso mantém o processo mais simples e evita dar pistas desnecessárias.
