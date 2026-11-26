// Texto do site. Cada frase foi conferida contra o app, a API e as notas do projeto
// (ver figma/AUDITORIA-COPY.md). Para mudar o texto, mude só aqui.

/** Troque para true quando o app estiver na App Store e no Google Play. */
export const APP_LIVE = false;

export const STORE_LINKS = {
  appStore: '', // preencher no lançamento
  googlePlay: '',
};

export const INSTAGRAM = {
  handle: '@conkat.app',
  url: 'https://www.instagram.com/conkat.app/',
  follow: 'Seguir @conkat.app',
};

export const SITE = {
  title: 'Conkat — profissionais verificados de Joinville e região',
  description:
    'Encontre profissionais verificados de Joinville e região. Veja preço e avaliações e chame direto no WhatsApp, sem criar conta.',
};

export const NAV = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#profissionais', label: 'Para profissionais' },
  { href: '#duvidas', label: 'Dúvidas' },
  { href: '/apoie', label: 'Apoie o projeto' },
];

/** Cidades atendidas, na ordem da folha "Onde você procura?" do app. */
export const CITIES = ['Joinville', 'Jaraguá do Sul', 'Araquari', 'São Francisco do Sul', 'Guaramirim'];

export const HERO = {
  title: 'Profissionais verificados de Joinville e região.',
  text: 'Manutenção, limpeza, reformas, beleza, aulas, mudanças e outros serviços. Veja preço e avaliações e chame direto no WhatsApp, sem criar conta.',
  soon: 'Em breve na App Store e no Google Play',
  secondary: 'Sou profissional',
};

export const STEPS = [
  {
    title: 'Escolha a cidade',
    text: 'O Conkat começa pelo Norte de Santa Catarina, a partir de Joinville. O app mostra só as cidades que já têm profissionais anunciando.',
  },
  {
    title: 'Busque o serviço',
    text: 'Pesquise pelo que precisa ou navegue pelas categorias. Dá para filtrar por tipo de preço e ordenar por preço ou pelos mais recentes.',
  },
  {
    title: 'Chame no WhatsApp',
    text: 'Todo anúncio tem o botão Chamar no WhatsApp. A conversa é direto com o profissional: preço, data e horário vocês combinam ali.',
  },
];

// "O que você vê antes de chamar": um anúncio do app com marcadores numerados.
export const FEATURES = {
  kicker: 'O que o anúncio mostra',
  title: 'Antes de chamar, você já sabe.',
  text: 'Em vez de pedir indicação em grupo e torcer, você compara os anúncios com o que importa já à vista, antes da primeira mensagem.',
  points: [
    { title: 'Como o profissional cobra', text: 'Valor fixo, a partir de, por hora, por dia ou a combinar.' },
    { title: 'Avaliações', text: 'Nota de 1 a 5 estrelas, com a média e o total. Anúncio sem nota aparece como ainda não avaliado.' },
    { title: 'Selo Verificado', text: 'Todo profissional tem o CPF ou CNPJ conferido pela equipe do Conkat antes de publicar.' },
  ],
  review: { title: 'Revisado pela equipe', text: 'Nenhum anúncio vai ao ar sem passar pela revisão da equipe do Conkat.' },
} as const;

export const PRO = {
  kicker: 'Para quem presta serviço',
  title: 'Anuncie no Conkat. O cliente chama no seu WhatsApp.',
  text: 'Apareça para quem procura o seu serviço em Joinville e região, com o seu preço, as suas fotos e as avaliações de quem já contratou você.',
  // Condições, lidas como uma tabela: rótulo, valor e detalhe.
  terms: [
    { label: 'Primeiro anúncio', value: '14 dias sem custo', text: 'Contados a partir da aprovação.' },
    { label: 'Contato de cliente', value: 'R$ 0', text: 'Sem taxa por contato e sem comissão.' },
    { label: 'Pagamento', value: 'Direto com o cliente', text: 'O Conkat não intermedeia o pagamento.' },
  ],
  caption: 'Tela Desempenho do app: quantas vezes o seu anúncio apareceu nas buscas e quantas pessoas o abriram.',
  stepsTitle: 'Do cadastro ao anúncio no ar',
  steps: [
    { title: 'Cadastro com CPF ou CNPJ', text: 'Confirme seu e-mail e envie o documento. A equipe confere antes do seu primeiro anúncio.' },
    { title: 'Anúncio em cinco etapas', text: 'Categoria, descrição, preço e área de atendimento, fotos e revisão final.' },
    { title: 'Revisão da equipe', text: 'Se algo precisar de ajuste, você recebe o motivo no app e reenvia.' },
    { title: 'No ar e crescendo', text: 'Acompanhe quantas vezes o anúncio apareceu e foi aberto. Impulsione para sair antes dos outros, com o selo Destaque.' },
  ],
  cta: 'Começar a anunciar',
  soon: 'O cadastro é feito pelo app, que chega em breve à App Store e ao Google Play.',
} as const;

