# Título
Detecção de mudança comparando com os valores originais (RN-034 a RN-036)


## Status
Aceito

## Contexto
O botão "Salvar alterações" deve começar desabilitado (RN-034), habilitar só com ao menos uma mudança e todos os campos válidos (RN-035), e voltar a desabilitar se o usuário restaurar os valores originais (RN-036). O estado `dirty` do Angular não serve: ele continua verdadeiro mesmo depois de digitar o valor antigo de volta.

## Decisão
Ao carregar o aluno, guardamos os valores originais normalizados: nome com `trim`, e-mail em minúsculas, telefone só com dígitos e status. A cada verificação, normalizamos os valores atuais do mesmo modo e comparamos campo a campo. `podeSalvar()` exige formulário válido, ausência de erros do servidor pendentes, ao menos uma diferença e que não haja envio em andamento. A mesma comparação alimenta a confirmação de saída (RN-039).

## Alternativas consideradas
- Usar `form.dirty`.
- Comparar os valores crus, sem normalização.

## Consequências
Pontos positivos:
- restaurar o valor original desabilita o botão de novo;
- espaços extras ou diferença de maiúsculas no e-mail não contam como mudança.

Pontos negativos:
- a comparação roda a cada ciclo de detecção, o que é barato para 4 campos.

## Explicação para iniciantes
Em vez de perguntar "o usuário mexeu em algo?", perguntamos "o que está na tela é diferente do que veio do servidor?". Se você apagar e digitar o mesmo nome de volta, nada mudou de verdade, e o botão fica desligado.
