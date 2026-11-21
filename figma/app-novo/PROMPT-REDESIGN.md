# Prompt — Redesenho das interfaces do app Conkat

> Cole tudo o que está abaixo da linha num agente de código (por exemplo, o Claude Code) aberto
> na pasta do app **`conkat.app`**. O prompt é autossuficiente: traz todos os valores. A
> referência visual final são as telas da página **"App — novo design"** do arquivo do Figma
> **Conkat - Telas** (e o script que as gera, em `../conkat.com.br/figma/app-novo/code.template.js`).

---

## Papel e objetivo

Você vai redesenhar **todas as interfaces do app Conkat** (React Native, Expo, Expo Router,
TypeScript, Reanimated) para que fiquem **idênticas às telas da página "App — novo design"** do
Figma "Conkat - Telas", e vai dar ao app **movimento profissional**, consistente e acessível.

O redesenho é **visual e de movimento**. Não mude regras de negócio, rotas, contratos de API,
textos validados (a não ser onde este prompt manda), nem o que cada tela faz.

### Regras do projeto (do `AGENTS.md`, obrigatórias)

1. Leia o `AGENTS.md` antes de começar e siga-o. Ele vale mais que este prompt se houver conflito.
2. Preserve as funcionalidades existentes. Não reconstrua o projeto do zero: **evolua** os
   componentes de `components/ui/*`, `components/*` e os tokens de `src/theme/tokens.ts`.
3. Não invente endpoints nem dados. Os dados de exemplo (`EXPO_PUBLIC_USE_MOCK=true`) servem para conferir as telas.
4. Não adicione bibliotecas por preferência. Já existem: `react-native-reanimated`, `react-native-svg`,
   `expo-haptics`, `expo-font`, `@gorhom/bottom-sheet`, `phosphor-react-native`, `expo-image`.
5. Não use `any`, `ts-ignore` nem `eslint-disable`. Não formate arquivos fora do escopo. Não mexa em lockfile sem necessidade.
6. Mudanças pequenas e rastreáveis: um commit por fase (veja "Plano de execução").
7. Depois de cada fase rode: `npm run lint`, `npm run type-check`, `npm test`, `npx expo-doctor`.

### Fontes de verdade, nesta ordem

1. **Figma "Conkat - Telas", página "App — novo design"**: quadro "Padrões do app", seção
   "Componentes" e as 34 telas (V01…A07). Cada tela traz o código do print atual que ela substitui e
   uma nota "O que muda".
2. Este prompt (todos os valores estão aqui).
3. Página "App atual (prints)" do mesmo arquivo: como as telas são hoje (para saber o que cada uma faz).
4. Página "Telas do site": o modelo visual de origem.

---

## 1. Tokens (substituir em `src/theme/tokens.ts`)

Mantenha os nomes que o código já usa quando o significado for o mesmo, e acrescente os novos.
Atualize todos os usos: nenhuma cor, tamanho ou raio solto nas telas.

### 1.1 Cores

| Token | Hex | Uso |
| --- | --- | --- |
| `ink` | `#0B2B2A` | Títulos, filtro/chip selecionado, fundo de blocos escuros, toast |
| `inkSoft` | `#123B39` | Superfícies sobre fundo escuro (cartões da oferta) |
| `background` | `#F8F9FA` | Fundo das telas (com o padrão de ícones a 35%) |
| `surface` | `#FFFFFF` | Cards, campos, grupos de lista, folhas, barras |
| `text` | `#1A1A1A` | Texto principal |
| `textMuted` | `#5F6672` | Texto de apoio, legendas, ícones neutros (antes `#6B7280`) |
| `textOnDark` | `#FFFFFF` | Texto sobre `ink` e `primary` |
| `textOnDarkMuted` | `#A7C4C2` | Texto de apoio sobre `ink` |
| `primary` | `#0B7A75` | Ação principal, preço, aba ativa, links, verificado |
| `primaryStrong` | `#08615D` | Ação principal pressionada (substitui `primaryPressed`) |
| `primarySoft` | `#E6F4F3` | Fundo de ícone, avatar sem foto, aviso informativo (substitui `primarySubtle`) |
| `accent` | `#FDA333` | **Só destaque**: selo Destaque, estrela, marcadores, prazo, CTA sobre fundo escuro |
| `accentText` | `#A85A00` | Palavra destacada no título, texto sobre `accentSoft` |
| `accentSoft` | `#FFF3E0` | Fundo de "Em revisão" e "Novo no Conkat" (substitui `accentSubtle`) |
| `border` | `#E5E7EB` | Borda de cards, campos, divisórias |
| `borderStrong` | `#D6DADF` | Puxador da folha, trilho do progresso, borda do botão secundário |
| `success` | `#15803D` | Valores positivos, conta criada |
| `successSoft` | `#EEF8F1` | Fundo de aviso de sucesso |
| `danger` | `#B91C1C` | Ações destrutivas, erros |
| `dangerSoft` | `#FDEDED` | Fundo de erro |
| `neutralSoft` | `#F1F3F5` | Fundo de "Pausado", "Rascunho", controle segmentado, botão de fechar da folha |
| `scrim` | `rgba(11, 43, 42, 0.32)` | Fundo escurecido atrás das folhas (antes preto 50%) |

**Regra de cor:** laranja (`accent`) nunca é cor de botão comum nem borda de card. A ação
principal é sempre `primary`. A única exceção é o botão "Destaque" **sobre fundo `ink`**.

### 1.2 Tipografia

Títulos e números em **Unageo SemiBold** (a fonte do "kat_" da logo, licença SIL OFL 1.1). Todo o
resto em **Inter**. Hoje o app usa a fonte do sistema em 700; isso muda.

