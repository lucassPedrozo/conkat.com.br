// Conkat — pauta do Instagram. Um item por dia, na ordem em que vão ao ar.
// O script brand/gerar-calendario.mjs dá a data a cada item (a partir de --inicio) e gera as imagens.
//
// Cada post tem:
//   slug, tema (aparece no calendário), slides (1 = post único, 2+ = carrossel), legenda e hashtags.
// Cada slide escolhe um modelo (`t`) e os textos. Título terminado em "_" ganha o cursor laranja.
// Modelos: capa, tela, foto, lista, duvida, numeros, peca, final (ver gerar-calendario.mjs).
// Telas do app: home, cidade, busca, anuncio. Peças: card-busca-0..2, card-home-0..2, pro.
// Os textos seguem src/lib/content.ts (conferido contra o app). Não prometa o que o app não faz.

const BASE = ['#Conkat', '#Joinville', '#JoinvilleSC', '#NorteCatarinense'];

export const POSTS = [
  {
    slug: 'lancamento',
    tema: 'Apresentação do Conkat',
    slides: [
      { t: 'capa', estilo: 'escuro', kicker: 'Chegou o Conkat', titulo: 'Profissionais verificados de Joinville e região_', texto: 'Preço, avaliações e contato direto no WhatsApp.' },
      { t: 'tela', estilo: 'claro', tela: 'home', kicker: 'Como é', titulo: 'Busque o serviço que você precisa.', texto: 'Manutenção, limpeza, reformas, beleza, aulas, mudanças e outros serviços.' },
      { t: 'final', estilo: 'claro', titulo: 'Em breve na App Store e no Google Play.', texto: 'Siga o perfil e ative as notificações para saber quando o app chegar.' },
    ],
    legenda: `Encontrar um bom profissional não precisa ser no boca a boca.

O Conkat reúne profissionais verificados de Joinville e região: você vê como cada um cobra, o que outras pessoas acharam do serviço e chama direto no WhatsApp, sem criar conta.

O app chega em breve à App Store e ao Google Play. Siga o perfil para saber quando.`,
    hashtags: [...BASE, '#ServicosJoinville', '#JaraguaDoSul'],
  },
  {
    slug: 'como-funciona',
    tema: 'Como funciona, em 3 passos',
    slides: [
      { t: 'capa', estilo: 'laranja', kicker: 'Como funciona', titulo: 'Três passos até quem resolve.', simbolo: true },
      { t: 'tela', estilo: 'claro', tela: 'cidade', numero: '01', titulo: 'Escolha a cidade', texto: 'O app mostra só as cidades que já têm profissionais anunciando.' },
      { t: 'tela', estilo: 'claro', tela: 'busca', numero: '02', titulo: 'Busque o serviço', texto: 'Pesquise ou navegue pelas categorias. Filtre por tipo de preço.' },
      { t: 'tela', estilo: 'claro', tela: 'anuncio', numero: '03', titulo: 'Chame no WhatsApp', texto: 'A conversa é direto com o profissional: preço, data e horário vocês combinam ali.' },
    ],
    legenda: `Como funciona o Conkat:

1. Escolha a cidade. Começamos por Joinville e região.
2. Busque o serviço, pela pesquisa ou pelas categorias.
3. Chame no WhatsApp. Todo anúncio tem, e a conversa é direto com o profissional.

Sem cadastro para quem contrata. Salve este post para lembrar depois.`,
    hashtags: [...BASE, '#Servicos', '#DicaDeCasa'],
  },
  {
    slug: 'selo-verificado',
    tema: 'Selo Verificado',
    slides: [
      { t: 'peca', estilo: 'claro', pecas: ['pro'], kicker: 'Selo Verificado', titulo: 'Documento conferido antes de publicar_', texto: 'Todo profissional tem o CPF ou CNPJ conferido pela equipe do Conkat antes de publicar.' },
    ],
    legenda: `Viu o selo Verificado no anúncio? Ele quer dizer que a equipe do Conkat conferiu o CPF ou o CNPJ do profissional antes de publicar.

E tem mais: nenhum anúncio vai ao ar sem passar pela revisão da equipe.`,
    hashtags: [...BASE, '#Seguranca', '#ProfissionaisVerificados'],
  },
  {
    slug: 'duvida-conta',
    tema: 'Dúvida: preciso de conta?',
    slides: [
      { t: 'duvida', pergunta: 'Preciso de conta para contratar?', resposta: 'Não. Buscar, salvar e avaliar anúncios não exige cadastro. Só profissionais que anunciam têm conta.', destaque: 'Não.' },
    ],
    legenda: `Não precisa de conta para contratar pelo Conkat.

Buscar, salvar anúncios e avaliar não exigem cadastro. Só quem anuncia tem conta.

Tem outra dúvida? Manda aqui nos comentários.`,
    hashtags: [...BASE, '#Duvidas'],
  },
  {
    slug: 'categoria-eletricista',
    tema: 'Categoria: eletricista',
    slides: [
      { t: 'foto', foto: 'eletricista.jpg', chip: ['raio', 'Eletricista'], peca: 'card-busca-2', titulo: 'Eletricistas verificados em Joinville e região.', texto: 'Veja o preço e as avaliações antes de chamar.' },
    ],
    legenda: `Tomada, disjuntor, chuveiro, instalação nova: no Conkat você encontra eletricistas da sua cidade, vê como cada um cobra e chama direto no WhatsApp.`,
    hashtags: [...BASE, '#Eletricista', '#EletricistaJoinville', '#Manutencao'],
  },
  {
    slug: 'dica-eletrica',
    tema: 'Dica: sinais de problema na parte elétrica',
    slides: [
      { t: 'capa', estilo: 'escuro', kicker: 'Dica de casa', titulo: '5 sinais de que é hora de chamar um eletricista_', simbolo: true },
      { t: 'lista', estilo: 'claro', numerada: true, titulo: 'Fique de olho', itens: [
        [null, 'Disjuntor que desarma sempre', 'Pode ser sobrecarga ou curto no circuito.'],
        [null, 'Luz piscando sem motivo', 'Conexão frouxa ou fiação gasta.'],
        [null, 'Tomada ou interruptor quente', 'Calor no espelho não é normal.'],
        [null, 'Cheiro de queimado', 'Desligue o circuito e não use a tomada.'],
        [null, 'Choque ao encostar em aparelhos', 'Sinal de falta de aterramento.'],
      ] },
      { t: 'final', estilo: 'escuro', titulo: 'Não deixe para depois.', texto: 'Ache um eletricista verificado perto de você no Conkat.' },
    ],
    legenda: `Problema elétrico não espera. Se aparecer algum destes sinais em casa, chame um eletricista:

⚡ disjuntor que desarma sempre
⚡ luz piscando sem motivo
⚡ tomada ou interruptor quente
⚡ cheiro de queimado
⚡ choque ao encostar em aparelhos

Com cheiro de queimado, desligue o circuito no quadro antes de qualquer coisa. Salve e compartilhe com quem mora com você.`,
    hashtags: [...BASE, '#DicaDeCasa', '#Eletricista', '#SegurancaEmCasa'],
  },
  {
    slug: 'cidades',
    tema: 'Onde o Conkat funciona',
    slides: [
      { t: 'lista', estilo: 'escuro', kicker: 'Onde funciona', titulo: 'Joinville e região_', itens: [
        ['pin', 'Joinville'], ['pin', 'Jaraguá do Sul'], ['pin', 'Araquari'], ['pin', 'São Francisco do Sul'], ['pin', 'E outras cidades do Norte de SC'],
      ], nota: 'O app mostra as cidades que já têm anúncios publicados.' },
    ],
    legenda: `O Conkat começa pelo Norte de Santa Catarina: Joinville, Jaraguá do Sul, Araquari, São Francisco do Sul e outras cidades da região.

O app mostra só as cidades que já têm profissionais anunciando. Sua cidade ainda não aparece? Conta pra gente nos comentários.`,
    hashtags: [...BASE, '#JaraguaDoSul', '#Araquari', '#SaoFranciscoDoSul'],
  },
  {
    slug: 'para-profissionais',
    tema: 'Para profissionais: anuncie',
    slides: [
      { t: 'numeros', estilo: 'teal', kicker: 'Para quem presta serviço', titulo: 'Anuncie no Conkat. O cliente chama no seu WhatsApp.', numeros: [['14 dias', 'no ar sem custo no primeiro anúncio'], ['R$ 0', 'por contato recebido']] },
    ],
    legenda: `Presta serviço em Joinville e região? Anuncie no Conkat.

O primeiro anúncio fica 14 dias no ar sem custo, contados a partir da aprovação. E quem procura chama direto no seu WhatsApp, sem intermediário e sem taxa por contato.

O cadastro é feito pelo app, que chega em breve.`,
    hashtags: [...BASE, '#Autonomo', '#PrestadorDeServico', '#Empreender'],
  },
  {
    slug: 'antes-de-chamar',
    tema: 'O que o anúncio mostra',
    slides: [
      { t: 'capa', estilo: 'claro', kicker: 'No anúncio', titulo: 'Antes de chamar, você já sabe_' },
      { t: 'peca', estilo: 'laranja', pecas: ['card-busca-0', 'card-busca-1', 'card-busca-2'], numero: '01', titulo: 'Como o profissional cobra', texto: 'Valor fixo, a partir de, por hora, por dia ou a combinar.' },
      { t: 'peca', estilo: 'laranja', pecas: ['card-home-0', 'card-home-1', 'card-home-2'], numero: '02', titulo: 'O que acharam do serviço', texto: 'Nota de 1 a 5 estrelas, com a média e o total.' },
      { t: 'peca', estilo: 'laranja', pecas: ['pro'], numero: '03', titulo: 'Se o documento foi conferido', texto: 'O selo Verificado aparece no anúncio quando a equipe confere o CPF ou CNPJ.' },
    ],
    legenda: `Antes de chamar, você já sabe:

✔ como o profissional cobra: valor fixo, a partir de, por hora, por dia ou a combinar
✔ o que outras pessoas acharam do serviço, com nota de 1 a 5
✔ se o CPF ou CNPJ foi conferido pela equipe

Sem surpresa na hora de conversar.`,
    hashtags: [...BASE, '#Servicos', '#Avaliacoes'],
  },
  {
    slug: 'categoria-limpeza',
    tema: 'Categoria: limpeza',
    slides: [
      { t: 'foto', foto: 'cozinha.jpg', chip: ['vassoura', 'Limpeza e Conservação'], peca: 'card-home-1', titulo: 'Diaristas e faxina em Joinville e região.', texto: 'Compare preços e avaliações antes de chamar.' },
    ],
    legenda: `Casa em ordem para o fim de ano? No Conkat você encontra diaristas e serviços de limpeza da sua cidade, vê o preço e as avaliações e chama direto no WhatsApp.`,
    hashtags: [...BASE, '#Diarista', '#Faxina', '#Limpeza'],
  },
  {
    slug: 'duvida-pagamento',
    tema: 'Dúvida: o pagamento passa pelo Conkat?',
    slides: [
      { t: 'duvida', pergunta: 'O pagamento passa pelo Conkat?', resposta: 'Não. O Conkat não intermedeia pagamentos. Preço e forma de pagamento são combinados direto com o profissional.', destaque: 'Não.' },
    ],
    legenda: `O Conkat não intermedeia pagamentos.

Preço e forma de pagamento você combina direto com o profissional, na conversa pelo WhatsApp.`,
    hashtags: [...BASE, '#Duvidas'],
  },
  {
    slug: 'profissionais-passos',
    tema: 'Para profissionais: do cadastro ao anúncio',
    slides: [
      { t: 'capa', estilo: 'teal', kicker: 'Para profissionais', titulo: 'Do cadastro ao anúncio no ar_', simbolo: true },
      { t: 'lista', estilo: 'claro', numerada: true, titulo: 'Quatro etapas', itens: [
        [null, 'Cadastro com CPF ou CNPJ', 'Confirme o e-mail e envie o documento.'],
        [null, 'Anúncio em cinco etapas', 'Categoria, descrição, preço e área, fotos e revisão.'],
        [null, 'Revisão da equipe', 'Se algo precisar de ajuste, o motivo aparece no app.'],
        [null, 'No ar e crescendo', 'Veja quantas vezes o anúncio apareceu e foi aberto.'],
      ] },
      { t: 'final', estilo: 'teal', titulo: 'O primeiro anúncio fica 14 dias no ar sem custo.', texto: 'O cadastro é feito pelo app, que chega em breve.' },
    ],
    legenda: `Do cadastro ao anúncio no ar:

1. Cadastro com CPF ou CNPJ. A equipe confere antes do primeiro anúncio.
2. Anúncio em cinco etapas: categoria, descrição, preço e área de atendimento, fotos e revisão.
3. Revisão da equipe. Se algo precisar de ajuste, você recebe o motivo no app e reenvia.
4. No ar. Acompanhe quantas vezes o anúncio apareceu e foi aberto.

O primeiro anúncio fica 14 dias no ar sem custo, contados a partir da aprovação.`,
    hashtags: [...BASE, '#Autonomo', '#PrestadorDeServico'],
  },
  {
    slug: 'dica-whatsapp',
    tema: 'Dica: o que combinar no WhatsApp',
    slides: [
      { t: 'capa', estilo: 'laranja', kicker: 'Dica', titulo: 'O que combinar antes do serviço_', simbolo: true },
      { t: 'lista', estilo: 'claro', titulo: 'Na conversa', itens: [
        ['whatsapp', 'Preço e forma de pagamento', 'Tudo direto com o profissional.'],
        ['relogio', 'Data e horário', 'E quanto tempo o serviço deve levar.'],
        ['chave', 'O que está incluso', 'Material, deslocamento, limpeza no fim.'],
        ['pin', 'Endereço e acesso', 'Portaria, estacionamento, horário do prédio.'],
      ] },
    ],
    legenda: `No Conkat a conversa é direto com o profissional. Antes de fechar, combine:

💬 preço e forma de pagamento
💬 data e horário
💬 o que está incluso (material, deslocamento)
💬 endereço e acesso ao local

Fica tudo registrado no WhatsApp. Salve para usar na próxima vez.`,
    hashtags: [...BASE, '#DicaDeCasa', '#Servicos'],
  },
  {
    slug: 'categoria-pintura',
    tema: 'Categoria: pintura',
    slides: [
      { t: 'foto', foto: 'pintura.jpg', chip: ['pincel', 'Construção e Reformas'], peca: 'card-home-2', titulo: 'Pintura para deixar a casa pronta para as festas.', texto: 'Pintores da sua cidade, com preço e avaliações.' },
    ],
    legenda: `Dezembro chegou e a casa pede uma pintura nova? No Conkat você encontra pintores de Joinville e região, vê como cada um cobra e chama direto no WhatsApp.`,
    hashtags: [...BASE, '#Pintura', '#Pintor', '#Reforma'],
  },
  {
    slug: 'avalie',
    tema: 'Avaliações',
    slides: [
      { t: 'peca', estilo: 'laranja', pecas: ['pro'], kicker: 'Contratou?', titulo: 'Deixe sua nota_', texto: 'Qualquer pessoa com o app pode avaliar, uma vez por aparelho. A nota vai de 1 a 5 estrelas.' },
    ],
    legenda: `Contratou alguém pelo Conkat? Deixe sua nota.

Qualquer pessoa com o app pode avaliar, uma vez por aparelho, de 1 a 5 estrelas. A sua avaliação ajuda quem procura depois de você.`,
    hashtags: [...BASE, '#Avaliacoes'],
  },
];

/** Horário sugerido por dia da semana (0 = domingo). */
export const HORARIOS = ['11:00', '18:30', '18:30', '18:30', '18:30', '18:30', '10:00'];
