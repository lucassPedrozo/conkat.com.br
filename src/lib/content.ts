// Texto do site. Cada frase foi conferida contra o app, a API e as notas do projeto
// (ver figma/AUDITORIA-COPY.md). Para mudar o texto, mude só aqui.

/** Troque para true quando o app estiver na App Store e no Google Play. */
export const APP_LIVE = false;

export const STORE_LINKS = {
  appStore: '', // preencher no lançamento
  googlePlay: '',
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

export const FEATURES_TITLE = 'O que você vê antes de chamar';
export const FEATURES = [
  { id: 'preco', title: 'Como o profissional cobra', text: 'Valor fixo, a partir de, por hora, por dia ou a combinar.' },
  { id: 'avaliacoes', title: 'Avaliações', text: 'Nota de 1 a 5 estrelas, com a média e o total. Anúncio sem nota aparece como ainda não avaliado.' },
  { id: 'verificado', title: 'Profissionais verificados', text: 'Todo profissional tem o CPF ou CNPJ conferido pela equipe do Conkat antes de publicar.' },
  { id: 'revisao', title: 'Anúncios revisados', text: 'Nenhum anúncio vai ao ar sem passar pela revisão da equipe.' },
  { id: 'favoritos', title: 'Favoritos no celular', text: 'Salve anúncios sem criar conta. Eles ficam no aparelho e abrem sem internet.' },
] as const;

export const PRO = {
  title: 'Você presta serviço? Anuncie no Conkat.',
  text: 'Seu primeiro anúncio fica 14 dias no ar sem custo, contados a partir da aprovação. Sem cobrança por contato: quem procura chama direto no seu WhatsApp.',
  items: [
    { icon: 'seal-check', title: 'Cadastro com CPF ou CNPJ', text: 'Confirme seu e-mail e envie o documento. A equipe confere antes do seu primeiro anúncio.' },
    { icon: 'megaphone', title: 'Anúncio em cinco etapas', text: 'Categoria, descrição, preço e área de atendimento, fotos e revisão final.' },
    { icon: 'shield-check', title: 'Revisão antes de publicar', text: 'Se algo precisar de ajuste, você recebe o motivo no app e reenvia.' },
    { icon: 'lightning', title: 'Destaque nas buscas', text: 'Anúncios impulsionados aparecem antes dos outros na sua cidade, com o selo Destaque.' },
    { icon: 'chart-line-up', title: 'Desempenho do anúncio', text: 'Veja quantas vezes o anúncio apareceu em listas e buscas e quantas vezes foi aberto.' },
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
  legal: '© 2026 Conkat. CNPJ 00.000.000/0001-00',
};
