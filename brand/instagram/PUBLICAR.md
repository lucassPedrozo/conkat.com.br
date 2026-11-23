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

Caminho usado no Conkat (login unificado, token que não vence). Os nomes dos menus da Meta mudam com
frequência; se algo estiver diferente, procure pelos termos em negrito.

1. Em <https://developers.facebook.com>, **Meus apps → Criar app**, com o caso de uso
   **Gerenciar mensagens e conteúdo no Instagram**. Pode pular o portfólio empresarial na criação.
2. No app: **Casos de uso → Personalizar → API setup with Unified login**. Ele exige um **portfólio
   empresarial** (gratuito, sem verificação): clique em **+ Portfólio empresarial** e crie o "Conkat".
3. **Criar nova configuração**: token de usuário do sistema (SUAT, não vence) e a conta do Instagram
   como ativo. A URL de redirecionamento não é necessária.
4. Em **Funções do app → Funções**, adicione a conta do Instagram como **Testador do Instagram** e aceite
   o convite no Instagram (**Configurações → Apps e sites → Convites de testador**).
5. Em **2. Gerar tokens de acesso → Adicionar conta**, escolha o portfólio e a conta. O número embaixo do
   nome da conta é o `IG_USER_ID`. Clique em **Gerar token** e copie o token.
6. Token que começa com `EAA` (login do Facebook para Empresas): crie a variável `IG_API_HOST` =
   `graph.facebook.com` (passo 3). Token que começa com `IG`: não crie a variável, e renove o token a
   cada 60 dias.

Enquanto o app estiver em modo de desenvolvimento, ele publica normalmente na conta de quem tem função
no app (administrador ou testador). Não é preciso enviar o app para análise da Meta.

### 3. Segredos no GitHub

No repositório: **Settings → Secrets and variables → Actions**.

| Tipo | Nome | Valor |
|---|---|---|
| Secret | `IG_USER_ID` | id da conta do Instagram |
| Secret | `IG_ACCESS_TOKEN` | o token |
| Variable (token `EAA…`) | `IG_API_HOST` | `graph.facebook.com` |
| Variable (opcional) | `IG_API_VERSION` | versão da API, se a padrão (`v24.0`) for desativada |

Nunca cole o token em arquivo, commit ou mensagem: só no segredo.

### 4. Testar

Em **Actions → Instagram → Run workflow**:

- **modo `teste`**: confere a pauta do dia, se as imagens estão acessíveis em JPEG e se o token funciona
  (lê o nome da conta), sem publicar.
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
