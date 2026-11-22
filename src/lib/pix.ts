// Código Pix estático ("copia e cola"), no padrão BR Code do Banco Central (EMV QRCPS-MPM).
// Sem valor: quem paga digita o valor no app do banco.

const field = (id: string, value: string) => id + String(value.length).padStart(2, '0') + value;

/** Remove acentos e caracteres fora do padrão, e corta no tamanho máximo do campo. */
const clean = (s: string, max: number) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9 .-]/g, '').trim().slice(0, max);

/** CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF), exigido no campo 63. */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(payload)) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function pixPayload({ key, name, city, txid = '***' }: { key: string; name: string; city: string; txid?: string }): string {
  const body =
    field('00', '01') +
    field('26', field('00', 'br.gov.bcb.pix') + field('01', key)) +
    field('52', '0000') +
    field('53', '986') +
    field('58', 'BR') +
    field('59', clean(name, 25)) +
    field('60', clean(city, 15)) +
    field('62', field('05', txid)) +
    '6304';
  return body + crc16(body);
}