Fontes: baixe a Unageo (TTF ou OTF; https://github.com/RichardSepsi/Unageo) e a Inter (TTF estática,
pesos 400/500/600/700, https://rsms.me/inter ou Google Fonts) para `assets/fonts/`. Carregue com
`useFonts` do `expo-font` no `app/_layout.tsx`, segurando a splash até carregar (já existe
`expo-splash-screen`). Não adicione pacotes de fontes. No Android, `fontWeight` não troca de arquivo:
cada peso é uma `fontFamily` própria (`Inter-Regular`, `Inter-Medium`, `Inter-SemiBold`, `Inter-Bold`,
`Unageo-SemiBold`, `Unageo-Bold`).

| Token | Fonte | Tamanho / altura de linha | Espaçamento | Uso |
| --- | --- | --- | --- | --- |
| `display` | Unageo SemiBold | 26 / 31 | −2% (−0,52) | Pergunta da Início, títulos de etapa e de estados |
| `title` | Unageo SemiBold | 22 / 27 | −2% (−0,44) | Título das abas e das folhas |
| `number` | Unageo SemiBold | 28 / 32 | −2% (−0,56) | Saldo, métricas, valores da oferta |
| `heading` | Inter SemiBold | 17 / 22 | −1% (−0,17) | Título de seção e da barra superior |
| `cardTitle` | Inter SemiBold | 16 / 21 | 0 | Título do anúncio e de opções |
| `body` | Inter Regular | 15 / 22 | 0 | Texto corrido, valores de campo, linhas de lista |
| `bodyStrong` | Inter SemiBold | 15 / 22 | 0 | Preço, valores importantes |
| `button` | Inter SemiBold | 15 / 20 | 0 | Botões e links de ação |
| `label` | Inter Medium | 13 / 18 | 0 | Rótulo de campo, chips, nome de grupo |
| `caption` | Inter Regular | 13 / 18 | 0 | Categoria, bairro, ajuda de campo, datas |
| `small` | Inter Medium | 12 / 16 | 0 | Abas, selos e status (selos em SemiBold) |

Use `fontVariant: ['tabular-nums']` em preços, saldos, métricas e contadores.
Respeite o tamanho de fonte do sistema (`allowFontScaling`), com `maxFontSizeMultiplier` de 1,3 nos títulos `display`, `title` e `number`.

### 1.3 Espaçamento, raios, sombras e grade

- **Espaçamento** (base 4): `4` ícone+texto colados · `8` entre elementos de um grupo · `12` padding de
  card e entre cards · `16` margem da tela, padding de campo, entre blocos · `20` padding de bloco e
  de folha · `24` entre seções · `32` antes de grupos grandes · `40` respiro de estado vazio.
- **Raios**: `12` miniaturas e caixas de código · `16` campos, avisos, opções, tiles de categoria ·
  `20` cards e grupos de lista · `24` folhas, galeria, blocos grandes (escuros) · `28` bloco de busca
  da Início · `full` (pílula) botões, buscas, chips, selos, tab bar. Foto do card: `14`.
- **Sombras**: só no que flutua. O resto usa borda de 1 px `border`.
  - Flutuante (tab bar): `y 6, blur 16, spread −8, ink 18%` (Android: `elevation 6`).
  - Folha: `y −8, blur 32, ink 16%`.
  - Toast: `y 10, blur 24, spread −10, ink 35%`.
  - Elevado (card sobre foto): `y 24, blur 48, spread −20, ink 45%`.
- **Grade**: largura de referência 375. Margem lateral `16` (conteúdo de 343). Conteúdo começa logo
  abaixo da área segura. `16` entre blocos, `12` entre cards da lista.
- **Tab bar**: flutuante, altura 64, `16` das laterais e `24` acima da área segura inferior; o fim da
  rolagem das telas de aba deixa esse espaço (use o `TabBarContext` que já existe).
- **Rodapé de ação**: branco, borda de 1 px no topo, padding `12` em cima e `16` nas laterais, e embaixo
  `12` + área segura; botões de 52 de altura, empilhados com `8`.
- **Folha**: raio 24 no topo, padding `10 / 20 / 32`, puxador 40 × 5 (`borderStrong`, raio 3), título
  `title` à esquerda e botão de fechar redondo de 36 (`neutralSoft`, ícone X 18 `ink`) à direita.
- **Toque**: mínimo 44 × 44. Botões 52; linhas de lista 54; chips 34 (área de toque estendida com `hitSlop`).
- **Fundo das telas**: `background` + padrão de ícones de serviço em `accent` a **35% de opacidade**
  (o `ScreenBackground` já faz isso; mantenha, com ladrilho equivalente a 563 px numa tela de 375).

### 1.4 Ícones

Phosphor (`phosphor-react-native`, já instalado). **Regular** em 20–24 para interface; **fill** para aba
ativa, favorito marcado, estrela da nota, selo Verificado (SealCheck) e Destaque (RocketLaunch). Cores:
`textMuted` (neutro), `primary` (ação/seleção), `accent` (destaque), `ink` (barra superior).
Ícones de categoria: mantenha o mapa de `components/categoryIcons.ts`.

---

## 2. Componentes (evoluir os existentes em `components/ui/*` e `components/*`)

Todos com estados: padrão, pressionado, desabilitado (opacidade 40%), carregando quando fizer sentido,
foco visível no web e `accessibilityRole`, `accessibilityLabel` e `accessibilityState` corretos.

| Componente | Especificação |
| --- | --- |
| **Button** | Pílula, altura 52, padding `16 × 20`, texto `button`, ícone opcional 20 à esquerda com gap 8. Variantes: `primary` (fundo `primary`, texto branco; pressionado `primaryStrong`), `secondary` (fundo `surface`, borda 1 `borderStrong`, texto `ink`), `accent` (fundo `accent`, texto `ink` — **só sobre `ink`**), `text` (sem fundo, texto `primary`, padding `10 × 4`), `danger` (texto `danger`). `fullWidth` por padrão no rodapé. Carregando: indicador no lugar do texto, mesma largura. |
| **SearchField** | Pílula, padding `13 × 16`, ícone lupa 20 `textMuted`, gap 10, texto `body`. Na tela: fundo `surface` + borda `border`. Dentro de bloco branco: fundo `background`, sem borda. Em foco: borda `primary` 1,5. Com texto: botão limpar (X 18). |
| **Chip** | Pílula, padding `8 × 14` (`8 × 12` com ícone), texto `label`, ícone 16 `primary` opcional, gap 6. Neutro: `surface` + borda `border`. Selecionado: fundo e borda `ink`, texto e ícone brancos, check 14 à esquerda. |
| **Badge (selo)** | Pílula, padding `3 × 9`, texto `small` SemiBold, ícone 12–13 opcional. Variantes (fundo/texto): Destaque `accent`/`ink` + foguete; Verificado `primarySoft`/`primary` + selo; Ativo `primarySoft`/`primary`; Em revisão `accentSoft`/`accentText`; Pausado e Rascunho `neutralSoft`/`textMuted`; Confirmado `successSoft`/`success`; negativo `dangerSoft`/`danger`. |
| **Input (campo)** | Rótulo `label` `text` em cima (gap 6), caixa `surface` raio 16, borda 1 `border`, padding `15 × 16`, valor `body` `text`, placeholder `textMuted`, ícone à direita opcional (olho para senha). Ajuda abaixo em `caption` `textMuted`. Foco: borda `primary` 1,5. Erro: borda `danger` + ajuda em `danger`. Multilinha: altura mínima 132, texto alinhado ao topo, contador na ajuda ("128 de 2.000 caracteres"). |
| **CodeInput (novo)** | 6 caixas de 56 de altura, larguras iguais, gap 8, raio 14, `surface`, borda `border`; caixa atual com borda `primary` 1,5; dígito em `number`. Um único `TextInput` invisível por trás (`textContentType="oneTimeCode"`, `autoComplete="sms-otp"`), colar preenche tudo. |
| **ListingCard** | Card horizontal: `surface`, borda `border`, raio 20, padding 12, gap 12, alinhado ao topo. Foto 84 × 84 raio 14 (`expo-image`, `contentFit="cover"`). Sem foto: fundo `primarySoft` com o ícone da categoria 28 `primary` centralizado. Selo **Destaque** sobre a foto (canto inferior esquerdo, 5 px de margem, texto 12). Coluna: título `cardTitle` `ink` em até 2 linhas + coração 22 à direita (marcado: fill `primary`); categoria `caption` `textMuted` (1 linha); local "Bairro · publicado há N dias" `caption` (1 linha); linha com preço `bodyStrong` `primary` + nota (estrela fill 14 `accent` + "4,8 (23)" `label`), gap 10, 3 px acima. **Sem borda laranja em destaque.** É o mesmo card na Início, busca, Anúncios, Favoritos e prévia do anúncio. |
| **ListSection / ListRow** | Grupo `surface`, raio 20, borda `border`, recorte interno. Nome do grupo acima em `label` `textMuted`. Linha: padding `16` (12 com subtítulo), gap 12, ícone 22 `textMuted` opcional, título `body` (ou `bodyStrong`), subtítulo `caption`, valor à direita `caption` `textMuted` (ou selo), seta CaretRight 18 `textMuted`. Divisória de 1 px `border` entre linhas. Linha destrutiva: ícone e texto `danger`, sem seta. |
| **Sheet** | Como em 1.3. Abre com o fundo `scrim`. Conteúdo com gap 16. Ações fixas no fim (ex.: Limpar + Ver N profissionais, lado a lado com gap 10). |
| **ScreenHeader (barra superior)** | Linha com seta voltar (ou X em fluxos modais) 24 `ink`, gap 12, título `heading` `ink`, ações à direita (ícone 22 `ink` ou texto `button` `primary`). |
| **Título da aba** | `title` `ink`, com caret 18 quando abre a escolha de cidade, e subtítulo opcional `caption` `textMuted`. |
| **Notice (aviso, novo)** | Raio 16, padding `12 × 14`, ícone 20 + texto `caption` `text`, gap 10. Info: `primarySoft` + Info `primary`. Sucesso: `successSoft` + CheckCircle fill `success`. Atenção: `accentSoft` + Warning `accentText`. |
| **ProgressBar (etapas)** | Texto "Passo 1 de 5 · Categoria" em `label` `textMuted` + trilho de 6 px raio 3 `border` com preenchimento `primary`, gap 8. |
| **EmptyState** | Centralizado, padding `40 / 16 / 24`, gap 12: círculo 72 `primarySoft` com ícone 32 `primary`; título `title` `ink`; texto `body` `textMuted`; uma ação primária. Usado em favoritos vazio, tempo esgotado, anúncio bloqueado e erros. |
| **SegmentedControl** | Pílula `neutralSoft`, padding 4, gap 4; segmento selecionado `surface` com sombra leve (`y1 blur3 ink 12%`), texto `label` (selecionado SemiBold `ink`, outros `textMuted`). |
| **OfferOption (opção com preço)** | Card `surface` raio 20 padding 16 gap 12: rádio 22 (vazio `borderStrong`; marcado `primary`), título `cardTitle`, apoio `caption`, valor `bodyStrong` à direita. Selecionada: borda `primary` 1,5. |
| **Checkbox** | Quadrado 22 (marcado: CheckSquare fill `primary`), texto `body`, links do texto em `primary`. |
| **Toast** | Pílula `ink`, padding `11 × 16`, CheckCircle fill 18 `accent` + texto `label` branco, sombra Toast. Centralizado, 16 acima da tab bar (ou do rodapé). |
| **Bloco escuro (ProPromo)** | `ink`, raio 24, padding 20, gap 14: rótulo "Para quem presta serviço" `label` SemiBold `accent`; título `title` branco; texto `body` `textOnDarkMuted`; oferta em 2 tiles lado a lado (`inkSoft`, raio 16, padding 14, valor `number` `accent` + texto `caption` `textOnDarkMuted`): **"14 dias"** no ar sem custo no primeiro anúncio · **"R$ 0"** por contato recebido; passos opcionais (número em círculo de 26 com borda `textOnDarkMuted`, o último em `accent`); botão `accent` + link "Já tenho conta" em branco. |
| **StatCard (métrica)** | `surface` raio 20 borda, padding 16, gap 4: rótulo `caption` `textMuted` (quebra linha) + selo de variação à direita; valor `number` `ink`. |
| **TabBar** | Pílula flutuante `surface`, borda `border`, raio 32, padding `10 × 20`, sombra Flutuante, distribuída (`space-between`). Aba: ícone 24 + rótulo `small`, gap 2. Ativa: ícone fill `primary` + rótulo SemiBold `primary`. Inativa: regular `textMuted`. Visitante: Início, Anúncios, Favoritos, Conta. Anunciante: Início, Anúncios, Favoritos, **Gerenciar** (Storefront), Conta. |
| **Avatar** | Círculo; sem foto: `primarySoft` com iniciais `primary` SemiBold (46–64 conforme a tela). |

---

## 3. Telas (34) — cada uma igual ao quadro do Figma com o mesmo código

Todas: fundo com padrão (1.3), margem 16, gap 16 entre blocos (salvo indicação), barra de status do
sistema transparente com ícones escuros. Telas de aba têm a tab bar; fluxos têm rodapé de ação fixo.
Textos: os do app (`src/i18n/pt-BR.ts`); onde a tela abaixo traz texto novo, acrescente-o ao i18n.

### Visitante

- **V01 Início** (`/`, aba Início): topo com logo Conkat (22 de altura) e pílula de cidade (MapPin 16
  `primary` + "Joinville" `label` SemiBold `ink` + CaretDown 14, `surface` com borda) → bloco de busca
  (`surface`, borda, raio 28, padding `20/18/18`, gap 16) com "Qual **serviço** você procura?" em
  `display` `ink` e a palavra que gira em `accentText` (mesmas palavras e intervalo do `RotatingWord`)
  + SearchField no modo "dentro de bloco" → cabeçalho "Publicados recentemente" (`heading`) com "Ver
  todos" (`button` `primary`) → lista de ListingCard (gap 12) → botão secundário "Ver todos em Joinville".
- **V02 Início · escolher cidade**: Sheet "Onde você procura?" sobre a Início: SearchField "Buscar
  cidade" (modo bloco) → linha de ação "Usar minha localização" (círculo 36 `primarySoft` com Crosshair
  18 `primary` + texto `button` `primary`) → "Cidades com anúncios" (`label` `textMuted`) → lista de
  cidades (MapPin 20, nome `body`; escolhida em `bodyStrong` com pin e Check 20 em `primary`;
  divisórias de 1 px no topo de cada linha, padding vertical 14).
