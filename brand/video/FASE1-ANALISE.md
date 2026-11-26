# Fase 1: engenharia reversa do vídeo de referência

Arquivo: `referencia.mp4` · 720×1280 (9:16) · 30 fps · **11,6 s** · H.264 + AAC estéreo.
Método: frames extraídos com ffmpeg (a 2, 5, 10 e 15 fps nos trechos de transição), detecção de cortes e medição de volume a cada 0,1 s. Tempos com margem de ±0,1 s (±0,2 s onde digo "≈").

**O que é:** um anúncio vertical de um app de adiantamento de dinheiro. Não é um vídeo de cortes. É **uma única cena contínua** em que uma legenda de três linhas ("Cash Advance offers up to / $750 / for ___") troca a última palavra enquanto um **mascote 3D** (saco de dinheiro, bomba de gasolina, cachorro, ambulância) fica em cima de um cartão de saldo que sobe e desce. No fim o cartão vira um botão em fundo verde-escuro com CTA.

## 1. Decupagem

A cena é uma só, então separei em **beats** (momentos em que algo muda).

| # | Tempo | Dur. | O que aparece | Transição para o próximo | Movimento |
|---|---|---|---|---|---|
| 1 | 0,0–1,3 | 1,3 s | Fundo creme claro. Cartão "Balance" sobe de baixo. **Saco de dinheiro** brota minúsculo e cresce (pop). Título "Cash Advance offers up to" e **$750** entram em fade+leve subida. Legenda "for / any need" entra em duas partes. Chip verde "+750". Saldo conta de $263 a $755, barra enche em verde | Mascote sai e o seguinte entra por baixo | Pop de escala com overshoot, fades de 150–250 ms. Chip some em fade ≈0,3 s depois |
| 2 | 1,3–2,8 | 1,5 s | **Bomba de gasolina** com carinha. Legenda vira "for gas". Chip laranja "−115". Saldo cai ($644→$635). Barra passa a dourado | Mascote troca (sobe/desce) | Pop de entrada; palavra anterior sai em fade enquanto a nova entra em fade, **sobrepostas** ≈0,25 s |
| 3 | 2,8–5,4 | 2,6 s | **Cachorro** (beagle de camiseta preta). Legenda "for vet bills". Chip "−397". Saldo cai ($436→$278→$241→$238). Barra laranja. O cachorro muda de pose (senta, deita, levanta a cabeça, senta) enquanto o saldo fica parado | Troca de mascote | O saldo é o único número em movimento. O mascote "respira" em poses 3D diferentes (parecem poses pré-renderizadas trocadas, **não confirmado**) |
| 4 | 5,4–7,2 | 1,8 s | **Ambulância** verde. Legenda "for emergency". Chip "−218". Saldo vai a $20, barra vermelha | **Corte de cor**: no 7,2 s aparece o fundo verde | Mesmo pop. Depois ≈1 s de **respiro parado** |
| 5 | 7,2–7,7 | 0,5 s | Fundo vira **verde-escuro** com malha de gradiente borrado. O cartão branco **encolhe e sobe**; aparece o ícone do app | O cartão se achata e vira pílula | Escala + máscara. Mudança de fundo em **1–2 frames** (corte seco, sem fade) |
| 6 | 7,7–8,3 | 0,6 s | O cartão vira uma **pílula escura** com a ambulância dentro. A pílula "lê" o texto "Cash Advance offers up to $750*" e "Apply Now" por baixo. **Estrelas** acendem uma a uma | A ambulância **sai para a direita** com motion blur forte | Slide horizontal com blur, ease-out |
| 7 | 8,3–11,6 | 3,3 s | **CTA final estático:** ícone, "Cash Advance offers up to **$750***", botão "**Apply Now**", 5 estrelas, "260,000+ users", texto legal | Fim (sem fade de saída) | Só o fundo verde deriva muito devagar. Contadores terminam em 260.000 |

**Detalhe que repete no começo e no fim:** o contador de usuários ("72.824+" → "228.886+" → "260.000+" nos primeiros 1,5 s; de novo "78.266 → 117.820 → 234.484 → 260.000" entre ≈8,5 e 10 s). Os dois se resolvem em 260.000.

## 2. Ritmo e timing

