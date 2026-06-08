/**
 * Bolão da Copa gdg BH
 * ------------------------------------------------------------
 * Aplicação 100% estática, pronta para Vercel, sem backend e sem
 * dependências de runtime. O estado fica em localStorage para que
 * cada participante mantenha login e palpites no próprio navegador.
 */

// Chaves versionadas: facilitam migrar dados no futuro sem quebrar usuários antigos.
const STORAGE_KEYS = Object.freeze({
  user: 'gdg-bh-bolao:v1:user',
  predictions: 'gdg-bh-bolao:v1:predictions',
});

// Regras centralizadas para evitar números mágicos espalhados pela tela.
const SCORE_RULES = Object.freeze({
  correctOutcome: 3,
  exactScore: 5,
  exactGoalMultiplier: 2,
});

// Lista seedada de partidas. Em produção, este array pode ser trocado por JSON estático.
const MATCHES = Object.freeze([
  {
    id: 'bra-ser',
    stage: 'Grupo G',
    date: '11 jun • 16:00',
    home: 'Brasil',
    away: 'Sérvia',
    homeFlag: '🇧🇷',
    awayFlag: '🇷🇸',
    result: { home: 2, away: 0 },
  },
  {
    id: 'arg-mex',
    stage: 'Grupo C',
    date: '12 jun • 19:00',
    home: 'Argentina',
    away: 'México',
    homeFlag: '🇦🇷',
    awayFlag: '🇲🇽',
    result: { home: 1, away: 1 },
  },
  {
    id: 'esp-ger',
    stage: 'Grupo E',
    date: '13 jun • 15:00',
    home: 'Espanha',
    away: 'Alemanha',
    homeFlag: '🇪🇸',
    awayFlag: '🇩🇪',
    result: { home: 3, away: 2 },
  },
  {
    id: 'jap-cro',
    stage: 'Oitavas',
    date: '16 jun • 11:00',
    home: 'Japão',
    away: 'Croácia',
    homeFlag: '🇯🇵',
    awayFlag: '🇭🇷',
    result: { home: 0, away: 2 },
  },
]);

// Ranking inicial para que a experiência já pareça viva no primeiro acesso.
const SEEDED_PLAYERS = Object.freeze([
  { name: 'Luiza Dev', points: 21, exact: 2 },
  { name: 'Rafa Cloud', points: 17, exact: 1 },
  { name: 'Bruno Android', points: 14, exact: 1 },
  { name: 'Carol Firebase', points: 10, exact: 0 },
]);

// Cache de seletores: evita buscas repetidas no DOM a cada interação.
const elements = {
  loginCard: document.querySelector('#loginCard'),
  dashboard: document.querySelector('#dashboard'),
  loginForm: document.querySelector('#loginForm'),
  nameInput: document.querySelector('#nameInput'),
  emailInput: document.querySelector('#emailInput'),
  logoutButton: document.querySelector('#logoutButton'),
  welcomeName: document.querySelector('#welcomeName'),
  matchesList: document.querySelector('#matchesList'),
  totalPoints: document.querySelector('#totalPoints'),
  exactScores: document.querySelector('#exactScores'),
  savedPredictions: document.querySelector('#savedPredictions'),
  leaderboard: document.querySelector('#leaderboard'),
};

// Estado em memória: lê localStorage uma vez e só persiste quando algo muda.
const state = {
  user: null,
  predictions: {},
};

/** Lê JSON do localStorage com fallback seguro para navegadores em modo restrito. */
const loadJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

/** Salva JSON e ignora falhas de quota/permissão para não travar a interface. */
const saveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sem backend por enquanto: se o navegador bloquear localStorage, o app segue em memória.
  }
};

/** Normaliza input numérico: vazio continua vazio; número válido fica entre 0 e 15. */
const normalizeGoalInput = (value) => {
  if (value === '') return '';

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return '';

  return String(Math.min(Math.max(parsed, 0), 15));
};

/** Transforma um placar em resultado comparável: mandante, visitante ou empate. */
const getOutcome = ({ home, away }) => {
  if (home > away) return 'home';
  if (home < away) return 'away';
  return 'draw';
};

/** Verifica se o palpite tem os dois lados preenchidos. */
const hasCompletePrediction = (prediction) => prediction?.home !== '' && prediction?.away !== '';

/**
 * Calcula pontuação de um jogo.
 * - Resultado correto: +3
 * - Placar exato: +5
 * - Placar exato recebe multiplicador por gols cravados (2 gols corretos => ×4)
 */