- **V03 Busca** (`/search`): linha com seta voltar + SearchField em foco → "Em Joinville, SC ·
  **Trocar cidade**" (MapPin 16, `caption` + link `label` SemiBold `primary`) → "Explorar por categoria"
  (`heading`) → grade de 2 colunas (gap 10) de tiles de categoria: `surface`, borda, raio 16, padding
  12, ícone 18 `primary` num quadrado 30 raio 10 `primarySoft`, nome `label`.
- **V04 Busca · sugestões**: campo com o termo ("ele") e botão limpar → "Categorias" → ListSection com
  as categorias sugeridas (ícone `primary` + seta) → chips "Filtros" (SlidersHorizontal) e "Ordenar:
  mais recentes" (ArrowsDownUp) → "2 profissionais em Joinville" (`label` `textMuted`) → cards.
- **V05 Busca · resultados**: igual à V04 sem o grupo de categorias.
- **V06 Anúncios** (`/explore`, aba Anúncios): título da aba "Anúncios em Joinville" + caret (abre V02)
  → SearchField → chips Filtros / Ordenar → fileira horizontal rolável de chips de categoria ("Todas"
  selecionado) → "14 profissionais em Joinville" → lista de cards.
- **V07 Anúncios · filtros**: Sheet "Filtros": "Categoria" + chips com ícone em quebra de linha ("Todas"
  selecionado) → "Preço" + chips Qualquer (selecionado), Preço fechado, A partir de, Por hora, Por dia,
  A combinar → ações lado a lado: Limpar (secundário) e "Ver 14 profissionais" (primário, com a contagem ao vivo).
