# Conkat — Site v5 (script do Figma)

Monta as versões **desktop** e **mobile** do site no arquivo
[Conkat — Site (esboço)](https://www.figma.com/design/Dq3vg5N0d8Ob2knQvZ3LCJ).

O script usa o que já está no arquivo: as cores (`cor/*`), os estilos de texto, os
componentes da seção "Componentes" e as fotos da seção "Assets". Ele pode ser rodado
mais de uma vez: apaga e recria só as partes que ele mesmo cria.

## Opção 1 — Scripter (no navegador, mais simples)

1. Abra o arquivo no Figma pelo computador.
2. Menu **Plugins › Find more plugins**, procure **Scripter** e abra.
3. Apague o exemplo que aparece, cole o conteúdo inteiro de [`code.js`](code.js) e clique em **▶ Run**.
4. Em alguns segundos aparece "Conkat: site v5 montado com a logo 2B" no rodapé do Figma.

## Opção 2 — Plugin de desenvolvimento (Figma desktop)

1. Baixe esta pasta (`figma/conkat-site-plugin`).
2. No app desktop do Figma: **Plugins › Development › Import plugin from manifest…** e escolha `manifest.json`.
3. Rode em **Plugins › Development › Conkat — Site v2**.

## O que o script faz (v4)

Refaz do zero as versões desktop e mobile com o texto validado contra o app, a API e o
Obsidian. O relatório completo está em [`../AUDITORIA-COPY.md`](../AUDITORIA-COPY.md).

- **`APP_LIVE`** (primeira linha de configuração do `code.js`): enquanto for `false`, o site
  mostra "Em breve na App Store e no Google Play" no lugar dos selos e de "Baixar o app".
  Troque para `true` quando o app estiver publicado e rode de novo.
- **Texto:** todo o conteúdo fica no objeto `COPY`, no começo do arquivo.
- **Componentes:** o script também corrige categorias e rótulos dentro dos componentes de
  prévia, para ficarem iguais aos do app.

## Logo e tipografia (v5)

- A logo é a variação **2B** do arquivo de marca (Con em Ahellya itálica + kat_ em Unageo Bold, cursor
  laranja), aplicada como vetor no menu, no rodapé e no topo das telas do app.
- Os títulos passam a usar a **Unageo** (SemiBold), a mesma fonte do "kat_". O texto corrido continua em Inter.
- **Instale a Unageo antes de rodar.** Sem ela, o script mantém os títulos em Schibsted Grotesk e avisa.
  Baixe em <https://github.com/RichardSepsi/Unageo> ou no dafont, instale os arquivos `.ttf` no computador
  e reabra o Figma. No navegador, o Figma só enxerga fontes locais com o
  [instalador de fontes do Figma](https://www.figma.com/downloads/).

## Ainda provisório

- Nomes, preços, notas e números dentro das telas são exemplos.
- CNPJ e links do rodapé (Termos de uso e Política de privacidade).
- Termos de uso e Política de privacidade ainda não existem (o app tem `termsUrl: null`).
- Selos das lojas: trocar pelas artes oficiais da Apple e do Google antes de publicar.
- Fotos geradas por IA no Figma: substituir por fotos reais quando houver.