const calculateMatchScore = (prediction, result) => {
  if (!hasCompletePrediction(prediction)) {
    return { points: 0, exact: false, goalMultiplier: 1, correctGoals: 0 };
  }

  const guessed = {
    home: Number(prediction.home),
    away: Number(prediction.away),
  };

  const exact = guessed.home === result.home && guessed.away === result.away;
  const correctOutcome = getOutcome(guessed) === getOutcome(result);
  const correctGoals = Number(guessed.home === result.home) + Number(guessed.away === result.away);
  const goalMultiplier = exact ? correctGoals * SCORE_RULES.exactGoalMultiplier : 1;
  const basePoints = (correctOutcome ? SCORE_RULES.correctOutcome : 0) + (exact ? SCORE_RULES.exactScore : 0);

  return {
    points: basePoints * goalMultiplier,
    exact,
    goalMultiplier,
    correctGoals,
  };
};

/** Retorna os palpites do usuário atual sem recriar objetos quando não necessário. */
const getCurrentUserPredictions = () => {
  if (!state.user) return {};
  state.predictions[state.user.email] ??= {};
  return state.predictions[state.user.email];
};

/** Soma os indicadores usados nos cards superiores e no ranking. */
const summarizeUser = () => {
  const userPredictions = getCurrentUserPredictions();

  return MATCHES.reduce(
    (summary, match) => {
      const prediction = userPredictions[match.id];
      const score = calculateMatchScore(prediction, match.result);

      return {
        points: summary.points + score.points,
        exact: summary.exact + Number(score.exact),
        saved: summary.saved + Number(hasCompletePrediction(prediction)),
      };
    },
    { points: 0, exact: 0, saved: 0 },
  );
};

/** Pequeno helper para criar elementos sem innerHTML, melhorando segurança e manutenção. */
const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);

  if (options.className) element.className = options.className;
  if (options.textContent !== undefined) element.textContent = options.textContent;
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => element.setAttribute(key, value));
  }

  return element;
};

/** Cria o input de palpite com atributos acessíveis e limites de gols. */
const createGoalInput = ({ teamKey, teamName, value }) => createElement('input', {
  attributes: {
    type: 'number',
    min: '0',
    max: '15',
    inputmode: 'numeric',
    'data-team': teamKey,
    'aria-label': `Gols de ${teamName}`,
    value,
  },
});

/** Atualiza somente o rodapé do card alterado, preservando foco e evitando re-render completo. */
const updateMatchScore = (matchId) => {
  const match = MATCHES.find((item) => item.id === matchId);
  const card = elements.matchesList.querySelector(`[data-match-id="${matchId}"]`);
  if (!match || !card) return;

  const prediction = getCurrentUserPredictions()[matchId];
  const score = calculateMatchScore(prediction, match.result);
  const scoreElement = card.querySelector('[data-role="match-score"]');

  scoreElement.textContent = `${score.points} pts${score.exact ? ` • multiplicador ×${score.goalMultiplier}` : ''}`;
};

/** Renderiza os cards de jogos uma vez por entrada/login de usuário. */
const renderMatches = () => {
  const fragment = document.createDocumentFragment();
  const userPredictions = getCurrentUserPredictions();

  MATCHES.forEach((match) => {
    const prediction = userPredictions[match.id] ?? { home: '', away: '' };
    const score = calculateMatchScore(prediction, match.result);
    const article = createElement('article', {
      className: 'match-card',
      attributes: { 'data-match-id': match.id },
    });

    const meta = createElement('div', { className: 'match-card__meta' });
    meta.append(
      createElement('span', { textContent: match.stage }),
      createElement('span', { textContent: match.date }),
    );

    const teams = createElement('div', { className: 'teams' });
    teams.append(
      createElement('strong', { textContent: `${match.homeFlag} ${match.home}` }),
      createElement('span', { className: 'versus', textContent: 'vs' }),
      createElement('strong', { textContent: `${match.awayFlag} ${match.away}` }),
    );

    const predictionRow = createElement('div', { className: 'prediction-row' });
    const homeLabel = createElement('label', { textContent: match.home });
    const awayLabel = createElement('label', { textContent: match.away });
    homeLabel.append(createGoalInput({ teamKey: 'home', teamName: match.home, value: prediction.home }));
    awayLabel.append(createGoalInput({ teamKey: 'away', teamName: match.away, value: prediction.away }));
    predictionRow.append(homeLabel, createElement('span', { className: 'score-divider', textContent: '×' }), awayLabel);

    const footer = createElement('footer', { className: 'match-card__footer' });
    footer.append(
      createElement('span', { textContent: `Resultado: ${match.result.home} × ${match.result.away}` }),
      createElement('strong', {
        textContent: `${score.points} pts${score.exact ? ` • multiplicador ×${score.goalMultiplier}` : ''}`,
        attributes: { 'data-role': 'match-score' },
      }),
    );

    article.append(meta, teams, predictionRow, footer);
    fragment.append(article);
  });

  elements.matchesList.replaceChildren(fragment);
};

