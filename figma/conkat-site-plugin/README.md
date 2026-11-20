# Conkat — Site v2 (script do Figma)

Termina a versão **desktop** e cria a versão **mobile** do site no arquivo
[Conkat — Site (esboço)](https://www.figma.com/design/Dq3vg5N0d8Ob2knQvZ3LCJ).

O script usa o que já está no arquivo: as cores (`cor/*`), os estilos de texto, os
componentes da seção "Componentes" e as fotos da seção "Assets". Ele pode ser rodado
mais de uma vez: apaga e recria só as partes que ele mesmo cria.

## Opção 1 — Scripter (no navegador, mais simples)

1. Abra o arquivo no Figma pelo computador.
2. Menu **Plugins › Find more plugins**, procure **Scripter** e abra.
3. Apague o exemplo que aparece, cole o conteúdo inteiro de [`code.js`](code.js) e clique em **▶ Run**.
4. Em alguns segundos aparece "Conkat: site atualizado (desktop + mobile)" no rodapé do Figma.

## Opção 2 — Plugin de desenvolvimento (Figma desktop)

1. Baixe esta pasta (`figma/conkat-site-plugin`).
2. No app desktop do Figma: **Plugins › Development › Import plugin from manifest…** e escolha `manifest.json`.
3. Rode em **Plugins › Development › Conkat — Site v2**.

## O que o script faz

- **Desktop, correções:** título do hero em duas linhas, card flutuante reposicionado,
  visual do Passo 2, categorias numa linha.
- **Desktop, seções novas:** carrossel "Para quem procura", faixa de revisão de anúncios,
  "Para profissionais" (foto + métricas + oferta de 14 dias), dúvidas em duas colunas,
  chamada final com QR code e rodapé.
- **Mobile (390 px):** versão completa, com carrossel horizontal em "Como funciona" e
  "Para quem procura" e rolagem lateral nas categorias.

## Ainda provisório

- Nomes, preços, notas e números dentro das telas são exemplos.
- QR code, CNPJ e links do rodapé.
- Selos das lojas: trocar pelas artes oficiais da Apple e do Google antes de publicar.
- Fotos geradas por IA no Figma: substituir por fotos reais quando houver.