- **Cortes:** o detector de cena só achou 1 (em 7,2 s, o corte para o verde). Todo o resto é movimento contínuo dentro do mesmo quadro.
- **Beats de mascote:** a cada **≈1,4 s** nos dois primeiros (1,3 e 2,8), depois **≈2,6 s** no cachorro e **≈1,8 s** na ambulância. O ritmo **desacelera** a cada troca, para o espectador ter tempo de ler cada "for ___".
- **Aceleração:** o ritmo acelera **só** na reta final (7,2–8,3 s), onde acontecem 3 coisas em 1 s. Depois o vídeo **freia de vez** em 3,3 s de CTA parado.
- **Batida:** a música é contínua (nível ≈ −18 dB). As trocas de mascote caem em **quedas curtas de volume** em ≈2,0, 3,0, 3,9, 4,7, 6,0 e 6,4–6,9 s (de 10 a 15 dB abaixo). Parecem espaços entre efeitos, não batidas musicais. **Não consegui afirmar que os cortes seguem o BPM.**

## 3. Movimento

| Tipo | Onde | Detalhe |
|---|---|---|
| **Pop de escala com overshoot** | Entrada de cada mascote | Nasce pequeno e embaixo, cresce passando um pouco do tamanho final e assenta. ≈200–300 ms |
| **Crossfade com sobreposição** | Palavra final da legenda ("any need" → "gas" → "vet bills" → "emergency") | A velha esmaece enquanto a nova surge no mesmo lugar, ≈250 ms. A palavra "for" fica fixa |
| **Fade + subida curta** | Entrada do título e do $750 | ≈250 ms, deslocamento pequeno |
| **Contador numérico** | Saldo ($263→$755 etc.), usuários | Conta rápido e desacelera no fim (ease-out) |
| **Barra de progresso** | Cartão | Enche e esvazia junto com o saldo, muda de cor (verde → dourado → laranja → vermelho) |
| **Chip flutuante** | "+750", "−115", "−397", "−218" | Aparece ao lado do mascote e esmaece em ≈0,3 s |
| **Morph cartão→pílula** | 7,2–8,3 s | Cartão encolhe, sobe, achata e vira botão. Máscara + escala |
| **Slide com motion blur** | Ambulância saindo | ≈100 ms, ease-out forte |
| **Estrelas sequenciais** | CTA | Acendem uma a uma, ≈80 ms entre elas (estimativa) |

Easing: ease-out forte nas entradas e **spring curto** (overshoot) nos mascotes. Não vi bounce longo. **Valores exatos de curva não são identificáveis** só pelos frames.

## 4. Tipografia

- **Família:** sans geométrica limpa, de proporções largas (parece a família Figtree ou Google Sans, **não identificado com certeza**). Texto em branco sobre verde e em preto sobre creme.
- **Hierarquia (altura do quadro = 1280):**
  - `$750`: ≈ 130 px de altura de caixa-alta, **peso leve (Light/Regular)**, ocupa ≈ 52% da largura. É o herói.
  - "Cash Advance offers up to": ≈ 26 px, peso regular.
  - "for ___": ≈ 28 px, regular. Só a **palavra variável** troca.
  - CTA "Apply Now": ≈ 50 px, **peso semibold**, branco, dentro da pílula.
- **Como o texto entra:** bloco (título + valor) em fade com leve subida; a legenda entra em **duas partes** ("for" depois da palavra). Não é kinetic type letra a letra.
- **Tempo de leitura:** cada "for ___" fica visível por 1,3–2,6 s, para uma frase de 2–3 palavras. Folgado.
- **Detalhe:** a legenda e o valor têm **muito espaço negativo** à volta.

## 5. Composição e cor

- **Grid:** coluna central única, tudo centralizado. Topo (≈ 4% a 25% da altura): título + valor + legenda. Meio (≈ 25–45%): mascote sobre o cartão. Parte de baixo ≈ 55% da tela **vazia** (cartão ocupa só o terço superior). No CTA, o conteúdo fica em torno de 27–70% da altura.
- **Paleta:** cena 1: fundo creme (branco → pêssego claro) + preto + acentos (verde, dourado, laranja, vermelho do estado do saldo). Cena 2: verde-escuro (≈ preto esverdeado no topo → verde vivo embaixo à direita) com texto branco e creme.
- **Profundidade:** mascotes 3D com sombra suave no chão; cartão branco com sombra difusa; na pílula, borda interna brilhante e sombra projetada.
- **Texturas:** gradiente de malha (mesh) borrado no fundo verde, bem suave.
- **Mockup de dispositivo:** **nenhum**. O "app" é só um cartão ilustrativo ("Illustrative example") com saldo, não uma tela real.

