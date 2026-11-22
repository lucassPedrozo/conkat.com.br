# Conkat — Identidade de marca

Arquivo de marca no Figma: <https://www.figma.com/design/TQKqfbLfbO5jYmMCGuOqtu>

## Montar o arquivo de marca

1. Abra o arquivo de marca no Figma pelo computador.
2. Rode o plugin **Scripter**, crie um script novo, apague o conteúdo e cole o
   [`figma-brand-plugin/code.js`](figma-brand-plugin/code.js) inteiro (use **Copy raw file** no GitHub).
3. Clique em **Run**. O script cria sete páginas:
   - **Logo:** a logo padrão (2B), versões, símbolo C_, área de proteção, tamanho mínimo e o que não fazer;
   - **Favicon e app:** favicon e ícones do app nos tamanhos reais;
   - **Instagram:** foto de perfil, 7 modelos de post (1080 × 1350), 3 de story (1080 × 1920) e 5 capas de
     destaque, todos editáveis (troque texto e foto);
   - **Cores:** variáveis da coleção "Conkat / Cores" e amostras com o uso de cada cor;
   - **Tipografia:** Unageo e Ahellya (logo, em contornos) e Schibsted Grotesk + Inter (interface);
   - **Padrão e ícones:** o padrão de ícones do app e os ícones Phosphor;
   - **Logo — exploração:** as 12 variações, com a 2B marcada como padrão.

Pode ser rodado mais de uma vez. As logos estão em contornos, então não é preciso instalar as fontes.

## Logo padrão: 2B

"Con" em Ahellya itálica + "kat" em Unageo Bold, com o cursor laranja. Letras ink `#0B2B2A` (brancas no
fundo escuro), cursor `#FDA333`. O **símbolo C_** (o C da logo + o cursor) é usado onde a logo não cabe:
foto de perfil, favicon e ícone do app.

## Arquivos prontos

Gerados por [`gerar-assets.mjs`](gerar-assets.mjs) (`npm ci` e depois `node brand/gerar-assets.mjs`):

| Pasta | Conteúdo |
|---|---|
| [`logo/`](logo/) | Logo positiva, negativa e de uma cor (SVG e PNG), símbolo C_ e ícone de app |
| [`../public/`](../public/) | `favicon.svg`, `favicon.ico` (16, 32, 48), `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` |
| [`instagram/perfil/`](instagram/perfil/) | Foto de perfil 1080 × 1080 (escura e clara) |
| [`instagram/posts/`](instagram/posts/) | 7 posts 1080 × 1350: apresentação, chamada, categoria com foto, carrossel (capa e página), para profissionais, dúvida |
| [`instagram/stories/`](instagram/stories/) | 3 stories 1080 × 1920: claro, escuro e com foto |
| [`instagram/destaques/`](instagram/destaques/) | 5 capas de destaque: Como funciona, Profissionais, Cidades, Dúvidas, Novidades |
| [`instagram/previa-perfil.png`](instagram/previa-perfil.png) | Como o perfil fica com tudo junto |

Regras do Instagram: no post, mantenha texto e logo a 96 px das bordas (o perfil corta em 3:4); no story,
deixe livres 250 px no topo e 340 px embaixo. Para novos posts, duplique um modelo na página Instagram do Figma.

## Calendário do Instagram

A pauta fica em [`instagram/calendario.mjs`](instagram/calendario.mjs): um post por dia, com slides, legenda e
hashtags. Para gerar as imagens dos próximos 15 dias:

```bash
npm ci
node brand/gerar-calendario.mjs --inicio 2026-11-23 --dias 15
```

Sem `--inicio`, começa amanhã. O resultado vai para [`instagram/calendario/`](instagram/calendario/): uma pasta
por dia com os slides (1080 × 1350), um story avisando do post e a legenda, mais a agenda (`README.md`) e uma
prévia de tudo. Os posts usam as telas reais do app, recortadas do site (ficam em `instagram/telas-app/`).
Modelos de slide: `capa`, `tela`, `foto`, `lista`, `duvida`, `numeros`, `peca` e `final`.

## Logo — exploração

Prévia: [`logo-exploracao/previa-variacoes.png`](logo-exploracao/previa-variacoes.png).
Cada variação também está em SVG na pasta [`logo-exploracao/`](logo-exploracao/).

| Ideia | Variação | Descrição |
|---|---|---|
| 1 — Conkat_ em Unageo | 1A | Unageo Bold, cursor acoplado à perna do t |
| | 1B | Unageo Bold, cursor em laranja |
| | 1C | Minúsculas, Unageo SemiBold, teal |
| | 1D | Unageo Black compacta, cursor abaixo da linha |
| | 1E | Unageo Regular, cursor longo |
| | 1F | Minúsculas, Unageo Bold, cursor laranja |
| 2 — Con em Ahellya + kat_ em Unageo | 2A | Con em Ahellya + kat em Unageo Medium |
| | 2B | Con em Ahellya itálica + kat em Unageo Bold, cursor laranja |
| | 2C | Minúsculas: con em Ahellya + kat em Unageo SemiBold |
| | 2D | Duas cores: Con teal + kat tinta, cursor laranja |
| | 2E | Con em Ahellya + kat em Unageo Light, cursor longo |
| | 2F | Con itálica teal + kat em Unageo SemiBold |

**O cursor acoplado:** a perna do "t" da Unageo termina num corte reto, apoiado na linha de base,
com a mesma espessura do `_`. Nas variações "acopladas", o traço do cursor continua a perna do "t"
sem emenda, como uma ligadura.

## Licenças das fontes

- **Unageo** (Richard Sepsi): SIL Open Font License 1.1, gravada no arquivo da fonte. Uso comercial em
  logo permitido.
- **Ahellya** (Dmitry Barsukov): o dafont classifica como "100% Free", mas o arquivo da fonte diz
  "Typeface © D.N.Barsukov. 2014. All Rights Reserved" e não traz licença. Se uma variação da ideia 2
  for escolhida, confirme a licença por escrito com o autor antes de registrar a marca.

As fontes não são versionadas neste repositório; as logos já estão em contornos.