/** Atualiza os cards de estatísticas do usuário. */
const renderSummary = () => {
  const summary = summarizeUser();
  elements.totalPoints.textContent = summary.points;
  elements.exactScores.textContent = summary.exact;
  elements.savedPredictions.textContent = summary.saved;
};

/** Renderiza o leaderboard usando DOM nativo para evitar HTML interpolado com nome do usuário. */
const renderLeaderboard = () => {
  const summary = summarizeUser();
  const players = [
    ...SEEDED_PLAYERS,
    {
      name: state.user?.name ?? 'Você',
      points: summary.points,
      exact: summary.exact,
      current: true,
    },
  ].sort((a, b) => b.points - a.points || b.exact - a.exact || a.name.localeCompare(b.name));

  const fragment = document.createDocumentFragment();

  players.forEach((player, index) => {
    const item = createElement('li', {
      className: `leaderboard__item${player.current ? ' is-current' : ''}`,
    });
    const textWrapper = createElement('div');

    textWrapper.append(
      createElement('strong', { textContent: player.name }),
      createElement('small', { textContent: `${player.exact} placar(es) exato(s)` }),
    );

    item.append(
      createElement('span', { className: 'rank', textContent: String(index + 1) }),
      textWrapper,
      createElement('b', { textContent: `${player.points} pts` }),
    );

    fragment.append(item);
  });

  elements.leaderboard.replaceChildren(fragment);
};

/** Atualiza apenas os blocos que dependem de pontuação. */
const renderScoreDependentViews = (changedMatchId) => {
  if (changedMatchId) updateMatchScore(changedMatchId);
  renderSummary();
  renderLeaderboard();
};

/** Controla a troca entre login e painel principal. */
const renderDashboard = () => {
  if (!state.user) {
    elements.loginCard.classList.remove('hidden');
    elements.dashboard.classList.add('hidden');
    return;
  }

  elements.welcomeName.textContent = state.user.name;
  elements.loginCard.classList.add('hidden');
  elements.dashboard.classList.remove('hidden');
  renderMatches();
  renderScoreDependentViews();
};

/** Carrega estado inicial antes de registrar eventos. */
const bootstrapState = () => {
  state.user = loadJSON(STORAGE_KEYS.user, null);
  state.predictions = loadJSON(STORAGE_KEYS.predictions, {});
};

// Login simples: suficiente para o bolão estático; integração real pode usar OAuth depois.
elements.loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const user = {
    name: elements.nameInput.value.trim(),
    email: elements.emailInput.value.trim().toLowerCase(),
  };

  state.user = user;
  saveJSON(STORAGE_KEYS.user, user);
  elements.loginForm.reset();
  renderDashboard();
});

// Trocar usuário mantém palpites já salvos por e-mail, mas remove a sessão atual.
elements.logoutButton.addEventListener('click', () => {
  state.user = null;
  localStorage.removeItem(STORAGE_KEYS.user);
  renderDashboard();
});

// Event delegation: um único listener atende todos os inputs e evita listeners duplicados.
elements.matchesList.addEventListener('input', (event) => {
  const input = event.target.closest('input[data-team]');
  if (!input || !state.user) return;

  const card = input.closest('[data-match-id]');
  const matchId = card.dataset.matchId;
  const userPredictions = getCurrentUserPredictions();
  const home = normalizeGoalInput(card.querySelector('[data-team="home"]').value);
  const away = normalizeGoalInput(card.querySelector('[data-team="away"]').value);

  // Mantém o valor normalizado no campo editado sem reconstruir o card inteiro.
  card.querySelector('[data-team="home"]').value = home;
  card.querySelector('[data-team="away"]').value = away;

  userPredictions[matchId] = { home, away };
  saveJSON(STORAGE_KEYS.predictions, state.predictions);
  renderScoreDependentViews(matchId);
});

bootstrapState();
renderDashboard();
