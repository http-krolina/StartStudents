# Título
Chave do JWT em arquivo .env fora do Git

## Status
Aceito

## Contexto
O token JWT é assinado com uma chave secreta. Se essa chave estiver no código e for publicada no GitHub, qualquer pessoa poderia gerar tokens válidos.

## Decisão
- A chave é lida de uma variável de ambiente, carregada de um arquivo `.env` na pasta do back:

```properties
spring.config.import=optional:file:.env[.properties]
jwt.secret=${JWT_SECRET}
```

- O `.env` está no `.gitignore`.
- O repositório traz um `.env.example` com o formato esperado, para quem clonar copiar e preencher.
- A chave precisa ter no mínimo 32 caracteres (exigência do HMAC-SHA256 da `jjwt`).

## Alternativas consideradas
- Chave fixa no `application.properties`: simples, mas expõe o segredo no repositório.
- Variável de ambiente do sistema operacional: segura, mas mais trabalhosa de configurar para quem avalia.

## Consequências
Pontos positivos:
- O segredo não vai para o GitHub.
- Cada máquina/ambiente pode ter sua própria chave.

Pontos negativos:
- Quem clonar precisa criar o `.env` antes de rodar; sem ele a aplicação não sobe.

## Explicação para iniciantes
O `.env.example` é o modelo de formulário em branco que fica no mural; o `.env` é o formulário preenchido com a senha do cofre, que cada um guarda na própria gaveta.
