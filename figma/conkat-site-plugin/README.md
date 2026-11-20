# Conkat — Site v2 (script do Figma)

Monta as versões **desktop** e **mobile** do site no arquivo
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

## O que o script faz (v3)

Refaz do zero as versões desktop e mobile, com texto e visual revisados:

- **Seções:** hero, como funciona (3 passos), o que você vê antes de chamar (carrossel
  com 5 cards), para profissionais, dúvidas, download e rodapé.
- **Texto:** só informação que o app realmente oferece, sem frases de efeito, sem
  etiquetas acima dos títulos e sem setas nos botões. Todo o texto fica no objeto
  `COPY`, no começo do `code.js`, para facilitar a revisão.
- **Visual:** hero claro com o padrão de ícones do app; bordas em vez de sombras
  (sombra só nos celulares); numeração apenas nos passos.
- **Componente novo:** `Prévia/Revisão`, criado na seção "Componentes" se ainda não existir.

## Ainda provisório

- Nomes, preços, notas e números dentro das telas são exemplos.
- CNPJ e links do rodapé (Termos de uso e Política de privacidade).
- Confirmar com o negócio: "O Conkat cobra alguma taxa do serviço? Não."
- Selos das lojas: trocar pelas artes oficiais da Apple e do Google antes de publicar.
- Fotos geradas por IA no Figma: substituir por fotos reais quando houver.
