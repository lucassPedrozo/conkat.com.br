# Auditoria de conteúdo e copy — site Conkat (v3)

**Data:** 20/11/2026
**Página:** landing do app (Figma "Conkat — Site (esboço)", versões desktop e mobile)
**Tipo:** marketplace local de dois lados, app mobile
**Conversões:** (1) quem procura baixa o app; (2) profissional começa a anunciar

Skills aplicadas (BrianRWagner/ai-marketing-claude-code-skills): `homepage-audit`,
`brand-positioning-audit`, `positioning-basics`, `marketing-principles`.

Fontes de verdade conferidas: `conkat.app` (`431f048`), `conkat.api` (`978edb9`), Obsidian (`d93e208`).

---

## 1. Teste dos 5 segundos

- **Claro:** é um app para achar profissional e chamar no WhatsApp.
- **Confuso:** onde funciona (nenhuma cidade ou região aparece); se dá para baixar agora;
  por que usar isto e não um grupo de WhatsApp, o Google ou o GetNinjas.

## 2. Notas (homepage-audit)

| Seção | Nota | Peso | Ponderada | Motivo |
|---|---|---|---|---|
| Acima da dobra | 2,8 | 25% | 0,70 | Título funcional, sem região nem diferencial; CTA aponta para lojas onde o app ainda não está |
| Proposta de valor | 3,0 | 25% | 0,75 | Diz o que faz, mas esconde os dois diferenciais reais (verificação de todos e revisão humana) |
| Prova social | 1,0 | 10% | 0,10 | Nenhuma (normal antes do lançamento); a verificação e a revisão deveriam ocupar esse papel |
| Clareza e texto | 4,0 | 15% | 0,60 | Texto limpo, mas com termos que não batem com o app |
| CTA e conversão | 2,0 | 15% | 0,30 | "Baixar o app" e selos das lojas sem o app publicado |
| Confiança e risco | 3,0 | 10% | 0,30 | Preço parcial, links de Termos e Privacidade sem documento |
| **Total** | | | **2,75 / 5** | **Precisa de trabalho** |

## 3. Posicionamento (brand-positioning-audit)

| Dimensão | Nota | Evidência |
|---|---|---|
| Clareza do público | 4 | "Encontre um profissional na sua cidade" — qualquer pessoa, em qualquer lugar |
| Clareza de valor | 6 | Buscar, ver preço e avaliação, chamar no WhatsApp |
| Diferenciação | 3 | Trocável por GetNinjas, OLX Serviços, Google ou grupo de Facebook |
| Credibilidade | 5 | "Documento verificado" aparece como algo opcional, quando é obrigatório |
| Linguagem do cliente | 6 | Simples, mas usa categorias que o app não tem |
| Separação competitiva | 2 | Nenhum motivo para escolher o Conkat em vez das alternativas |
| **Geral** | **4,3 / 10** | |

**Falha raiz: diferenciação.** O produto já tem três diferenciais que o site não diz:

1. **É local:** começa por Joinville e região (Norte de SC e Vale do Itapocu, 14 cidades na base).
2. **Todo profissional é verificado:** a API só aceita publicar com CPF ou CNPJ conferido pela equipe.
3. **Todo anúncio é revisado por uma pessoa** antes de ir ao ar, e o contato é direto, sem
   intermediário e sem cobrança por contato.

**Declaração de posicionamento (positioning-basics):**
Para quem mora em Joinville e região e precisa de um profissional sem depender de indicação em grupo,
o Conkat é um app de anúncios de serviços locais que mostra preço e avaliações e leva direto ao
WhatsApp do profissional. Diferente do GetNinjas (o profissional paga por contato) e dos grupos de
Facebook e WhatsApp (ninguém confere quem anuncia), no Conkat todo profissional tem o CPF ou CNPJ
conferido e todo anúncio passa pela equipe antes de ir ao ar.

## 4. Validação frase a frase

✅ correto · ⚠️ impreciso · ❌ falso ou sem base

