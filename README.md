# Bolão da Copa gdg BH

Aplicativo web estático para organizar um bolão de jogos da Copa para o grupo **gdg BH**, inspirado nas cores e no visual limpo dos produtos Google.

## Recursos

- Login local por nome e e-mail.
- Cadastro de palpites por partida.
- Pontuação automática por resultado correto e placar exato.
- Multiplicador de gols quando o placar é cravado.
- Ranking com participantes simulados e destaque para o usuário atual.
- Persistência em `localStorage`, sem backend.
- Projeto pronto para deploy estático na Vercel.

## Regras de pontuação

- **3 pontos** ao acertar o resultado do jogo: vitória do mandante, empate ou vitória do visitante.
- **5 pontos** adicionais ao acertar o placar exato.
- **Multiplicador de gols:** quando o placar é exato, cada lado cravado dobra o bônus do jogo. Um placar exato tem os dois lados corretos, então o total recebe multiplicador **×4**.

## Como executar localmente

Abra o arquivo `index.html` no navegador ou sirva a pasta com um servidor estático:

```bash
npm run dev
```

Depois acesse `http://localhost:3000`.

## Deploy na Vercel

Este repositório já inclui `package.json` e `vercel.json`, então a Vercel consegue iniciar o projeto sem configuração extra. O `framework: null` evita que a Vercel tente usar presets de documentação como VitePress (`vitepress build docs`).

1. Importe o repositório na Vercel.
2. Use as configurações detectadas automaticamente ou selecione **Other** como framework.
3. Confirme que o Build Command é `npm run build` — não use `vitepress build docs`.
4. A saída publicada é a pasta `dist/`, gerada automaticamente com `index.html`, `style.css`, `main.js` e `health.json`.

Também é possível testar a validação localmente:

```bash
npm run build
```

## Estrutura

- `index.html`: marcação semântica da landing, login, palpites e ranking.
- `style.css`: CSS final usado pelo navegador.
- `style.scss`: cópia editável do estilo para quem quiser evoluir com Sass.
- `main.js`: regras do bolão, persistência local e renderização otimizada.
- `vercel.json`: configuração de deploy estático, URLs limpas e headers básicos.
- `scripts/build-static-app.js`: validação leve e cópia dos arquivos públicos para `dist/`.

## Solução para erro de VitePress na Vercel

Se o deploy mostrar `Command "vitepress build docs" exited with 127`, a Vercel está tentando usar um preset de documentação que este projeto não usa. Este app é estático e deve usar:

- Framework Preset: **Other**
- Build Command: `npm run build`
- Output Directory: `dist`

Esses valores já estão definidos no `vercel.json`; se houver override manual no painel da Vercel, remova o override ou atualize com os valores acima.
