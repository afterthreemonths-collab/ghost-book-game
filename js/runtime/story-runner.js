const { createInitialState } = require('../data/schema');
const { matchesAll } = require('./condition-evaluator');

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function appendHistoryEntry(state, bucket, value) {
  if (!state.history[bucket]) {
    state.history[bucket] = [];
  }

  state.history[bucket].push(value);
}

function getScene(book, sceneId) {
  const scene = book.scenes[sceneId];

  if (!scene) {
    throw new Error(`Scene not found: ${sceneId}`);
  }

  return scene;
}

function resolveSceneText(scene, state) {
  const variants = (scene.textVariants || [])
    .filter((variant) => matchesAll(variant.if || [], state))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  return variants[0] ? variants[0].text : scene.fallbackText;
}

function resolveEnding(book, state, candidateIds) {
  const endingPool = Object.values(book.endings || {})
    .filter((ending) => !candidateIds || candidateIds.includes(ending.id))
    .filter((ending) => matchesAll(ending.showIf || [], state))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  if (endingPool[0]) {
    return endingPool[0];
  }

  if (candidateIds && candidateIds.length > 0) {
    const fallbackId = candidateIds[candidateIds.length - 1];
    return book.endings[fallbackId] || null;
  }

  return null;
}

function computeEndingScore(state, ending) {
  const stats = state.stats;
  const routes = state.routeTags;
  const routePeak = Math.max(
    routes.cautious || 0,
    routes.ambitious || 0,
    routes.manipulative || 0,
    routes.loyalist || 0,
    routes.survivalist || 0
  );
  const relationScoreRaw =
    (state.relations.emperor || 0) +
    (state.relations.empress || 0) +
    (state.relations.princeFaction || 0) +
    (state.relations.maidAlly || 0) +
    Math.max(-2, state.relations.nobleConsort || 0);

  let score = 0;

  score += Math.max(0, Math.min(15, Math.round((stats.health - 20) / 5)));
  score += Math.max(0, Math.min(18, Math.round((stats.wisdom - 35) / 3.5)));
  score += Math.max(0, Math.min(12, Math.round((stats.favor - 30) / 4)));
  score += Math.max(0, Math.min(10, Math.round((stats.beauty - 35) / 4.5)));
  score += Math.max(0, Math.min(12, Math.round(4 + relationScoreRaw * 1.5)));
  score += Math.max(0, Math.min(8, routePeak + Math.min(2, Math.floor(state.step / 5))));
  score += ending && typeof ending.scoreBonus === 'number'
    ? Math.round(ending.scoreBonus * 0.7)
    : 0;

  const percentage = Math.max(0, Math.min(100, Math.round(score)));
  let grade = 'D';

  if (percentage >= 88) grade = 'S';
  else if (percentage >= 76) grade = 'A';
  else if (percentage >= 62) grade = 'B';
  else if (percentage >= 48) grade = 'C';

  return {
    percentage,
    grade
  };
}

function applyValueMap(target, changes) {
  if (!changes) return;

  Object.entries(changes).forEach(([key, delta]) => {
    if (typeof target[key] !== 'number') {
      target[key] = 0;
    }

    target[key] += delta;
  });
}

function applyFlagChanges(flags, flagKeys, nextValue) {
  if (!flagKeys) return;

  flagKeys.forEach((key) => {
    flags[key] = nextValue;
  });
}

function applyEffects(state, effects) {
  if (!effects) return state;

  applyValueMap(state.stats, effects.stats);
  applyValueMap(state.relations, effects.relations);
  applyValueMap(state.routeTags, effects.routeTags);
  applyFlagChanges(state.flags, effects.flagsOn, true);
  applyFlagChanges(state.flags, effects.flagsOff, false);

  return state;
}

function filterVisibleChoices(scene, state) {
  return (scene.choices || []).filter((choice) => {
    if (!matchesAll(choice.showIf || [], state)) return false;
    if ((choice.disableIf || []).length > 0 && matchesAll(choice.disableIf, state)) {
      return false;
    }
    return true;
  });
}

