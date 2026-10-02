# Título
Substituição da página inicial provisória pela listagem de alunos

## Data
2026-10-01

## Status
Aceito

## Contexto
A página inicial criada após o login era propositalmente temporária e servia apenas para validar o fluxo de autenticação. Com a funcionalidade principal pronta, a aplicação precisava usar esse espaço para a listagem real de alunos.

## Decisão
O componente `src/app/pages/pagina-inicial` deixou de ser uma tela provisória de confirmação de login e passou a implementar a listagem de alunos com integração ao backend, filtros, paginação, ordenação, estados de carregamento e variação por perfil. O ADR `0009` foi marcado como substituído.

## Alternativas consideradas
- Criar uma nova rota para a listagem e manter a página provisória.
- Remover a página provisória sem documentar a transição.

## Consequências
Pontos positivos:
- reaproveita a rota já usada após o login;
- substitui um placeholder por uma funcionalidade real;
- deixa registrada a evolução da aplicação.

Pontos negativos:
- aumenta bastante a responsabilidade do componente `pagina-inicial`;
- exige atualização de testes e documentação ligados à tela antiga.

## Explicação para iniciantes
É como trocar uma sala de recepção provisória por um escritório completo no mesmo endereço: o lugar continua o mesmo, mas agora entrega a função real do sistema.