## 6. Áudio

- **Trilha:** faixa contínua, constante em ≈ −18 dB, com picos em **3,4–3,5 s** (−11 dB, talvez o latido ou um efeito do cachorro), **7,2–7,4 s** (−10/−8 dB, o corte para o verde: whoosh) e **10,0–10,2 s** (−9/−8 dB, possível "ding" de CTA).
- **SFX:** as quedas de volume entre as trocas sugerem efeitos curtos por mascote. **Não consegui separar gênero, BPM nem os efeitos com segurança** só pelo nível de volume. Para isso eu precisaria ouvir ou analisar o espectro. **Não confirmado.**
- A última 0,1 s é silêncio (−69 dB), fim seco.

## 7. Estrutura narrativa

| Parte | Tempo | Função |
|---|---|---|
| **Gancho** | 0–1,3 s | Valor grande ($750) + saco de dinheiro: a promessa aparece em 1 s |
| **Desenvolvimento** | 1,3–7,2 s | "Para qualquer necessidade": 3 usos (gasolina, veterinário, emergência) com o saldo consumido mostrando "dá para isso" |
| **Clímax** | 7,2–8,3 s | Corte de cor + o cartão vira botão |
| **CTA** | 8,3–11,6 s | "Apply Now" + prova social (estrelas, 260.000+) + texto legal |

## 8. As 5 regras do estilo

| # | Regra | Como convive com a marca Conkat |
|---|---|---|
| 1 | **Uma cena contínua, sem cortes.** Só muda o conteúdo dentro do mesmo quadro. O único corte é o de cor para o CTA | Passa |
| 2 | **Frase fixa + palavra variável.** Uma frase ("for ___") em que só uma palavra troca em crossfade, ancorada por um valor grande | **Passa e já é assinatura do app**: "Qual [palavra] você procura?" troca a cada 2,8 s |
| 3 | **Personagem 3D que "reage" ao número.** Um mascote entra com pop e o saldo/barra reage (conta e muda de cor) | **Adapta.** O Conkat não tem mascote. Em vez dele, a foto do serviço e o card de anúncio entrando com pop. A barra colorida do saldo não existe no app e não deve ser inventada |
| 4 | **Ritmo que desacelera e freia.** Trocas cada vez mais espaçadas; corte seco de cor; morph em ≈ 1 s; **3 s de CTA parado** | Passa |
| 5 | **Mais de 50% de espaço vazio + tipografia leve gigante.** Número herói em peso leve, texto pequeno em volta, centralizado | Passa com a **Unageo SemiBold** no herói, no lugar da leve |

### Conflitos entre a referência e o design system do Conkat (a marca vence)

| Na referência | No Conkat |
|---|---|
| Fundo verde com **gradiente de malha borrado** | **Proibido** (gradiente, blur decorativo). Usar `ink` `#0B2B2A` chapado com o padrão de ícones |
| Pílula com brilho e borda "vidro" | **Proibido** (glassmorphism). Pílula `ink` sólida com sombra em `ink` |
| Mascotes 3D | Não existem na marca. Usar fotos reais do serviço e ícones Phosphor |
| Chips coloridos de estado (verde/laranja/vermelho) | Laranja só como destaque. Usar no máximo 1 selo por card |
| Saldo, barra e valores de dinheiro | Não existem no app. Não inventar. Usar dados reais do produto (cidade, nota, "14 dias grátis") |
| Texto legal e "260.000+ usuários" | O Conkat ainda não tem usuários nem lojas. Não pode haver prova social inventada |

## O que não consegui identificar com certeza

- Fonte exata, gênero e BPM da trilha, efeitos sonoros individuais e se os mascotes são vídeo 3D ou sequências de imagens.
- Curvas de easing exatas (só dá para classificar como ease-out e spring curto).
- Tempos com precisão menor que 0,1–0,2 s.

---

## Pergunta antes de passar para a Fase 2

A referência tem **11,6 s**, e eu tinha previsto **20–25 s**. Recomendo manter a mesma estrutura de ritmo da referência e ficar em **≈15 s**: gancho de 1,5 s, 3 trocas de serviço (3 × ≈2,2 s), 1 s de morph e **3,5 s de CTA parado**. Isso preserva a "desaceleração" que é a assinatura do vídeo. Se preferir 20–25 s, o ritmo muda e eu preciso saber.