- **V08 Anúncios · ordenar**: Sheet "Ordenar por": linhas Mais recentes (selecionada, `bodyStrong` `ink`
  + Check 20 `primary`), Menor preço, Maior preço, Nome (A–Z) → Notice info "Anúncios em destaque
  aparecem primeiro em qualquer ordem."
- **V09 Anúncio** (`/service/[id]`): barra com voltar, mais opções (DotsThree) e coração → galeria raio
  24 (altura 214, paginada) → selos Destaque + categoria → título em `display` `ink` → preço `bodyStrong`
  `primary` + nota ("4,8 · 23 avaliações") → card do profissional (avatar 46, nome `cardTitle`, "Verificado
  · no Conkat desde 2026" em `caption` `primary` com selo, seta) → "Sobre o serviço" + texto `body` →
  ListSection com "Área atendida" e "Como cobra" (com subtítulos) → "Avaliações": card com nota em
  `number`, 5 estrelas 13, total `small`, barras de distribuição (6 px, trilho `primarySoft`, valor
  `primary`) e linha "Já contratou? Dê sua nota" com 5 estrelas vazias 22 → **rodapé fixo** com "Chamar
  no WhatsApp" (primário, ícone WhatsApp, ocupa o espaço) e "Ligar" (secundário, ícone Phone).
- **V10 Favoritos · vazio** (`/favorites`): título da aba + EmptyState (Heart) "Nenhum favorito ainda" /
  "Toque no coração de um anúncio para salvá-lo aqui. Fica guardado neste aparelho, sem precisar de
  conta." / "Ver profissionais em Joinville".
- **V11 Favoritos · com anúncios**: título + subtítulo "2 anúncios salvos neste aparelho, sem precisar de
  conta." → cabeçalho "Em Joinville" com a contagem → cards com coração marcado → Toast "Salvo nos
  favoritos" ao salvar.
- **V12 Conta** (`/settings`, visitante): título "Conta" → Bloco escuro (título "Anuncie no Conkat. O
  cliente chama no seu WhatsApp.", texto "Apareça para quem procura o seu serviço em Joinville e região,
  sem intermediário.", oferta 14 dias / R$ 0, botões "Criar conta de prestador" e "Já tenho conta") →
  "Para procurar e falar com profissionais não precisa de conta." (`caption` centralizado) →
  "Preferências" + ListSection (Cidade padrão com valor "Joinville, SC"; Favoritos) → "Versão 1.0.0".
- **V13 Entrar**: Sheet "Entrar" sobre a Conta: "Entre para criar e acompanhar seus anúncios." → campos
  E-mail e Senha (com olho) → "Esqueci minha senha" (link à direita) → Entrar (primário) → "Ainda não
  anuncia no Conkat?" → "Criar conta de prestador" (secundário).
- **V14 Meus anúncios · sem conta** (`/my-ads` sem login): título "Meus anúncios" → Bloco escuro com
  título "Anuncie seu serviço no Conkat.", oferta, os três passos (Cadastro com CPF ou CNPJ · Anúncio em
  cinco etapas · Revisão da equipe e anúncio no ar) e "Criar meu primeiro anúncio" + "Já tenho conta".

### Cadastro

- **V15 Criar conta · seus dados** (`/register`): barra "Criar conta de prestador" → ProgressBar 1 de 2
  "Seus dados" → título `display` "Seu perfil de prestador" + texto → grupos com nome em `label`:
  "Sobre você" (Nome ou nome do negócio + ajuda; Telefone com DDD + ajuda), "Acesso" (E-mail; Crie uma
  senha com olho), "Documento" (CPF ou CNPJ + ajuda) → 2 Checkbox (Termos de Uso, Política de
  Privacidade com o link em `primary`) → **rodapé**: "Criar conta" + "Já tem conta? **Entrar**".
- **V16 Criar conta · confirmar e-mail**: ProgressBar 2 de 2 "Confirmar e-mail" → Notice sucesso "Conta
  criada. Falta só confirmar o e-mail para entrar." → "Confira seu e-mail" (`display`) + texto com o
  e-mail → CodeInput → "Confira também a caixa de spam." → "Reenviar código" (link) → **rodapé**:
  "Confirmar e-mail" + "Confirmar depois" (texto).
- **V17 Esqueci a senha · e-mail** (`/forgot-password`): barra "Redefinir senha" → ProgressBar 1 de 2
  "Seu e-mail" → "Esqueceu a senha?" + texto → campo E-mail → **rodapé**: "Enviar código".
- **V18 Esqueci a senha · código e senha nova**: ProgressBar 2 de 2 "Senha nova" → "Crie a senha nova" +
  texto → "Código recebido por e-mail" + CodeInput + aviso de spam → "Senha nova" e "Repita a senha
  nova" (com olho) → "Usar outro e-mail" (link) → **rodapé**: "Salvar senha nova".
- **V19 Completar cadastro (login social)** (`/complete-signup`, estado de tempo esgotado): barra
  "Completar cadastro" → EmptyState (Clock) "O tempo para concluir acabou" / "Entre de novo com o mesmo
  login para continuar o cadastro." / "Voltar para Entrar". O formulário normal dessa rota segue o
  padrão de V15.

### Anunciante (logado)

- **P01 Meus anúncios** (`/my-ads`, aba Gerenciar): título + subtítulo "1 no ar · 1 em revisão · 1
  pausado · 1 rascunho" → 2 cards lado a lado (Seu saldo **R$ 50** · Ver extrato; Exibições em 30 dias
  **2.080** · Detalhes; valor em `number`) → botão primário "Novo anúncio" (ícone Plus) → um card por
  anúncio (`surface` raio 20 padding 14, gap 12): foto 64 raio 12 + selo de status + título `cardTitle` +
  data `caption`; se ativo: "Faltam 7 dias" (`label` SemiBold) / "de 30 · até 27/11" e trilho de 6 px
  com preenchimento `accent`, métricas (162 Visualizações · 1.031 Exibições em buscas, valores em
  `title`), ações em chips (Impulsionar com foguete, Pausar) e lixeira 22 `danger` à direita; pausado:
  Reativar, Editar; em revisão: Notice "A equipe está revisando. Você recebe o resultado aqui no app.";
  rascunho: chip primário "Continuar edição" + lixeira.
- **P02 Conta** (anunciante): título → card de perfil (avatar 52 "JS", nome `cardTitle`, e-mail `caption`,
  selo Verificado, seta) → "Seus anúncios": Gerenciar anúncios ("1 de 4 no ar"), Saldo e extrato ("R$
  50"), Desempenho → "Preferências": Cidade padrão, Favoritos → "Segurança": Meus dados, Alterar senha,
  **Sair da conta** (danger) → "Versão 1.0.0".
- **P03 Perfil** (`/account/profile`): barra "Meus dados" + "Editar" (texto `primary`) → avatar 64 +
  nome `title` + e-mail → ListSection (Nome, Telefone, Sobre você — valores à direita) → "Conta":
  E-mail (selo Confirmado), CPF (mascarado), Verificação (selo Verificado) → "Segurança": Alterar senha,
  Sair de todos os aparelhos (danger).
- **P04 Saldo** (`/account/balance`): barra "Saldo e extrato" → bloco `ink` raio 24 padding 20: "Saldo
  disponível" `label` `textOnDarkMuted`, **R$ 50** em `number` `accent`, "Usado para publicar e
  impulsionar anúncios." → Notice info sobre recarga pela equipe → "Extrato" + ListSection (Receipt,
  "Crédito inicial", "01/11/2026 às 09:00 · saldo depois: R$ 50", valor "+ R$ 50" `bodyStrong` `success`).
- **P05 Desempenho do anúncio** (`/ads/dashboard`): barra "Desempenho" → SegmentedControl 7 / 30 / 90
  dias → período `caption` → 2 StatCards lado a lado (Exibições em buscas 2.080 com "+2%" Ativo;
  Visualizações 329 com "0%" neutro) → StatCard Taxa de abertura 15,8% com "−0,4 p.p." negativo → card
  "Evolução diária" (`heading`), legenda com pontos (Visualizações `primary`, Exibições `accent`),
  gráfico de linhas (`react-native-svg`; linha de base `border`, guia tracejada, visualizações 2,5 px
  `primary`, exibições 2 px `accent`, pontas e junções arredondadas) e resumo Total / Média por dia /
  Melhor dia.
- **P06 Impulsionar anúncio** (`/ads/boost`): barra → título `title` com o nome do anúncio + texto →
  card de saldo (Wallet `primary`, "Seu saldo" / R$ 50, "Ver extrato") → Notice com o prazo → "Planos" +
  OfferOption (3 dias R$ 5 · R$ 1,67 por dia; 7 dias R$ 10 · R$ 1,43; 15 dias R$ 18 · R$ 1,20) →
  **rodapé**: primário com o valor escolhido ("Impulsionar por R$ 10"; desabilitado sem escolha) + "Voltar".
- **P07 Publicar anúncio** (`/ads/publish`): mesma estrutura: título com o nome, texto da revisão, saldo,
  "Planos pagos" (1 dia R$ 1; 7 dias R$ 7; 15 dias R$ 14; 30 dias R$ 25, com preço por dia) → rodapé
  "Escolha um plano" (desabilitado até escolher) + "Publicar depois". Mantenha o benefício de 14 dias
  grátis quando disponível, como opção destacada no topo da lista.
- **P08 Verificar e-mail** (`/account/verify-email`): barra "Confirmar e-mail" → "Confira seu e-mail" +
  texto → CodeInput → spam → "Reenviar código" → rodapé "Confirmar e-mail".

### Novo anúncio (`/ads/new`, modal; X no lugar da seta)

- **A01 · 1 de 5 · Categoria**: ProgressBar → "Qual serviço você oferece?" (`display`) → chips de
  categoria com ícone em quebra de linha (selecionada em `ink`) → rodapé "Continuar".
- **A02 · 2 de 5 · Descrição**: "Conte sobre o seu serviço" + "Um bom título diz o que você faz. Na
  descrição, conte como trabalha e o que está incluso." → "Título do anúncio" (ajuda "33 de 80
  caracteres") → "Descrição" multilinha (ajuda "128 de 2.000 caracteres") → "Continuar".
- **A03 · 3 de 5 · Preço e área**: "Preço e área de atendimento" → "Como você cobra?" + chips dos tipos
  de preço → "Valor em reais" (ajuda com a prévia: `Aparece como "a partir de R$ 80".`) → "Onde você
  atende" + ListSection "Cidade" (abre a folha de cidade) → "Bairro" → "WhatsApp para contato" (ajuda
  "Os clientes chamam neste número.") → "Continuar".
