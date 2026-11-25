# Painel de Controle de Notas

Aplicação web para registrar e acompanhar notas de atividades acadêmicas. O professor informa uma nota de 0 a 10, consulta a classificação e confirma se deseja adicioná-la ao histórico. O painel atualiza a quantidade de registros, a média aritmética e a maior nota.

## Acesse o sistema

[**Abrir o Painel de Notas no GitHub Pages**](https://geovanarlx.github.io/PAINEL-DE-CONTROLE-DE-NOTAS/)

## Tecnologias utilizadas

- **HTML5**: estrutura semântica da página, campos e áreas do painel.
- **CSS3**: identidade visual, layout responsivo e estados da interface.
- **JavaScript**: validação, classificação, confirmação, histórico e cálculos.
- **Web Storage (localStorage)**: mantém as notas no navegador e dispositivo utilizados; não há servidor ou banco de dados.
- **Google Fonts**: fontes DM Sans e Manrope, carregadas pela internet.

O projeto não usa frameworks ou dependências para instalar.

## Como executar localmente

1. Baixe ou clone este repositório.
2. Abra a pasta no Visual Studio Code.
3. Abra o arquivo `index.html` diretamente no navegador. Se preferir, use a extensão Live Server.

## Regras de classificação

| Nota | Classificação |
| --- | --- |
| 9,0 a 10,0 | Excelente |
| 7,0 a menor que 9,0 | Aprovado |
| 5,0 a menor que 7,0 | Recuperação |
| 0 a menor que 5,0 | Reprovado |

A entrada aceita ponto ou vírgula como separador decimal. Valores vazios, não numéricos ou fora do intervalo de 0 a 10 são rejeitados. O registro só é salvo quando o usuário confirma a classificação.

## Teste de fronteira da classificação

Foi executado um teste automatizado da regra de classificação em JavaScript, cobrindo os extremos da escala e valores imediatamente abaixo, no limite e acima dos cortes de 5, 7 e 9 pontos.

| Nota testada | Resultado esperado |
| ---: | --- |
| 0,00 | Reprovado |
| 4,99 | Reprovado |
| 5,00 | Recuperação |
| 5,01 | Recuperação |
| 6,99 | Recuperação |
| 7,00 | Aprovado |
| 7,01 | Aprovado |
| 8,99 | Aprovado |
| 9,00 | Excelente |
| 9,01 | Excelente |
| 10,00 | Excelente |

**Resultado:** 11 de 11 casos aprovados, sem divergências entre o resultado obtido e o esperado. A verificação foi da função de classificação; não automatizou a interação com o navegador, as caixas de confirmação ou o armazenamento local.

## Outros cenários para conferir no navegador

- Tentar enviar o campo vazio, texto, `-1` e `11`: a interface deve rejeitar cada entrada.
- Registrar três notas e confirmar: a lista e a quantidade devem ser atualizadas e a média deve corresponder à soma dividida por três.
- Cancelar a caixa de confirmação: a nota não deve entrar no histórico.
- Recarregar a página: os registros devem continuar disponíveis no mesmo navegador.

Exemplo de cálculo: as notas 4, 7 e 9 resultam em quantidade 3 e média aproximada de 6,67.