export const FAQ_TITLE = 'Dúvidas frequentes';
export const FAQ = [
  ['Preciso de conta para contratar?', 'Não. Buscar, salvar e avaliar anúncios não exige cadastro. Só profissionais que anunciam têm conta.'],
  ['O pagamento do serviço passa pelo Conkat?', 'Não. O Conkat não intermedeia pagamentos. Preço e forma de pagamento são combinados direto com o profissional.'],
  ['O Conkat garante o serviço?', 'Não. O Conkat confere o CPF ou CNPJ de quem anuncia e revisa cada anúncio antes de publicar, mas o serviço é contratado direto com o profissional. Use as avaliações para escolher e combine tudo pelo WhatsApp.'],
  ['Quem pode avaliar um anúncio?', 'Qualquer pessoa com o app, uma vez por aparelho. A avaliação é só a nota, de 1 a 5 estrelas.'],
  ['Quanto custa anunciar?', 'O primeiro anúncio fica 14 dias no ar sem custo, contados a partir da aprovação. Depois, a publicação é paga com o saldo da conta, e os planos aparecem no app. Por enquanto, o saldo é recarregado pela equipe do Conkat.'],
] as const;

/** Aparece no fim das dúvidas enquanto o app não está nas lojas (APP_LIVE = false). */
export const FAQ_SOON = ['Quando o app chega?', 'Em breve, na App Store e no Google Play. Siga o @conkat.app no Instagram para saber do lançamento.'] as const;

export const DOWNLOAD = { title: 'Baixe o Conkat', text: 'Disponível para iPhone e Android.' };

export const FOOTER = {
  tagline: 'Profissionais verificados de Joinville e região, com preço, avaliações e contato direto no WhatsApp.',
  cta: {
    title: 'O app chega em breve',
    text: 'Siga o @conkat.app no Instagram para saber quando o Conkat estiver na App Store e no Google Play.',
  },
  nav: [
    { href: '#como-funciona', label: 'Como funciona' },
    { href: '#anuncio', label: 'O que o anúncio mostra' },
    { href: '#profissionais', label: 'Para profissionais' },
    { href: '#duvidas', label: 'Dúvidas frequentes' },
  ],
  // Os links sem endereço não aparecem. Os documentos ainda não existem (ver auditoria).
  links: [
    { href: '/apoie', label: 'Apoie o projeto' },
    { href: '', label: 'Termos de uso' },
    { href: '', label: 'Política de privacidade' },
  ],
  regionTitle: 'Onde funciona',
  regionNote: 'e outras cidades do Norte de Santa Catarina',
  // O CNPJ só aparece quando for preenchido (o anterior era um número de exemplo).
  cnpj: '',
  legal: '© 2026 Conkat. Joinville, SC.',
};

// Página "Apoie o projeto" (/apoie). O link fica no rodapé; a página tem noindex e não entra no sitemap.
// Nome e cidade vão no código Pix (máx. 25 e 15 caracteres, sem acento); o banco de quem paga
// mostra o nome do titular da chave na confirmação.
export const SUPPORT = {
  pixKey: '128f6a68-a6b4-445a-9b41-6367fa75d959',
  pixName: 'CONKAT',
  pixCity: 'JOINVILLE',
  title: 'Apoie o projeto',
  text: 'O Conkat está sendo construído em Joinville para aproximar quem precisa de um serviço de quem sabe fazer. Se você acredita na ideia, pode ajudar o projeto a seguir em frente com qualquer valor, pelo Pix.',
  thanks: 'Obrigado pelo apoio.',
};
