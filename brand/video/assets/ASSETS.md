# Assets do Conkat para o vídeo

Origem: repositório `lucassPedrozo/conkat.com.br` (branch padrão, clonado em 24/11/2026). 104 arquivos, 18 MB.

| Pasta | Conteúdo | Uso no vídeo |
|---|---|---|
| `logo/` | Logo 2B em SVG (`conkat-logo.svg` padrão, `-branco`, `-ink`, `-negativo`), PNGs com fundo claro/escuro, símbolo C_ (`conkat-simbolo*.svg`) e ícone do app 1024 px | Abertura, encerramento, marca d'água. Usar `-branco` sobre `ink`, `conkat-logo.svg` sobre claro. Está em contornos, não precisa da fonte Ahellya |
| `fonts/` | Unageo Medium (500), SemiBold (600), Bold (700) em `.woff2` e licença OFL | Títulos e números. Inter vem do pacote `@fontsource-variable/inter` (instalar no Remotion) |
| `icons/` | `favicon.svg/.ico`, `apple-touch-icon`, `icon-192/512`, `og.png`, **`pattern.svg`** (padrão de ícones de serviços do fundo do app) | Fundo das cenas e fechamento |
| `telas-app/` | **Telas do app no design 3.0, já dentro de moldura de iPhone:** `home`, `cidade`, `busca`, `anuncio`, `pro`, mais `card-home-0..2` e `card-busca-0..2` | Cenas de produto. Os cards avulsos servem para animar entrada em cascata |
| `fotos/` | 5 fotos de alta resolução: `eletricista`, `encanador`, `cozinha` (diarista), `pintura`, `marina` (retrato) | Fotos dos anúncios e cenas de categoria |
| `instagram/` | Posts (1080×1350), stories (1080×1920), perfil e capas de destaque já prontos | **Só como referência de linguagem visual da marca.** Não reaproveitar como cena sem rever |
| `telas-app-prints/` | 34 prints do app (V01–V19, P01–P08, A01–A07) | **Atenção: são do design ANTERIOR ao 3.0** (nota do cofre). Usar só para consultar fluxos, nunca no vídeo |
| `referencia-codigo/` | `content.ts` (textos do site), `icons.ts` (ícones Phosphor em SVG), `global.css` (tokens), `AUDITORIA-COPY.md` (cada frase conferida contra o app) | Fonte da verdade para copy e ícones |
| `README-marca-original.md` | README de marca do repositório | Regras de uso da logo |

## Pontos de atenção

- **Dados das telas:** preços, notas (4,8 / 4,9 / 4,7) e títulos nas telas e cards são os dados de demonstração do site, não anúncios reais. No vídeo, tratar como exemplo e não apresentar como avaliações reais de pessoas.
- **Tokens extras do site** (além dos do app): `brand` `#0F928C` e `brand-on-dark` `#5FD3CC` (verde de marca para fundo escuro), `accent-soft` `#FFF3E0`.
- **Fonte Ahellya** (o "Con" da logo): não veio e não é necessária, a logo está em contornos. A licença ainda não foi confirmada por escrito.
- **Não veio:** trilha sonora, efeitos sonoros, telas em movimento (o repo só tem imagens estáticas) e o vídeo de referência.
