# Prompt ajustado: vídeo de divulgação do Conkat

> Contexto extraído do cofre Obsidian (notas Conkat App, Design system 3.0 e Conkat Site, atualizadas em 21–22/11/2026).
> Pendente: o vídeo de referência (.mp4) ainda não está na pasta. Anexe antes de rodar a Fase 1.

---

Você é um motion designer sênior, especialista em vídeos curtos para redes sociais (Reels, Shorts, Pinterest). Você vai **analisar a referência e também produzir o vídeo final por conta própria**, em código, na pasta do projeto. Trabalhe em duas fases e **não pule para a Fase 2 sem a minha aprovação**.

## Material de referência

- **Vídeo de referência:** `referencia.mp4` nesta pasta. Link de apoio: https://br.pinterest.com/pin/630011435419275600/
- **Meu app:** **Conkat**, aplicativo mobile (React Native + Expo) de um marketplace de serviços locais. Quem procura um profissional escolhe a cidade, busca por categoria ou termo, abre o anúncio e chama no WhatsApp. O prestador cria anúncios, paga a publicação com saldo, impulsiona e acompanha as métricas.
- **Público-alvo:**
  1. Quem procura serviço (eletricista, encanador etc.) em **Joinville e região, SC**. Não precisa de conta.
  2. Prestadores de serviço que querem ser encontrados.
- **Funcionalidades que o vídeo pode mostrar (todas existem no app hoje):**
  - Escolher a cidade e buscar o serviço.
  - Ver, antes de chamar: como o profissional cobra, avaliações de 1 a 5 e selo **Verificado** (a equipe revisa anúncios e documentos).
  - Chamar direto no **WhatsApp**.
  - Para o prestador: anúncio em 5 etapas, **14 dias grátis no primeiro anúncio** (a partir da aprovação), **R$ 0 por contato**, impulsionar o anúncio.
- **Objetivo do vídeo:** divulgar o Conkat antes do lançamento nas lojas e gerar interesse das duas pontas (quem procura e quem anuncia).
- **Situação de lançamento:** o app **ainda não está na App Store nem no Google Play** (no site, `APP_LIVE = false`). O CTA deve ser "Em breve", sem botões de loja, sem "baixe agora" e sem link de download. Se eu informar um domínio ou lista de espera depois, você usa.
- **Formato final:** 9:16, 1080×1920, 30 fps, 20–25 s, MP4 (H.264) com áudio.
- **Ferramenta de produção:** **Remotion** (React + TypeScript), criado dentro desta pasta. Você escreve as composições, renderiza o MP4 e confere os frames por conta própria. Fontes, ícones e telas do app serão reconstruídos em código a partir dos tokens abaixo, sem screenshots inventados.

## Marca (fonte única: `src/theme/tokens.ts` do app, Design system 3.0)

| Token | HEX | Uso no vídeo |
|---|---|---|
| `ink` | `#0B2B2A` | Fundos escuros, títulos, blocos de destaque |
| `inkSoft` | `#123B39` | Superfícies sobre `ink` |
| `primary` | `#0B7A75` | Ação, preço, links, verificado |
| `primaryStrong` | `#08615D` | Estado pressionado |
| `primarySoft` | `#E6F4F3` | Fundo de ícones e avisos |
| `accent` | `#FDA333` | **Só destaque**: selo Destaque, estrela, cursor da logo, CTA sobre `ink` |
| `accentText` | `#A85A00` | Palavra destacada sobre fundo claro |
| `background` / `surface` | `#F8F9FA` / `#FFFFFF` | Fundo claro e cards |
| `text` / `textMuted` | `#1A1A1A` / `#5F6672` | Texto |
| `textOnDark` / `textOnDarkMuted` | `#FFFFFF` / `#A7C4C2` | Texto sobre `ink` |
| `success` | `#15803D` | Confirmações |

- **Fontes:** **Unageo SemiBold** em títulos e números; **Inter** no resto. Nunca use `font-weight` para trocar o peso do Unageo (cada peso é um arquivo/família). Os arquivos estão em `assets/fonts/` do repositório `conkat.app` (licença SIL OFL 1.1). Se faltarem, avise e peça.
- **Logo:** variação 2B, em contornos: "Con" em itálico, "kat" em Unageo Bold, cursor `_` em `accent`, letras em `ink`. Vem do repo `conkat.com.br` (`brand/`) e de `components/Logo.tsx` do app. **Peça o arquivo se não estiver na pasta; não redesenhe a logo.**
- **Tom de voz:** sóbrio, direto e confiável, em pt-BR. Copy específica e local ("14 profissionais em Joinville"), nunca genérica.
- **Slogan:** não há slogan oficial. O título do site é "Profissionais verificados de Joinville e região." Use esse como linha de apoio e não invente outro slogan sem me avisar.

### Proibido na identidade (regras do design system, valem para o vídeo)

- Gradiente, glassmorphism, blur decorativo, neon, sombra colorida.
- Roxo, índigo ou violeta.
- Emoji.
- Saudação do tipo "Olá, Ana!".
- Laranja (`accent`) em botão comum ou borda de card. Única exceção: botão `accent` sobre fundo `ink`. **Texto branco sobre `accent` é proibido** (contraste 2,0:1).
- Mais de um selo de status por card.
- Dado ou funcionalidade que o app não tenha. **Nada inventado:** sem avaliações, nomes, preços ou números fictícios apresentados como reais. Se precisar de dados de exemplo nas telas, use claramente dados de demonstração e me avise quais são.
- Sombra só em elementos que flutuam (tab bar, folhas, toast); o resto usa borda de 1 px.

