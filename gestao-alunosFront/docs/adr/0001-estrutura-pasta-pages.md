# Título
Organização em páginas e serviços

## Data
2026-09-30

## Status
Aceito

## Contexto
O projeto Angular precisava separar claramente a camada visual da camada de regras de negócio e comunicação com a API. A aplicação teria mais de uma tela no futuro, então era importante manter uma estrutura fácil de localizar componentes, páginas e serviços.

## Decisão
Foi criada a organização em `src/app/pages` para telas e `src/app/services` para lógica e comunicação com a API. O componente da tela de login foi gerado em `src/app/pages/login/login.ts`, com o serviço em `src/app/services/auth.ts`.

Arquivos diretamente envolvidos:
- `src/app/pages/login/login.ts`
- `src/app/services/auth.ts`
- `src/app/app.routes.ts`

## Alternativas consideradas
- Manter tudo em um único componente e serviço, o que deixaria o código mais difícil de escalar.
- Criar uma estrutura genérica sem separar telas e serviços, o que reduziria a clareza para leitura e manutenção.

## Consequências
Pontos positivos:
- Organização mais clara para o crescimento do projeto.
- Mais fácil encontrar regras de negócio e telas específicas.
- Reuso de serviços entre diferentes componentes.

Pontos negativos:
- Exige seguir uma convenção que os desenvolvedores precisam conhecer.
- A estrutura inicial pode parecer mais detalhada para projetos pequenos.

## Explicação para iniciantes
Imagine uma casa: as páginas são os quartos, e os serviços são a cozinha e a lavanderia. Cada espaço tem uma função. Isso ajuda a encontrar o que você precisa sem misturar tudo em um único lugar.
