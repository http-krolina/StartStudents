# Título
Botão desabilitado e estado de envio

## Data
2026-09-30

## Status
Aceito

## Contexto
O botão de login deve impedir que o usuário clique várias vezes e também deve ficar desabilitado quando o formulário estiver inválido. Isso protege tanto o backend quanto a experiência do usuário.

## Decisão
Foi adicionado um estado `isSubmitting` e o botão foi ligado ao estado do formulário. Enquanto o formulário estiver inválido ou a requisição estiver em andamento, o botão fica desabilitado.

Arquivo principal:
- `src/app/pages/login/login.ts`
- `src/app/pages/login/login.html`

Trechos relevantes:
```ts
isSubmitting = false;
```

```html
<button
  type="submit"
  [disabled]="loginForm.invalid || isSubmitting"
  [attr.aria-busy]="isSubmitting"
>
  {{ isSubmitting ? 'ENTRANDO...' : 'ACESSAR' }}
</button>
```

## Alternativas consideradas
- Permitir clique múltiplo e lidar com duplicidade no backend.
- Usar apenas CSS para esconder o problema, sem bloquear a ação.

## Consequências
Pontos positivos:
- Evita envios duplicados.
- Melhor feedback visual para o usuário.
- Maior segurança para a integração com o backend.

Pontos negativos:
- O usuário precisa esperar a resposta para tentar novamente.
- A lógica de estado precisa ser bem gerenciada para não causar confusão.

## Explicação para iniciantes
É como uma loja que bloqueia o botão de pagar enquanto o caixa está processando o pagamento. Isso evita que a mesma compra seja enviada duas vezes por engano.