- **A04 · 4 de 5 · Fotos**: "Fotos do seu trabalho" + regras → grade de 3 colunas (gap 10), fotos raio 16
  com botão remover (círculo 26 `ink` com X 14 branco no canto) e selo "Capa" (`accent`) na primeira;
  tile "Adicionar" com borda tracejada `borderStrong`, Camera 24 `primary` e texto `label` SemiBold
  `primary` → "Continuar".
- **A05 · 5 de 5 · Revisão**: "É assim que seu anúncio vai aparecer" → **o mesmo ListingCard** →
  card "Sobre o serviço" com a descrição → ListSection (WhatsApp, Área atendida) → Notice info "Depois de
  salvar, você escolhe por quanto tempo o anúncio fica no ar. A equipe revisa antes de publicar." →
  rodapé "Salvar e escolher publicação".
- **A06 Editar anúncio · rascunho**: as mesmas etapas com o título "Editar anúncio" e os dados preenchidos.
- **A07 Editar anúncio · ativo (bloqueado)**: barra "Editar anúncio" → EmptyState (Lock) "Este anúncio
  não pode ser editado agora" / "Anúncios no ar não podem ser alterados. Só rascunho, recusado ou
  expirado podem ser editados." / "Voltar" → link "Pausar anúncio para editar" (só se a pausa existir no
  fluxo atual; não crie regra nova).

