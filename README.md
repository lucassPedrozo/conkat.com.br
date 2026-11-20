# conkat.com.br

Site institucional do Conkat. Feito com [Astro](https://astro.build) (site estático), sem framework de
interface no cliente: as animações usam CSS e um script pequeno (`src/scripts/site.ts`).

## Rodar localmente

Precisa do **Node.js 22.23.4 ou mais novo** (exigência do Astro). Confira com `node -v`.

```bash
npm install
npm run dev
```

Abra <http://localhost:4321>. Para gerar a versão de produção: `npm run build` (sai em `dist/`).

## Onde mexer

| O quê | Onde |
|---|---|
| Todo o texto do site e `APP_LIVE` (lojas) | `src/lib/content.ts` |
| Cores, tipos, espaçamento e movimento | `src/styles/global.css` |
| Seções da página | `src/components/` |
| Telas do app dentro dos celulares | `src/components/app/` |
| Interações (cabeçalho, carrossel, passos) | `src/scripts/site.ts` |
| Fotos | `src/assets/photos/` (otimizadas no build) |

## Marca e design

- `brand/`: logo (variação 2B), exploração e script do arquivo de marca no Figma.
- `figma/`: script do esboço do site no Figma e a auditoria de conteúdo (`figma/AUDITORIA-COPY.md`).

## Fontes

- **Unageo** (títulos): SIL Open Font License 1.1 — `public/fonts/OFL-Unageo.txt`.
- **Inter** (texto): SIL Open Font License 1.1, via `@fontsource-variable/inter`.
- A logo está em contornos (inclui a Ahellya, cuja licença ainda precisa ser confirmada com o autor).
