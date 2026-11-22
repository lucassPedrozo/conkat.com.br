# Publicação automática no Instagram

O robô ([`.github/workflows/instagram.yml`](../../.github/workflows/instagram.yml)) roda de hora em hora no
GitHub Actions. Quando chega o horário do dia na pauta (horário de Brasília, `HORARIOS` em
[`calendario.mjs`](calendario.mjs)), ele publica o post de [`calendario/`](calendario/) daquele dia com a
legenda, e logo depois o story. Se o post do dia já está no perfil, ele não publica de novo.

Tudo é gratuito: API do Instagram, conta de desenvolvedor da Meta e GitHub Actions (o repositório é público).

## Rotina

1. Edite a pauta em `brand/instagram/calendario.mjs`.
2. Gere as imagens: `node brand/gerar-calendario.mjs --inicio AAAA-MM-DD`.
3. Faça commit e leve para a **branch padrão** do repositório (o GitHub só roda tarefas agendadas dela).

Pronto: cada post sai sozinho no seu dia. As imagens precisam estar no repositório porque a API do
Instagram baixa a imagem por um endereço público (`raw.githubusercontent.com`). Como o repositório é
público, os posts dos próximos dias ficam visíveis lá antes de sair no Instagram.

## Configurar uma vez

### 1. Conta do Instagram

No app do Instagram: **Configurações → Tipo de conta e ferramentas → Mudar para conta profissional**
(Empresa ou Criador de conteúdo). É gratuito.

### 2. App na Meta e token

Os nomes dos menus da Meta mudam com frequência; se algo estiver diferente, procure pelos termos em negrito.

1. Entre em <https://developers.facebook.com> com o Facebook de quem administra o Instagram e crie um app
   (tipo **Empresa** / **Business**).
2. Escolha **um** dos dois caminhos:

**Caminho A — login do Instagram (mais rápido).**
No app, adicione o produto **Instagram** e abra **API setup with Instagram business login**. Adicione a
conta do Conkat, autorize e clique em **Generate token**. Copie o token e o **id da conta** (Instagram
user ID) que aparecem ali.
O token vale **60 dias**: anote na agenda para gerar outro antes de vencer (e trocar o segredo no
GitHub). Se vencer, o robô falha e o GitHub manda um e-mail avisando.

**Caminho B — login do Facebook com usuário do sistema (token que não vence).**
Precisa de uma Página do Facebook ligada ao Instagram e de um portfólio no
<https://business.facebook.com>. Em **Configurações do negócio → Usuários do sistema**, crie um usuário do
sistema (admin), dê acesso à Página, ao Instagram e ao app, e gere um token com as permissões
`instagram_basic`, `instagram_content_publish`, `pages_show_list` e `pages_read_engagement`, sem
validade. O id da conta do Instagram aparece no **Graph API Explorer** em
`me/accounts?fields=instagram_business_account`.
Neste caminho, crie também a variável `IG_API_HOST` = `graph.facebook.com` (passo 3).

Enquanto o app estiver em modo de desenvolvimento, ele publica normalmente na conta de quem tem função
no app (administrador ou testador), que é o nosso caso. Não é preciso enviar o app para revisão da Meta.

### 3. Segredos no GitHub

No repositório: **Settings → Secrets and variables → Actions**.

| Tipo | Nome | Valor |
|---|---|---|
| Secret | `IG_USER_ID` | id da conta do Instagram |
| Secret | `IG_ACCESS_TOKEN` | o token |
| Variable (só caminho B) | `IG_API_HOST` | `graph.facebook.com` |
| Variable (opcional) | `IG_API_VERSION` | versão da API, se a padrão (`v24.0`) for desativada |

Nunca cole o token em arquivo, commit ou mensagem: só no segredo.

### 4. Testar

Em **Actions → Instagram → Run workflow**:

- **modo `teste`**: confere a pauta do dia e se as imagens estão acessíveis em JPEG, sem publicar.
- **modo `publicar`**: publica na hora o post da data escolhida (sem esperar o horário). Use para o primeiro
  post e para conferir que o token funciona.
- **so `story`**: publica só o story, caso ele tenha falhado depois do post.

## Se der erro

O resumo de cada execução (aba Actions) mostra o que o robô fez. Erros comuns:

| Mensagem | O que fazer |
|---|---|
| `faltam IG_USER_ID e IG_ACCESS_TOKEN` | Criar os segredos (passo 3) |
| `Error validating access token` / código 190 | Token vencido ou revogado: gerar outro e trocar o segredo |
| `imagem não acessível` | As imagens do dia não estão no commit da branch padrão: rode o gerador, faça commit e envie |
| código 9004 / 2207052 | A Meta não conseguiu baixar a imagem: confira se o repositório continua público |
| `Nada na pauta para…` | Não há post gerado para o dia: rode `gerar-calendario.mjs` com novas datas |

Limites: até 10 slides por carrossel, legenda com até 2.200 caracteres e 30 hashtags, e um limite diário
de publicações pela API bem acima do que usamos. Stories pela API não têm stickers (link, enquete).
