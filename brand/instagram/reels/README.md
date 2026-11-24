# Reels do Conkat

Cada reels fica numa pasta `AAAA-MM-DD-nome/` com:

| Arquivo | O que é |
|---|---|
| `reel.mp4` | O vídeo, 1080 × 1920, H.264 + AAC, até 90 s |
| `capa.jpg` | A capa do reels (1080 × 1920) |
| `legenda.txt` | A legenda, com as hashtags no fim |

## Publicar

1. Faça commit da pasta e leve para a branch padrão.
2. Em **Actions → Instagram Reels → Run workflow**, informe a pasta:
   - modo `teste`: confere arquivos e token, sem publicar;
   - modo `publicar`: publica o reels (também aparece no feed).

O script é [`../../publicar-reels.mjs`](../../publicar-reels.mjs) e usa os mesmos segredos do robô de
posts ([`../PUBLICAR.md`](../PUBLICAR.md)). Se o reels já está no perfil, ele não publica de novo.

Pela API não dá para usar músicas da biblioteca do Instagram: o reels sai com o áudio do próprio arquivo.

## Reels publicados

| Pasta | Conteúdo |
|---|---|
| `2026-11-24-qual-servico` | Lançamento: "Qual [serviço] você procura?" com cards do app, 15 s. Feito em Remotion (projeto `conkat.video`), só com efeitos sonoros |
