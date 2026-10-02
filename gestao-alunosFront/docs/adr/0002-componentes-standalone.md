# Título
Componentes standalone

## Data
2026-09-30

## Status
Aceito

## Contexto
O Angular moderno favorece a criação de componentes independentes, sem depender de módulos extras para serem usados. Isso simplifica a estrutura do projeto, especialmente em uma tela de login isolada.

## Decisão
Foi implementado o componente `LoginComponent` como standalone. Ele importa diretamente os módulos necessários, como `ReactiveFormsModule` e `CommonModule`, sem a necessidade de declarar um módulo específico.

Arquivo principal:
- `src/app/pages/login/login.ts`

Trecho relevante:
```ts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
```

## Alternativas consideradas
- Criar um módulo dedicado para a página de login.
- Usar componentes tradicionais com mais configuração e menos flexibilidade.

## Consequências
Pontos positivos:
- Menos boilerplate.
- Componentes menores e mais fáceis de compartilhar.
- Estrutura mais direta para projetos modernos.

Pontos negativos:
- Quem vem do Angular mais antigo precisa aprender a nova convenção.
- O projeto precisa manter a importação explícita dos módulos necessários.

## Explicação para iniciantes
É como montar uma peça de mobiliário com as ferramentas certas já na caixa. Em vez de guardar tudo em um armário grande, o componente traz o que precisa para funcionar de forma autônoma.