function pickWeightedOutcome(outcomes, state, randomValue) {
  const availableOutcomes = (outcomes || []).filter((outcome) => matchesAll(outcome.if || [], state));

  if (availableOutcomes.length === 0) {
    throw new Error('No available outcomes for choice');
  }

  const totalWeight = availableOutcomes.reduce((sum, outcome) => sum + outcome.weight, 0);
  const roll = (typeof randomValue === 'number' ? randomValue : Math.random()) * totalWeight;

  let cursor = 0;
  for (const outcome of availableOutcomes) {
    cursor += outcome.weight;
    if (roll <= cursor) {
      return outcome;
    }
  }

  return availableOutcomes[availableOutcomes.length - 1];
}

function resolveEnterEvent(scene, state, randomValue) {
  const events = (scene.enterEvents || []).filter((event) => matchesAll(event.if || [], state));

  if (events.length === 0) {
    return null;
  }

  const picked = pickWeightedOutcome(
    events.map((event) => ({
      ...event,
      to: event.nextOverride || null
    })),
    state,
    randomValue
  );

  return picked;
}

function startBook(book) {
  const state = createInitialState(book.stateModel);
  state.currentSceneId = book.config.startSceneId;
  return state;
}

function enterScene(book, state, randomValue) {
  const nextState = cloneState(state);
  const scene = getScene(book, nextState.currentSceneId);

  appendHistoryEntry(nextState, 'visitedScenes', scene.id);

  if (scene.onEnterEffects) {
    applyEffects(nextState, scene.onEnterEffects);
  }

  const enterEvent = resolveEnterEvent(scene, nextState, randomValue);
  if (enterEvent) {
    applyEffects(nextState, enterEvent.effects);
    if (enterEvent.nextOverride) {
      nextState.currentSceneId = enterEvent.nextOverride;
    }
  }

  const activeScene = getScene(book, nextState.currentSceneId);
  const activeText = resolveSceneText(activeScene, nextState);
  const activeChoices = filterVisibleChoices(activeScene, nextState);

  if (activeScene.mode === 'ending') {
    const ending = resolveEnding(book, nextState, activeScene.endingCandidates);
    const safeEnding = ending || {
      id: 'fallback_ending',
      title: '余波未定',
      category: 'survival',
      summary: '你活着走出了这一局，却没有真正掌控过局势。'
    };
    const score = computeEndingScore(nextState, safeEnding);
    nextState.endingId = safeEnding.id;
    nextState.endingCategory = safeEnding.category;

    return {
      state: nextState,
      scene: activeScene,
      text: safeEnding.summary,
      choices: [],
      enterEvent: enterEvent || null,
      ending: safeEnding,
      score,
      isFinished: true
    };
  }

  return {
    state: nextState,
    scene: activeScene,
    text: activeText,
    choices: activeChoices,
    enterEvent: enterEvent || null,
    ending: null,
    score: null,
    isFinished: false
  };
}

function choose(book, state, choiceId, randomValue) {
  const nextState = cloneState(state);
  const scene = getScene(book, nextState.currentSceneId);
  const availableChoices = filterVisibleChoices(scene, nextState);
  const choice = availableChoices.find((item) => item.id === choiceId);

  if (!choice) {
    throw new Error(`Choice not available: ${choiceId}`);
  }

  appendHistoryEntry(nextState, 'pickedChoices', choice.id);
  nextState.step += 1;
  applyEffects(nextState, choice.effects);

  const outcome = pickWeightedOutcome(choice.outcomes, nextState, randomValue);
  nextState.currentSceneId = outcome.to;

  return {
    state: nextState,
    outcome
  };
}

module.exports = {
  startBook,
  enterScene,
  choose,
  getScene,
  resolveSceneText,
  filterVisibleChoices,
  applyEffects,
  pickWeightedOutcome,
  resolveEnding,
  computeEndingScore
};
