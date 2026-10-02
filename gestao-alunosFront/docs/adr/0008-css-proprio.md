# Título
CSS próprio em vez de biblioteca de componentes

## Data
2026-09-30

## Status
Aceito

## Contexto
O projeto exige um layout visual específico com cores, bordas, espaçamento e proporções muito definidos. Além disso, a instrução foi evitar bibliotecas extras de UI como Angular Material.

## Decisão
Foi implementado o estilo da tela diretamente em CSS próprio, com regras responsivas e foco visual em `src/app/pages/login/login.css`. O visual foi desenhado para atender ao design pedido, sem depender de bibliotecas externas.

Arquivos principais:
- `src/app/pages/login/login.css`
- `src/app/pages/login/login.html`

Trechos relevantes:
```css
.login-card {
  width: min(100%, 588px);
  background: #ffffff;
  border-radius: 30px;
  padding: 80px 44px 44px;
}
```

```css
input:focus-visible,
.login-button:focus-visible {
  outline: 2px solid #045aaa;
  outline-offset: 2px;
}
```

## Alternativas consideradas
- Usar Angular Material ou outra biblioteca de componentes.
- Usar CSS inline em cada elemento, sem padronização.

## Consequências
Pontos positivos:
- Total controle sobre o estilo desejado.
- Menor peso de dependências externas.
- Melhor adequação ao layout do desafio.

Pontos negativos:
- Exige mais trabalho manual de design e responsividade.
- Há mais responsabilidade para manter o visual consistente.

## Explicação para iniciantes
É como cozinhar um prato do zero com os ingredientes certos, em vez de comprar um prato pronto. Você tem mais controle, mas também precisa fazer o preparo com atenção.
