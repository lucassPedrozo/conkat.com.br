# Fase 2: vídeo de divulgação do Conkat

Resultado: `out/conkat-divulgacao.mp4` · 1080×1920 · **60 fps** · 15,0 s · H.264 + AAC (v2, polida).
Código: projeto Remotion nesta pasta (`src/Video.tsx`, `src/tokens.ts`). Áudio: `scripts/gerar-audio.mjs`.

## 1. Conceito

A referência faz uma frase fixa trocar só a última palavra enquanto um personagem reage a um número. No Conkat a frase fixa é **"Profissionais verificados de Joinville"** e a palavra que troca é o serviço procurado ("Procurando eletricista? / diarista? / pintor? / encanador?"), a mesma ideia do "Qual [serviço] você procura?" do app. No lugar do mascote 3D entra o **card de anúncio real do app**, que "pop"a em cada troca. O que reage é o preço, que conta até o valor, e o chip **Verificado**, que aparece e some. No fim o card vira o botão **"Em breve"** em fundo `ink`.

Funciona para os dois públicos: quem procura vê que acha um profissional verificado na cidade; quem anuncia vê "14 dias grátis · R$ 0 por contato" no CTA.

## 2. Roteiro e storyboard

| Cena | Tempo | Visual | Texto na tela | Animação / transição | Áudio |
|---|---|---|---|---|---|
| 1 Gancho + eletricista | 0,0–2,2 | Fundo claro com padrão de ícones. Card do eletricista | "Profissionais verificados de" / **Joinville** / "Procurando **eletricista?**" | Título, hero e palavra entram em fade + subida (250 ms, escalonados). Card entra com pop (spring) em 0,2 s. Preço conta 0→100 em 600 ms. Chip "Verificado" em 0,5 s, some em ≈1,15 s | Pop em 0,22 s, tick no chip |
| 2 Diarista | 2,2–4,5 | Card da diarista | Palavra → "diarista?" | Card anterior sai (200 ms) e o novo faz pop. Palavra em crossfade com sobreposição de 250 ms | Whoosh curto + pop |
| 3 Pintor | 4,5–7,0 | Card da pintura | Palavra → "pintor?" | Igual | Whoosh curto + pop |
| 4 Encanador + respiro | 7,0–9,6 | Card do encanador, depois ≈1,5 s **parado** | Palavra → "encanador?" | Igual. Depois do chip, nada se mexe (o "respiro" da referência) | Pop; música segue |
| 5 Corte | 9,6 | Fundo vira `ink` em 1 frame. O título some. O card continua no lugar | — | Corte seco de cor, como o da referência | Whoosh ascendente (9,25–9,75) |
| 6 Morph | 9,6–10,8 | O card encolhe e sobe, muda de branco para laranja sólido e vira uma pílula. A foto do encanador sai pela direita, com motion blur. A logo e a linha de apoio entram | "Em breve" | Ease-in-out 550 ms (forma), slide da foto em 380 ms. Logo com spring | Pop + whoosh (10,1 s) |
| 7 CTA | 10,8–15,0 | Logo, "Profissionais verificados de Joinville e região.", botão, "na App Store e no Google Play", bloco "Para profissionais" | "Em breve" / "na App Store e no Google Play" / "Para profissionais: 14 dias grátis no primeiro anúncio · R$ 0 por contato" | Linha de apoio em 10,2 s, "App Store" em 11,15 s, bloco profissional em 11,4 s. Depois **4 s parados** | Ding em 10,9 s |

## 3. Copy (todos os textos)

- "Profissionais verificados de" · "Joinville" · "Procurando" + eletricista / diarista / pintor / encanador + "?"
- Card de cada serviço (dados de demonstração do site, ver aviso abaixo) · "Verificado" · "Exemplo ilustrativo"
- "Em breve" · "Profissionais verificados de Joinville e região." · "na App Store e no Google Play"
- "Para profissionais" · "14 dias grátis no primeiro anúncio" · "R$ 0 por contato"

Tudo vem do site e do app (título do site, "Em breve na App Store e no Google Play", 14 dias grátis a partir da aprovação, R$ 0 por contato).

## 4. Especificações técnicas

- **Easing** (tokens do app): ease-out forte `cubic-bezier(.22,1,.36,1)`; ease-in-out `cubic-bezier(.65,0,.35,1)`; pop = spring `damping 11, stiffness 210, mass 0.5` (overshoot curto). Só `transform` e `opacity`.
- **Durações:** fade 150–250 ms, saída do card 200 ms, contador 600 ms, morph 550 ms, slide 380 ms, escalonamento 40 ms.
- **Escala:** o card é o `ListingCard` do app ×2,5 (raio 50, foto 210 com raio 35, título 40, categoria 32, preço 40).
- **Fontes:** Unageo SemiBold 600 (hero 240 px, palavra 72, "Em breve" 74, blocos 48), Inter 400/500/600 (textos 28–60).
- **Cores por cena:**
  - Cenas 1–4: fundo `#F8F9FA` + padrão a 22%, texto `#1A1A1A` / `#5F6672`, hero `#0B2B2A`, palavra `#A85A00`, preço `#0B7A75`, chip `#E6F4F3` com texto `#0B7A75`, estrela `#FDA333`, bordas `#E5E7EB`.
  - Cenas 5–7: fundo `#0B2B2A` + padrão a 7%, texto `#A7C4C2`, bloco `#123B39`, botão `#FDA333` com texto `#0B2B2A`, destaque "R$ 0 por contato" `#FDA333`.
