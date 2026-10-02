# Título
Visibilidade das ações da lista conforme o perfil do usuário

## Data
2026-10-01

## Status
Aceito

## Contexto
O sistema possui perfis `ADMINISTRADOR` e `LEITOR`. A tela precisa refletir essas permissões de forma simples na interface, sem mostrar ações que a pessoa não deve usar.

## Decisão
O frontend passou a ler o perfil salvo na sessão. Administrador vê `NOVO ALUNO`, `Ver detalhes`, `Editar` e `Excluir`. Leitor vê apenas `Ver detalhes`. Os elementos de edição e exclusão são ocultados, não apenas desabilitados.

## Alternativas consideradas
- Exibir todos os botões e só bloquear ao clicar.
- Manter apenas um layout único sem distinção visual por perfil.

## Consequências
Pontos positivos:
- reduz ruído visual;
- comunica melhor o que cada perfil pode fazer;
- evita falsas expectativas de ação.

Pontos negativos:
- a regra visual depende de manter o perfil salvo corretamente;
- o frontend sozinho não substitui a autorização da API.

## Explicação para iniciantes
É como preparar uma bancada de trabalho diferente para cada função: quem só consulta vê apenas as ferramentas de consulta, sem ferramentas de alteração espalhadas na mesa.