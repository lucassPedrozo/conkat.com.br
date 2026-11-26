// Tokens do Conkat (design system 3.0) e linha do tempo do vídeo. Fonte única.

export const C = {
  ink: '#0B2B2A',
  inkSoft: '#123B39',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#5F6672',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#A7C4C2',
  primary: '#0B7A75',
  primarySoft: '#E6F4F3',
  accent: '#FDA333',
  accentText: '#A85A00',
  border: '#E5E7EB',
} as const;

export const FPS = 60; // 60 fps: movimento mais fluido que os 30 da referência
export const W = 1080;
export const H = 1920;
export const DURATION_S = 15;

// Linha do tempo (segundos): src/timeline.json, compartilhada com scripts/gerar-audio.mjs
import timeline from './timeline.json';
export const T = timeline;

// Movimento (ms) = tokens do app
export const M = {
  fast: 0.15,
  base: 0.2,
  slow: 0.25,
  sheet: 0.3,
  count: 0.6,
  reveal: 0.7,
  stagger: 0.04,
} as const;

// Exemplos de anúncio (dados de demonstração do site; o vídeo avisa "Exemplo ilustrativo")
export type Servico = {
  palavra: string;
  titulo: string;
  categoria: string;
  prefixo: string;
  valor: number;
  sufixo: string;
  nota: string;
  foto: string;
};

export const SERVICOS: Servico[] = [
  { palavra: 'eletricista', titulo: 'Eletricista residencial', categoria: 'Manutenção Residencial', prefixo: 'A partir de R$ ', valor: 100, sufixo: '', nota: '4,8', foto: 'fotos/eletricista.jpg' },
  { palavra: 'diarista', titulo: 'Diarista — limpeza completa', categoria: 'Limpeza e Conservação', prefixo: 'R$ ', valor: 180, sufixo: ' por dia', nota: '4,9', foto: 'fotos/cozinha.jpg' },
  { palavra: 'pintor', titulo: 'Pintura de apartamentos', categoria: 'Construção e Reformas', prefixo: 'R$ ', valor: 35, sufixo: ' por m²', nota: '4,7', foto: 'fotos/pintura.jpg' },
  { palavra: 'encanador', titulo: 'Encanador residencial', categoria: 'Manutenção Residencial', prefixo: 'A partir de R$ ', valor: 120, sufixo: '', nota: '4,8', foto: 'fotos/encanador.jpg' },
];