- **Safe zones de Reels/Shorts:** conteúdo entre y≈270 e y≈1560.
- **Trilha:** sintetizada por código (pad com acordes Cmaj7–Am7–Fmaj7–G7, arpejo leve, kick suave, 96 BPM), mais pops, whooshes e um ding. Original, sem amostras de terceiros.

## 5. Assets

**Usados** (em `public/`, vindos de `assets/`): `logo/conkat-logo-branco.svg`, 4 fotos (`eletricista`, `cozinha`, `pintura`, `encanador`), `pattern.svg`, fontes Unageo 600/700 e Inter 400/500/600. Ícones Phosphor (estrela, selo) embutidos no código.
**Não precisa de mais nada** para esta versão.

## 6. Como rodar

```powershell
npm run studio   # pré-visualizar
npm run render   # gera out/conkat-divulgacao.mp4
npm run audio    # regenera a trilha
```

## Conformidade e pontos para você decidir

Conferido contra o design system do Conkat: sem gradiente, blur decorativo, glassmorphism, roxo ou emoji. Laranja só no botão sobre `ink`, na estrela e na palavra destacada. Texto sobre laranja em `ink`, não branco. Um selo por card.

O único `blur` é o motion blur da foto saindo do botão (≈380 ms), que acompanha movimento. A referência usa isso também.

**Atenção antes de publicar:**
1. **Dados de demonstração.** Os preços e notas dos cards são exemplos do site (encanador, diarista, pintura). **O card do eletricista (R$ 100, 4,8) eu criei como exemplo**, seguindo o mesmo formato. O vídeo mostra "Exemplo ilustrativo" embaixo de cada card. Se preferir, troco por anúncios reais.
2. **"Verificado".** O selo é do app, mas o chip aparece sobre dados de exemplo. Vale conferir se a comunicação de "profissionais verificados" está liberada pela equipe, já que o site usa essa frase.
3. **Trilha sintética.** É um rascunho competente, mas simples. Se quiser uma faixa livre de direitos, é só colocar em `public/audio/trilha.wav` ou `.mp3` e ajustar o `src`.
4. **Não ouvi o áudio.** Só medi e gerei por código. Ouça antes de publicar.
5. **Licença da fonte "Con" da logo (Ahellya)** ainda sem confirmação por escrito (nota do cofre).

## Versão 2 (polimento)

- **Fluidez:** 60 fps; entradas por máscara (texto sobe de dentro de uma janela, letra a letra no "Joinville"); cards entram por baixo e o anterior sai por cima, sobrepostos; zoom leve de câmera; foto do card assenta com zoom; troca de fundo por onda circular a partir do card (no lugar do corte seco).
- **Logo:** agora a variante negativa correta, com letras brancas e **cursor laranja**, maior (780 px), revelada da esquerda para a direita, com o cursor piscando.
- **Áudio:** reescrito. 100 BPM sincronizado com a linha do tempo (`src/timeline.json`), pad, e-piano FM, kalimba, baixo com sidechain, bateria leve, reverb, riser + impacto no corte e sino no botão. Normalizado a −14 LUFS.

## Versão 3 (revisão crítica)

**Abertura sem cidade.** A frase fixa agora é a do próprio app: "Qual **[eletricista / diarista / pintor / encanador]** você procura?", com a palavra grande em `accentText` e o **cursor laranja da logo** deslizando até o fim de cada palavra. No fechamento, "Profissionais verificados perto de você." Nenhuma menção a Joinville.

**Áudio.** Sem música (ela entra na postagem, pela biblioteca do Instagram/TikTok). Só sound design: cliques, "bloop" de card, brilho do selo, sopros de transição, onda grave, "digitação" da logo e sino no botão. Pico em −3 dBFS, para ficar por baixo da música. Arquivo `public/audio/sfx.wav`, gerado por `npm run audio`. Há também uma versão sem nenhum áudio: `out/conkat-divulgacao-sem-audio.mp4`.

**O que estava deixando o movimento "duro" e foi corrigido:**
- Padrão de fundo se movendo e escalando: linhas finas cintilavam. Agora fica parado.
- Zoom de câmera aplicado ao texto fazia o texto "tremer" quadro a quadro. Removido.
- Texto e imagens se moviam em pixels inteiros (degraus em movimentos lentos). Agora tudo é composto na GPU (`translate3d`, `will-change`), com posição subpixel.
- **Motion blur real** (`CameraMotionBlur`, obturador de 180°, 6 amostras por quadro) em tudo que se move.
- Curvas: entradas longas em expo-out, saídas curtas em expo-in, springs sem quique.
- Troca de palavra em sequência (a antiga sai, depois a nova sobe letra a letra), sem sobreposição.
- Cards em pilha: o novo sobe por cima e o anterior recua, com o conteúdo do card entrando em cascata (foto, título, categoria, preço).
- O título sai antes da onda escura, que nasce de trás do card.