Estados que não aparecem no Figma seguem os mesmos padrões: carregando = Skeleton no formato final
(ver 4.6); erro = EmptyState com ação "Tentar de novo"; sem conexão = `OfflineBanner` com as cores novas.

---

## 4. Movimento

Movimento existe para **explicar** o que aconteceu (de onde veio, para onde foi, o que mudou), nunca para
enfeitar. Tudo em **Reanimated na thread de UI**, animando só `transform` e `opacity` (e `width` só em
barras de progresso), a 60 fps. Use os utilitários que já existem (`src/lib/motion.ts`: `EASE_OUT`,
`timing`, `staggerDelay`, `stepFromX`; `FadeInView`; `PressableScale`; `src/lib/haptics.ts`) e estenda-os
em vez de criar outros.

### 4.1 Tokens de movimento (em `tokens.ts`, `motion`)

| Token | Valor | Uso |
| --- | --- | --- |
| `fast` | 150 ms | Pressionar, trocar cor, mostrar ícone |
| `base` | 200 ms | Entradas curtas, troca de aba, toast |
| `slow` | 250 ms | Conteúdo de tela, passo do wizard |
| `sheet` | 300 ms | Abrir/fechar folhas |
| `reveal` | 700 ms | Barras de progresso e de distribuição |
| `draw` | 1.400 ms | Desenho das linhas do gráfico |
| `stagger` | 40 ms | Escalonamento de listas (até `staggerItems` = 6) |
| Curvas | `EASE_OUT` = bezier(0.2, 0, 0, 1) para quase tudo; `EASE_IN_OUT` = bezier(0.65, 0, 0.35, 1) para o desenho do gráfico; `SPRING_POP` = bezier(0.34, 1.56, 0.64, 1) (leve sobra) para "pop" de ícones e selos | |
| `pressScale` | 0,97 | Escala ao pressionar |

