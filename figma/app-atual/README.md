# Conkat — Telas atuais do app (prints)

Prints de **todas as telas do app** ([conkat.app](../../../conkat.app)), para comparar com as telas
do site ([../conkat-telas-app](../conkat-telas-app)) e planejar a reestruturação do design.

São **34 telas** em 390 × 844 (densidade 2×). Em 8 delas há também a versão **tela inteira**,
rolada até o fim. Cada arquivo começa pelo código da tela:

| Código | Área | Telas |
| --- | --- | --- |
| V01–V14 | Visitante (sem login) | Início, cidade, busca, anúncios, filtros, ordenar, anúncio, favoritos, conta, entrar, meus anúncios |
| V15–V19 | Cadastro | Criar conta, confirmar e-mail, esqueci a senha, completar cadastro |
| P01–P08 | Profissional (logado) | Meus anúncios, conta, perfil, saldo, desempenho, impulsionar, publicar, verificar e-mail |
| A01–A07 | Novo anúncio | As 5 etapas do assistente e a edição de anúncio |

A lista completa, com nome, rota e grupo de cada tela, está em [`prints/telas.json`](prints/telas.json).

## Como levar para o Figma (Scripter)

1. Abra o arquivo **Conkat - Telas** no Figma.
2. Selecione todos os arquivos `.png` da pasta [`prints`](prints) e arraste para dentro do Figma
   (pode soltar de uma vez, em qualquer página).
3. Rode o plugin **Scripter**, apague o exemplo, cole o conteúdo inteiro de
   [`organizar.js`](organizar.js) e clique em **▶ Run**.

O script cria a página **App atual (prints)** com as seções Visitante, Cadastro, Profissional e
Novo anúncio. Cada tela vira um quadro de 390 de largura com um rótulo acima: código, nome da tela
e rota (com "tela inteira" quando for o caso). Os prints soltos são removidos depois de organizados.
Pode rodar de novo: ele refaz a página com o que encontrar, e prefere prints recém-arrastados aos
que já estavam organizados.

## Como os prints foram feitos

- Versão web do app, com os **dados de exemplo do próprio app** (`EXPO_PUBLIC_USE_MOCK=true`).
  Nomes, preços e números são esses dados de exemplo.
- **Visitante:** sem login. **Profissional:** logado como o anunciante de exemplo do app
  (a sessão de exemplo é gravada direto no armazenamento do navegador).
- Edge sem janela, controlado pelos scripts de [`captura/`](captura).

### Para refazer os prints

A exportação web em modo de desenvolvimento precisa de duas mudanças **temporárias** no
`app.json` do app, desfeitas logo depois (sem elas, os pedaços do pacote saem com o mesmo nome e
o app quebra): `"output": "single"` em `web` e `["expo-router", { "asyncRoutes": false }]` em `plugins`.

```
# no conkat.app, com as duas mudanças acima aplicadas
$env:EXPO_PUBLIC_USE_MOCK = 'true'
npx expo export --platform web --dev --max-workers 1 --output-dir <pasta>/app-web
git checkout -- app.json

# no conkat.app
node figma/app-atual/captura/servidor.mjs <pasta>/app-web      # serve em localhost:8090
node figma/app-atual/captura/capture.mjs <pasta>/shots          # tira os prints
node figma/app-atual/build.mjs <pasta>/shots                    # copia para prints/ e gera organizar.js
```

`--max-workers 1` evita que o empacotador fique sem memória em computadores com pouca RAM.
