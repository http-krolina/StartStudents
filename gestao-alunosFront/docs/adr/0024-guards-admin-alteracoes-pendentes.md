# Título
Guard de perfil e guard de alterações pendentes

## Data
2026-10-02

## Status
Aceito

## Contexto
O cadastro de aluno é exclusivo do perfil `ADMINISTRADOR`. Além disso, sair da tela com campos alterados sem salvar pode fazer a pessoa perder dados digitados sem querer.

## Decisão
Foi criado o `admin.guard`, que permite acesso ao cadastro apenas para administradores, e o `alteracoes-pendentes.guard`, que usa `window.confirm` antes de sair da tela quando o formulário estiver alterado e ainda não salvo.

## Alternativas consideradas
- Proteger somente pelo backend.
- Permitir sair da tela sem nenhuma confirmação.

## Consequências
Pontos positivos:
- evita acesso indevido já no front;
- reduz perda acidental de dados;
- deixa a navegação mais previsível.

Pontos negativos:
- não substitui a autorização real da API;
- introduz uma confirmação extra em algumas saídas da tela.

## Explicação para iniciantes
É como um crachá para entrar na sala certa e, ao mesmo tempo, um aviso antes de jogar fora uma folha com anotações que ainda não foram salvas.