### 4.2 Acessibilidade de movimento

- Com **Reduzir movimento** ligado (`useReducedMotion` do Reanimated / `AccessibilityInfo`): nada se
  desloca nem escala; entradas viram só fade de 150 ms (ou instantâneas), o gráfico aparece pronto,
  a palavra da Início fica fixa em "serviço", barras aparecem cheias.
- Nenhuma animação bloqueia toque nem atrasa navegação; interações continuam respondendo durante animações.
- Nada pisca mais de 3 vezes por segundo. Animações em loop só na palavra da Início e nos skeletons.
- Respeite a observação de `motion.ts`: animações de layout (`entering`/`exiting`/`layout`) só fora da web.

### 4.3 Toque e feedback (todos os elementos tocáveis)

- Cards, chips, linhas de lista, tiles, botões: `PressableScale` (0,97, `fast`) + troca de cor de fundo
  no estado pressionado (`primary` → `primaryStrong`; superfícies → `neutralSoft` a 60%).
- Links de texto: opacidade 0,7 ao pressionar.
- Háptico leve (`lightHaptic`) em: selecionar chip, aba, opção, favoritar. Sucesso (`successHaptic`) em:
  conta criada, e-mail confirmado, anúncio enviado, pagamento concluído. Erro (impacto médio) em código
  inválido. Nunca em rolagem.

### 4.4 Navegação

- Pilha: transição nativa (empurrar da direita, voltar com gesto). Fluxo de novo anúncio e cadastro:
  `slide_from_bottom` (já configurado), com X para fechar.
- Troca de aba: sem deslizar a tela; conteúdo da aba entra com fade de 150 ms. Na tab bar, o ícone ativo
  troca regular → fill com "pop" (escala 0,85 → 1, 250 ms, `SPRING_POP`) e o rótulo muda de cor em `fast`.
- Tab bar: some deslizando 96 px para baixo (`base`) ao rolar para baixo mais de 8 px depois de 480 px
  de rolagem, e volta ao rolar para cima ou ao parar no topo, como o cabeçalho do site. Mantém a altura
  publicada no `TabBarContext`. Com leitor de tela ativo, nunca esconde.

### 4.5 Entradas de conteúdo

- Primeira montagem de cada tela: blocos entram com `FadeInView` (opacidade 0 → 1, `translateY` 8 → 0,
  `slow`), escalonados por `staggerDelay` (40 ms, no máximo 6 itens; o resto entra junto).
- Listas (cards, linhas): mesmo efeito por item, só na primeira carga e em "carregar mais". Nunca ao voltar
  para a tela nem ao filtrar (ao filtrar: lista antiga sai em fade de 150 ms, a nova entra em 200 ms).
- Palavra da Início: troca a cada intervalo atual do `RotatingWord`; a saída sobe 8 px com fade
  (`base`), a nova vem de 8 px abaixo (`slow`, `EASE_OUT`). A largura do bloco se ajusta sem pular
  (anime `width` do contêiner da palavra em `slow` ou reserve a maior largura).

### 4.6 Carregamento

- Skeletons no **formato final** (card: bloco 84 raio 14 + 3 linhas; StatCard; linhas de lista) em
  `neutralSoft`, pulsando opacidade 1 → 0,55 em 750 ms (`skeletonPulse`), alternado. Troca para o
  conteúdo com fade cruzado de 200 ms, sem salto de layout.
- Botões com ação assíncrona: o texto dá lugar a um indicador (fade 150), a largura não muda, o botão
  fica desabilitado até terminar.
- Pull-to-refresh nas listas com o indicador em `primary`.

### 4.7 Componentes

