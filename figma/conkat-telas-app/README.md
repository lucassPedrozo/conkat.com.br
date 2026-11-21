# Conkat — Telas do app (script do Figma)

Monta no arquivo [Conkat - Telas](https://www.figma.com/design/I0tV1aM9Uonm3MqTqqv7b5/Conkat---Telas)
as telas do app que aparecem no site, cada uma separada e editável, no tamanho 375 × 812:

| Quadro | O que é |
| --- | --- |
| 01 — Início | Logo, cidade, "Qual serviço você procura?", publicados recentemente e barra de abas |
| 02 — Onde você procura? | A folha de cidades aberta sobre a Início |
| 03 — Busca | Termo buscado, filtros e resultados |
| 04 — Anúncio | Galeria, selos, preço, profissional verificado e botão do WhatsApp |
| 05 — Anúncio anotado (site) | O anúncio com marcadores 1, 2 e 3 da seção "Antes de chamar" |

Tudo fica numa página nova, **Telas do site**. Rodar de novo apaga e recria só essa página.

## Como rodar (Scripter)

1. Abra o arquivo no Figma pelo computador (app ou navegador).
2. Menu **Plugins › Find more plugins**, procure **Scripter** e abra.
3. Apague o exemplo, cole o conteúdo inteiro de [`code.js`](code.js) e clique em **▶ Run**.
4. Em alguns segundos aparece "Conkat: 5 telas montadas" no rodapé do Figma.

Também dá para rodar como plugin de desenvolvimento no app desktop:
**Plugins › Development › Import plugin from manifest…** e escolha `manifest.json`.

## Fonte

Os títulos usam a **Unageo**, como no site. Instale-a antes de rodar (os arquivos estão em
`public/fonts`, ou baixe em <https://github.com/RichardSepsi/Unageo>). No navegador, o Figma só
enxerga fontes locais com o [instalador de fontes do Figma](https://www.figma.com/downloads/).
Sem ela, os títulos ficam em Inter e o script avisa.

## O que o script cria

- **Cores:** coleção de variáveis **Conkat** com `cor/*` (as mesmas do site e do app). As telas usam
  as variáveis, então trocar uma cor ali muda todas as telas.
- **Componentes** (seção à esquerda): Barra de status, Card de anúncio (com propriedades de texto
  Título, Categoria, Preço e Nota, e a foto trocável), Barra de abas, Marcador e Padrão de fundo.
- **Fotos, ícones, logo e padrão** vêm do site e ficam embutidos no `code.js`.

## Para mudar o desenho

Edite [`code.template.js`](code.template.js) e gere de novo o `code.js` a partir da raiz do projeto:

```
node figma/conkat-telas-app/build.mjs
```

Nomes, preços e notas dentro das telas são exemplos, os mesmos do site.
