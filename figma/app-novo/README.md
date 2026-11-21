# Conkat — App, novo design

Todas as telas do app (as 34 de [`../app-atual`](../app-atual)) redesenhadas no padrão das telas do
site ([`../conkat-telas-app`](../conkat-telas-app)), mais um quadro com todos os padrões anotados.

## Como rodar (Scripter)

1. Abra o arquivo **Conkat - Telas** no Figma (com a fonte **Unageo** instalada).
2. Rode o plugin **Scripter**, apague o exemplo, cole o conteúdo inteiro de [`code.js`](code.js) e
   clique em **▶ Run**. Leva alguns segundos: são mais de 2 mil camadas.

O script cria a página **App — novo design**:

- **Padrões do app**: princípios, cores, tipografia, espaçamento, raios, sombras, grade da tela,
  componentes e padrões montados, e os ícones.
- **Componentes**: barra de status, barras de abas (visitante e profissional, uma por aba ativa),
  card de anúncio, botões, campo, ícones de categoria e o fundo com padrão.
- **Visitante, Cadastro, Profissional e Novo anúncio**: cada tela com o código do print que ela
  substitui (V01…A07) e uma nota "O que muda". Telas que rolam aparecem com a altura total.

Também cria ou atualiza, no arquivo inteiro: as variáveis `cor/*`, `espaço/*` e `raio/*` (coleção
Conkat) e os estilos de texto `App/*`. Rodar de novo refaz só a página.

## Os padrões, em resumo

| | Antes (app) | Agora (modelo do site) |
| --- | --- | --- |
| Títulos | Fonte do sistema, 700 | Unageo SemiBold, −2% (App/Display 26, App/Título 22, App/Número 28) |
| Texto | Fonte do sistema 16/14/12 | Inter: Corpo 15/22, Legenda 13/18, Rótulo 13 Medium, Pequeno 12 |
| Texto de apoio | `#6B7280` | `#5F6672` (cor/textMuted) |
| Títulos e seleção | `#1A1A1A` | `#0B2B2A` (cor/ink): títulos, filtro selecionado, blocos escuros, toast |
| Laranja | Botões e borda de card em destaque | Só destaque: selo Destaque, estrela, prazo, CTA sobre fundo escuro |
| Ação principal | Laranja ou verde | Sempre primary `#0B7A75`, em pílula de 52 |
| Raios | 8, 12, 16, 24 | 12, 16, 20, 24 e pílula |
| Card de anúncio | Título em cima, foto grande, borda laranja no destaque | Compacto: foto 84 à esquerda, selo sobre a foto, preço em primary |
| Busca e chips | Retangulares | Pílula; chip selecionado em ink com check |
| Configurações e dados | Linhas soltas | Grupos de lista brancos, raio 20, com nome do grupo |
| Código de e-mail | Um campo | Seis caixas |
| Sombra | Em vários elementos | Só no que flutua (tab bar, folha, toast) |

Espaçamento em base 4 (4, 8, 12, 16, 20, 24, 32, 40), margem lateral 16, 16 entre blocos e 12 entre
cards. O fundo das telas continua com o padrão de ícones a 35%.

## Para mudar o desenho

Edite [`code.template.js`](code.template.js) e gere o `code.js` de novo, a partir da raiz do projeto
(precisa do `conkat.app` ao lado, de onde vêm os ícones Phosphor):

```
node figma/app-novo/build.mjs
```

### Ver o resultado sem abrir o Figma

[`preview/`](preview) roda o `code.js` no Edge com uma imitação da API do Figma que desenha em
HTML (o auto layout vira flexbox) e salva um PNG de cada tela, do quadro de padrões e dos
componentes. Serve para conferir mudanças antes de colar no Scripter:

```
cd figma/app-novo/preview
node render.mjs ../code.js <pasta-de-saída>            # todas as telas
node render.mjs ../code.js <pasta-de-saída> "^P0"      # só as que batem com o filtro
node sheet.mjs <pasta-de-saída> folha.png "^V0" 300    # junta várias telas numa folha
```

É uma aproximação: confere estrutura, tamanhos, quebras e sobreposições, mas o Figma é a
referência final.

Nomes, preços e números nas telas são os dados de exemplo do app.
