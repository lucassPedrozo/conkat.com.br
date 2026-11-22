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
  label: 'Acompanhe no Instagram',
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
];

export const HERO = {
  title: 'Profissionais verificados de Joinville e região.',
  text: 'Manutenção, limpeza, reformas, beleza, aulas, mudanças e outros serviços. Veja preço e avaliações e chame direto no WhatsApp, sem criar conta.',
  soon: 'Em breve na App Store e no Google Play',
  secondary: 'Sou profissional',
};

export const STEPS = [
  {
    title: 'Escolha a cidade',
    text: 'O Conkat começa por Joinville e região. O app mostra só as cidades que já têm profissionais anunciando.',
  },
  {
    title: 'Busque o serviço',
    text: 'Pesquise pelo que precisa ou navegue pelas categorias. Dá para filtrar por tipo de preço e ordenar por preço ou pelos mais recentes.',
  },
  {
    title: 'Chame no WhatsApp',
    text: 'Todo anúncio tem WhatsApp. A conversa é direto com o profissional: preço, data e horário vocês combinam ali.',
  },
];

// "O que você vê antes de chamar": um anúncio do app com marcadores numerados.
export const FEATURES = {
  title: 'Antes de chamar, você já sabe.',
  text: 'Todo anúncio mostra como o profissional cobra, o que outras pessoas acharam do serviço e se o documento dele foi conferido.',
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
  text: 'Apareça para quem procura o seu serviço em Joinville e região. A conversa é direto com você, sem intermediário.',
  offer: [
    { value: '14 dias', text: 'no ar sem custo no primeiro anúncio, contados a partir da aprovação' },
    { value: 'R$ 0', text: 'por contato. Quem procura chama direto no seu WhatsApp' },
  ],
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
  ['Quem pode avaliar um anúncio?', 'Qualquer pessoa com o app, uma vez por aparelho. A avaliação é só a nota, de 1 a 5 estrelas.'],
  ['Quanto custa anunciar?', 'O primeiro anúncio fica 14 dias no ar sem custo, contados a partir da aprovação. Depois, a publicação é paga com o saldo da conta, e os planos aparecem no app. Por enquanto, o saldo é recarregado pela equipe do Conkat.'],
  ['Por que meu anúncio foi recusado?', 'O motivo aparece no app, junto do anúncio. Corrija o que foi apontado e envie de novo.'],
  ['Em quais cidades o Conkat funciona?', 'Em Joinville e região: Jaraguá do Sul, Araquari, São Francisco do Sul e outras cidades do Norte de Santa Catarina. O app mostra as que já têm anúncios publicados.'],
] as const;

export const DOWNLOAD = { title: 'Baixe o Conkat', text: 'Disponível para iPhone e Android.' };

export const FOOTER = {
  region: 'Joinville e região, SC',
  // Os links só aparecem quando houver endereço. Os documentos ainda não existem (ver auditoria).
  links: [
    { href: '', label: 'Termos de uso' },
    { href: '', label: 'Política de privacidade' },
  ],
  // O CNPJ só aparece quando for preenchido (o anterior era um número de exemplo).
  cnpj: '',
  legal: '© 2026 Conkat.',
};

// Página "Apoie o projeto" (/apoie). Não tem link no site nem entra no sitemap.
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
