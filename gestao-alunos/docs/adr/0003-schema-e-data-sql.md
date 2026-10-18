# Título
Criação das tabelas e carga inicial com schema.sql e data.sql

## Status
Aceito

## Contexto
O sistema precisa iniciar com as tabelas criadas, dois usuários de teste (Administrador e Leitor) e 25 alunos, em qualquer máquina, sem passos manuais. Também era preciso decidir quem cria as tabelas: o Hibernate ou scripts SQL.

## Decisão
- As tabelas são criadas pelo `src/main/resources/schema.sql`, com `CREATE TABLE IF NOT EXISTS` e `CHECK` para os valores dos enums (`perfil`, `status`).
- Os dados de teste ficam no `src/main/resources/data.sql`, com `MERGE INTO ... KEY(...)` (insere se não existir, atualiza se existir — não duplica a cada reinício).
- O Hibernate apenas **confere** se as entidades batem com as tabelas:

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.sql.init.mode=always
```

- As senhas no `data.sql` já estão em hash BCrypt (ver ADR 0005).

## Alternativas consideradas
- `ddl-auto=update`: o Hibernate criaria as tabelas sozinho, mas sem controle sobre restrições e nomes.
- Flyway: versionamento de banco profissional, mas considerado excesso para o protótipo nesta fase.
- Classe `DataInitializer`/`CommandLineRunner` em Java: funcionaria, mas mistura carga de dados com código da aplicação.

## Consequências
Pontos positivos:
- Quem clona o projeto já tem banco e dados prontos ao subir a aplicação.
- O `validate` acusa na inicialização qualquer diferença entre entidade e tabela.
- A estrutura do banco fica legível em SQL puro.

Pontos negativos:
- Alterações de estrutura precisam ser feitas à mão no `schema.sql` (sem histórico de versões como no Flyway).
- Os alunos e usuários de teste voltam aos valores originais a cada reinício; alunos cadastrados pela tela são mantidos.

## Explicação para iniciantes
O `schema.sql` é a planta da casa, o `data.sql` são os móveis que já vêm montados, e o `validate` é o fiscal que confere se a casa construída bate com a planta antes de liberar a entrada.
