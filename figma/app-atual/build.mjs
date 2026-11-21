// Copia os prints capturados para prints/ com nomes identificados e gera organizar.js.
// Uso (da raiz do projeto): node figma/app-atual/build.mjs <pasta-dos-prints-capturados>
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = process.argv[2];
if (!src) throw new Error('Informe a pasta com os prints capturados e o telas.json');
const telas = JSON.parse(readFileSync(join(src, 'telas.json'), 'utf8'));

// Nome de arquivo seguro no Windows, com o código na frente (é por ele que o script acha o print)
const safe = (s) => s.replace(/[\\/:*?"<>|]/g, '-');
const out = join(here, 'prints');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const t of telas) {
  t.arquivo = safe(`${t.id} — ${t.nome}.png`);
  copyFileSync(join(src, `${t.id}.png`), join(out, t.arquivo));
  if (t.completa) {
    t.completa.arquivo = safe(`${t.id} — ${t.nome} (completa).png`);
    copyFileSync(join(src, `${t.id}-completa.png`), join(out, t.completa.arquivo));
  }
}
writeFileSync(join(out, 'telas.json'), JSON.stringify(telas, null, 2));

const hoje = new Date().toLocaleDateString('pt-BR');
const captura = `Capturadas em ${hoje} da versão web do app (repositório conkat.app), com os dados de exemplo do próprio app (EXPO_PUBLIC_USE_MOCK), em 390 × 844 com densidade 2×. ` +
  `Visitante: sem login. Profissional: logado como o anunciante de exemplo. "Tela inteira" mostra a tela rolada até o fim. ` +
  `Nomes, preços e números são os dados de exemplo do app.`;

const template = readFileSync(join(here, 'organizar.template.js'), 'utf8');
const meta = telas.map(({ id, grupo, nome, rota, completa }) => ({ id, grupo, nome, rota, completa: !!completa }));
let code = template.replace('/*__TELAS__*/ []', JSON.stringify(meta)).replace('/*__CAPTURA__*/ ""', JSON.stringify(captura));
if (code.includes('/*__')) throw new Error('Marcador não substituído no template');
writeFileSync(join(here, 'organizar.js'), code);
const files = readdirSync(out).filter((f) => f.endsWith('.png'));
console.log(`${telas.length} telas, ${files.length} prints em prints/, organizar.js com ${(code.length / 1024).toFixed(0)} KB`);