### Movimento do app, para o vídeo ficar com a mesma "mão"

Durações em ms: `fast` 150, `base` 200, `slow` 250, `sheet` 300, `count` 600, `reveal` 700, `draw` 1400, `stagger` 40 por item, `pressScale` 0,97. Curvas: ease-out forte para entradas, ease-in-out para trocas, um spring curto ("pop") para ícones e selos. Só `transform` e `opacity`. Contadores contam em 600 ms; gráficos desenham em 1,4 s. Sem loops no vídeo, exceto a troca de palavra do tipo "Qual [palavra] você procura?", que é a assinatura do app.

## FASE 1: Engenharia reversa do estilo

Assista ao vídeo de referência (extraia os frames com `ffmpeg`, por exemplo a cada 0,1 s nas transições e a cada 0,5 s no resto, e analise o áudio) e entregue:

1. **Decupagem em tabela:** nº da cena | tempo inicial–final | duração | o que aparece | transição para a próxima | movimento de câmera/elemento.
2. **Ritmo e timing:** duração média dos cortes, onde acelera e desacelera, se os cortes seguem as batidas (e quais).
3. **Movimento:** tipos de animação (escala, slide, máscara, rotação, parallax etc.), curvas de easing, duração típica de entrada e saída.
4. **Tipografia:** estilo, peso, tamanho relativo, como o texto entra (palavra por palavra, letra por letra), tempo de leitura por frase.
5. **Composição e cor:** grid, espaço negativo, paleta, contraste, texturas, sombras, profundidade, mockups de dispositivo.
6. **Áudio:** gênero e BPM aproximado, efeitos (whoosh, click, pop) e em que momentos.
7. **Estrutura narrativa:** gancho (primeiros 2 s), desenvolvimento, clímax, CTA.
8. **Resumo do estilo em 5 regras**, e ao lado de cada regra **como ela convive com o Design system do Conkat** (ela passa, passa adaptada ou conflita).

Se algum detalhe não puder ser identificado com certeza, diga isso em vez de supor.

→ **Pare aqui e aguarde minha aprovação ou ajustes.**

## FASE 2: Criação e produção do vídeo

Com as 5 regras aprovadas, entregue **e execute**:

1. **Conceito:** a ideia central em 2–3 frases e por que funciona para os dois públicos (quem procura e quem anuncia). Sugestão de partida, para você validar ou trocar: o gancho usa a pergunta "Qual serviço você procura?" com a palavra trocando, e a resposta é achar um profissional verificado e chamar no WhatsApp em poucos toques.
2. **Roteiro + storyboard em tabela:** cena | tempo | visual | texto na tela | animação/transição | áudio/SFX. Mesma estrutura de ritmo da referência.
3. **Copy:** todos os textos na tela, curtos, em pt-BR, no tom da marca, com CTA final "em breve". Não prometa nada que o app não faça (não existe pagamento pelo serviço dentro do app; o contato é pelo WhatsApp).
4. **Especificações técnicas:** easing, durações e keyframes-chave (usando os tokens de movimento acima), tamanhos de fonte, HEX por cena, margens (16 pt em 375 de largura, escalar para 1080), safe zones de Reels/Shorts, trilha sugerida (estilo e BPM).
5. **Lista de assets:** o que você já reconstruiu em código (telas, cards, tab bar, ícones Phosphor, logo) e o que eu preciso fornecer (fontes, arquivo da logo, trilha licenciada).
6. **Implementação:** projeto Remotion nesta pasta, com uma composição por cena, tokens centralizados em um único arquivo, e render final em `out/conkat-divulgacao.mp4`. Antes de me entregar, renderize frames-chave (início, meio, fim de cada cena), confira contra a lista de proibições acima e corrija. Informe tudo o que não conseguiu verificar.

## Regras gerais

- **Adapte o estilo, não copie.** Nada de elementos, textos, imagens ou trilha protegidos da referência. Trilha: use faixa livre de direitos ou me peça uma; não embuta música de terceiros.
- **A marca vence.** Se houver conflito entre a referência e o Design system do Conkat, siga a marca e explique a adaptação.
- **Não invente dados.** Cidade, prazos, preços e funcionalidades só os que constam neste documento. Na dúvida, pergunte.
- Cenas com o app mostram a interface real do Design 3.0 (tab bar flutuante, cards de anúncio com foto de 84 e raio 20, selo Destaque centrado embaixo da foto, preço em `primary`, toast em pílula `ink`), reconstruída em código.

## Assets já disponíveis

Tudo está em `assets/` (índice e avisos em `assets/ASSETS.md`): logo 2B em SVG, fontes Unageo, padrão de ícones, telas do app 3.0 com moldura de iPhone, cards avulsos, fotos e ícones. **Use esses arquivos. Não redesenhe logo nem tela.** Os prints em `assets/telas-app-prints/` são do design antigo e não entram no vídeo. Os preços e notas das telas são dados de demonstração.

## Pontos em aberto para você me responder

1. O `referencia.mp4` na pasta.
2. ~~Logo e fontes~~ (já em `assets/`).
3. Existe slogan, site ou lista de espera para o CTA? Se não, uso "Em breve".
4. Prefere focar o vídeo em quem **procura** serviço, em quem **anuncia**, ou nos dois?
5. A licença da fonte do "Con" na logo (Ahellya) ainda não foi confirmada por escrito (nota do cofre). Para vídeo comercial vale resolver antes de publicar.
