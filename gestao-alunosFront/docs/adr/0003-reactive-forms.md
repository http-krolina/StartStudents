# Título
Reactive Forms e validação com regex

## Data
2026-09-30

## Status
Aceito

## Contexto
A tela de login precisa validar usuário e senha com regras específicas da aplicação, como tamanho mínimo, letras e números e exigência de preenchimento. Para isso, a solução mais segura e organizada é usar formulários reativos.

## Decisão
O formulário foi criado com `FormBuilder` e `ReactiveFormsModule`, usando validações por regex nos campos de usuário e senha. As regras RN-002 e RN-003 ficaram no próprio formulário.

Arquivo principal:
- `src/app/pages/login/login.ts`

Trechos relevantes:
```ts
readonly loginForm = this.fb.nonNullable.group({
  usuario: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{8,}$/)]],
  senha: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,20}$/)]],
});
```

## Alternativas consideradas
- Validação apenas por HTML5, que não cobre com precisão todas as regras do desafio.
- Validação manual com lógica de `if` espalhada pelo componente, o que seria mais difícil de manter.

## Consequências
Pontos positivos:
- Regras centralizadas no formulário.
- Mensagens de erro facilmente conectadas com os campos.
- Facilidade de aplicar validação e habilitar/desabilitar o botão.

Pontos negativos:
- Requer aprender a API de formulários reativos.
- A sintaxe pode parecer um pouco mais verbosa no começo.

## Explicação para iniciantes
É como usar um checklist que acompanha cada campo do formulário. Em vez de lembrar tudo manualmente, o sistema verifica automaticamente se o valor está de acordo com as regras antes de deixar seguir.