| Onde | Movimento |
| --- | --- |
| **Folhas** | Sobem do rodapé em `sheet` (`EASE_OUT`), fundo escurece até `scrim` em `base`; arrastar o puxador fecha seguindo o dedo (`@gorhom/bottom-sheet` / `Sheet` atual); ao fechar, `base`. Conteúdo interno entra com fade de 150 ms após 80 ms. |
| **Chip** | Selecionar: fundo e borda para `ink` e texto para branco em `fast`; check entra com escala 0,6 → 1 + fade (`SPRING_POP`, 250 ms) e a largura do chip se ajusta suavemente. |
| **SearchField** | Foco: borda → `primary` 1,5 em `fast`. Botão limpar entra/sai com fade + escala 0,8 → 1 em `fast`. Ao abrir a Busca a partir da Início, o campo faz transição compartilhada de posição (se a versão do Reanimated suportar no projeto; senão, fade `base`). |
| **Favoritar** | Coração: escala 1 → 1,25 → 1 (`SPRING_POP`, 300 ms) e troca regular → fill `primary`; háptico leve; Toast "Salvo nos favoritos". Desfavoritar: só a troca de ícone. Em Favoritos, o card removido sai com fade + altura colapsando (`base`), os de baixo sobem. |
| **Toast** | Entra de 12 px abaixo com fade (`base`), fica 2,5 s, sai com fade de 150 ms. Um por vez; o novo substitui o atual. |
| **ProgressBar (etapas)** | Preenchimento anima a largura em `slow` ao mudar de passo; o texto "Passo N de 5" troca com fade cruzado. |
| **Passos do wizard** | Conteúdo do passo entra de ±24 px (avançar da direita, voltar da esquerda: `stepFromX`) com fade em `slow`; o rodapé não se move. |
| **CodeInput** | Caixa atual com borda `primary` em `fast`; dígito digitado entra com escala 0,9 → 1 (`fast`). Código inválido: as 6 caixas tremem na horizontal (±6 px, 3 ciclos, 300 ms total), bordas ficam `danger` e háptico de erro. Código certo: bordas `success` + `successHaptic` antes de navegar. |
| **OfferOption** | Selecionar: borda → `primary` 1,5 em `fast`, ponto do rádio entra com escala 0 → 1 (`SPRING_POP`, 250 ms); o botão do rodapé habilita e o valor no texto troca com fade cruzado. |
| **SegmentedControl** | O fundo branco do selecionado desliza até o novo segmento (`base`, `EASE_OUT`); o texto troca de cor em `fast`. |
| **Gráfico (P05)** | Linhas desenhadas da esquerda para a direita via `strokeDashoffset` (`draw`, `EASE_IN_OUT`), a de exibições com 200 ms de atraso; ao trocar o período, a linha atual some em 150 ms e a nova é desenhada. Os números das métricas contam do valor anterior até o novo em 600 ms (`EASE_OUT`, `tabular-nums`). |
| **Barras (avaliações, prazo no ar)** | Crescem de 0 até o valor (`scaleX` com origem à esquerda) em `reveal`, uma vez quando entram na tela; barras de avaliação escalonadas em 60 ms. |
| **Selo Verificado / Destaque** | Sem animação em listas. No anúncio (V09), o selo Verificado entra com "pop" (escala 0,4 → 1, `SPRING_POP`, 450 ms, 400 ms de atraso) uma vez. |
| **EmptyState** | Círculo do ícone entra com escala 0,9 → 1 + fade (`slow`); texto e botão em seguida (`staggerDelay`). |
| **Galeria (V09)** | Paginação por gesto com indicador de página (pontos que alargam o ativo de 8 → 24 em `slow`). Se o app já abre a foto em tela cheia, a abertura parte da foto com transição de escala; se não abre, não crie essa função. |
| **Avisos de sucesso** | O ícone CheckCircle entra com "pop" ao aparecer (V16). |

---

## 5. Plano de execução (um commit por fase)

1. **Tokens e fontes**: `tokens.ts` (cores, tipografia, espaçamento, raios, sombras, movimento), fontes em
   `assets/fonts` carregadas no `_layout.tsx`, `Text` com as variantes novas. Sem mudar telas ainda, exceto
   pelos efeitos diretos dos tokens.
2. **Componentes base** (`components/ui`): Button, SearchField, Chip, Badge, Input, CodeInput (novo),
   ListSection/ListRow, Sheet, ScreenHeader, Notice (novo), ProgressBar, EmptyState, SegmentedControl,
   Checkbox, Toast, Avatar, Skeleton, PressableScale, FadeInView.
3. **Componentes compostos**: ListingCard, TabBar, OfferOption, StatCard, ProPromo (bloco escuro),
   LineChart, RatingBlock, BalanceSummary, CitySelector, FilterSheet, SortSheet, LoginSheet, StepProgress.
4. **Telas de visitante e cadastro** (V01–V19).
5. **Telas do anunciante e do novo anúncio** (P01–P08, A01–A07).
6. **Movimento**: tudo da seção 4, com reduzir movimento.
7. **Revisão final**: comparação tela a tela com o Figma, acessibilidade e validações.

Ao começar, faça um levantamento curto (quais componentes e telas existem, o que cada um usa) e mostre
o plano antes de editar.

## 6. Critérios de aceite

- [ ] Cada uma das 34 telas, numa tela de 375 × 812 com os dados de exemplo, bate com o quadro do mesmo
      código no Figma: mesmas peças, ordem, textos, cores, tipografia, raios e espaçamentos (tolerância de
      2 px). Tire um print de cada (web em 390 × 844 serve) e compare lado a lado.
- [ ] Nenhuma cor, tamanho de fonte, raio ou espaçamento solto: tudo vem dos tokens.
- [ ] Unageo nos títulos e números; Inter no resto; nada em fonte do sistema.
- [ ] Laranja só em destaque (selo, estrela, prazo, marcadores, CTA sobre `ink`).
- [ ] O mesmo ListingCard em Início, busca, Anúncios, Favoritos e revisão do anúncio.
- [ ] Todas as animações da seção 4, a 60 fps num aparelho médio Android, sem travar toque.
- [ ] Reduzir movimento respeitado em todas elas.
- [ ] Leitor de tela: rótulos, papéis e estados corretos; ordem de foco lógica; contraste AA (texto
      `textMuted` sobre `surface`/`background` e `primary` sobre `surface` passam).
- [ ] Tamanho de fonte do sistema até 130% sem cortar texto nem sobrepor elementos.
- [ ] Funcionalidades, rotas e chamadas de API inalteradas; testes existentes passando (ajuste snapshots
      só onde a mudança visual é a esperada) e testes novos para CodeInput, Toast e TabBar.
- [ ] `npm run lint`, `npm run type-check`, `npm test` e `npx expo-doctor` sem erros.

Ao terminar, entregue: o resumo do que mudou por fase, a lista das telas com o print novo de cada uma ao
lado do quadro do Figma, e o que ficou de fora ou precisa de decisão (com o motivo).