| Texto no site | Situação | O que o código diz | Correção |
|---|---|---|---|
| "Disponível para iPhone e Android." + selos das lojas + "Baixar o app" | ❌ | README do app: Bundle ID e package não definidos, o que bloqueia a publicação | Modo "em breve" até o lançamento (`APP_LIVE = false` no script) |
| "Eletricistas, diaristas, encanadores, pintores e outros serviços." | ⚠️ | Categorias reais incluem Beleza, Aulas, Eventos, Fotografia, Informática, Saúde, Mudanças | Citar a amplitude real |
| Nenhuma menção a cidade ou região | ❌ (omissão) | 14 cidades na base, do Norte de SC; README: "começando pelo Norte de SC e o Vale do Itapocu" | Região no título e nas dúvidas |
| "O app mostra as cidades que já têm profissionais anunciando." | ✅ | `onlyWithListings` no filtro de cidade | — |
| "Pesquise pelo nome do serviço ou navegue pelas categorias. Dá para filtrar por tipo de preço." | ✅ | Busca no título; filtros de categoria e tipo de preço | Leve ajuste |
| "A conversa é direto com o profissional." | ✅ | WhatsApp obrigatório no cadastro do anúncio pelo app | Dizer que todo anúncio tem WhatsApp |
| "Valor fixo, a partir de, por hora, por dia ou a combinar." | ✅ | `fixed`, `starting_from`, `hourly`, `daily`, `negotiable` | — |
| "Avaliações de clientes" / "de quem contratou" | ❌ | Qualquer pessoa com o app avalia, uma vez por aparelho, sem comprovar contratação | "Avaliações" + transparência nas dúvidas |
| "Anúncio sem avaliação não mostra nota." | ✅ | App: "Este anúncio ainda não foi avaliado." | Usar o texto do app |
| "O selo aparece quando a equipe confere o documento" | ⚠️ | Verificação é **obrigatória** para publicar; a busca só mostra verificados | "Todo profissional é verificado" |
| "Nenhum anúncio vai ao ar sem passar pela revisão da equipe." | ✅ | `submit` sempre leva a `pending_moderation` | — |
| "Salve anúncios sem criar conta. Eles ficam no aparelho e abrem sem internet." | ✅ | `FavoritesContext` guarda o resumo no aparelho | — |
| "A primeira publicação fica 14 dias no ar sem custo, a contar da aprovação." | ✅ | `first_listing_free_14_days: 14`, ativada na aprovação | — |
| "Categoria, descrição, preço e área de atendimento, fotos e revisão final." | ✅ | Wizard em 5 passos; API exige ao menos 1 foto | — |
| Falta: cadastro com CPF ou CNPJ e e-mail confirmado | ❌ (omissão) | Exigido para enviar o anúncio | Novo item na seção de profissionais |
| "Anúncios impulsionados aparecem antes dos outros na sua cidade." | ✅ | `boostWeight` ordena primeiro em qualquer ordenação | Citar o selo Destaque |
| "...quantas pessoas o abriram." | ⚠️ | `detail_view` conta aberturas, não pessoas | "quantas vezes foi aberto" |
| "visitas ao anúncio" (card de desempenho) | ⚠️ | O app chama de "Visualizações" | "visualizações" |
| "O Conkat cobra alguma taxa do serviço? Não." | ⚠️ | O código confirma só que o Conkat não intermedeia pagamento; "taxa" é política comercial | Trocar pela pergunta que o código comprova |
| "Os planos e valores aparecem no app." | ⚠️ | Verdade, mas o saldo só é recarregado pela equipe (compra na loja desativada) | Dizer como funciona hoje |
| Termos de uso e Política de privacidade no rodapé | ⚠️ | App aceita os termos no cadastro, mas `termsUrl` é `null`: os documentos não existem | Criar antes do lançamento (exigência da LGPD: o app coleta CPF) |
| Telas simuladas: "Elétrica", "Hidráulica", "Pintura", "Limpeza" | ❌ | Categorias reais: "Manutenção Residencial", "Limpeza e Conservação", "Construção e Reformas"… | Usar as reais |
| Telas simuladas: "Publicados agora", "Buscar serviço", "Documento verificado" | ⚠️ | App: "Publicados recentemente", "Eletricista, diarista, montador…", "Verificado" | Usar os textos do app |

## 5. Reescrita do título (homepage-audit, fase 3)

**Atual:** "Encontre um profissional na sua cidade e chame no WhatsApp."
**Por que é fraco:** genérico (vale para qualquer concorrente e qualquer cidade) e omite os diferenciais.

**Reescrito (escolhido):** "Profissionais verificados de Joinville e região, direto no seu WhatsApp."
**Por que é mais forte:** nomeia o lugar, a prova (verificados) e o mecanismo (WhatsApp).

**Alternativa:** "Precisa de alguém para um serviço em Joinville e região? Ache e chame no WhatsApp."

## 6. Prioridades

| Correção | Impacto | Esforço | Prioridade |
|---|---|---|---|
| Tirar "Disponível" e os selos até o app estar nas lojas | 5 | 1 | Esta semana (script) |
| Região e verificação no título | 5 | 1 | Esta semana (script) |
| Corrigir avaliações, verificação, métricas e categorias | 4 | 1 | Esta semana (script) |
| Escrever Termos de Uso e Política de Privacidade | 5 | 3 | Este mês |
| Definir canal de contato (e-mail ou WhatsApp) para dúvidas e para profissionais | 4 | 2 | Este mês |
| Lista de espera para profissionais antes do lançamento | 4 | 3 | Este mês |
| Confirmar os preços de produção (seed: a partir de R$ 1 por dia) e publicar no site | 3 | 1 | Depois |

## 7. Autocrítica

- Não medi velocidade nem acessibilidade real: o site ainda é um design, não código.
- Preços vêm do seed da API; podem ser diferentes em produção.
- Prova social ficará fraca até haver avaliações e profissionais reais; não inventei números.
- Concorrentes citados (GetNinjas, OLX, grupos) servem só ao posicionamento; o site não os nomeia.
