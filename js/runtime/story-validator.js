const { startBook, enterScene, choose } = require('./story-runner');

function collectReferencedSceneIds(book) {
  const referencedIds = new Set();

  Object.values(book.scenes).forEach((scene) => {
    (scene.choices || []).forEach((choice) => {
      (choice.outcomes || []).forEach((outcome) => {
        referencedIds.add(outcome.to);
      });
    });

    (scene.enterEvents || []).forEach((event) => {
      if (event.nextOverride) {
        referencedIds.add(event.nextOverride);
      }
    });
  });

  return referencedIds;
}

function validateSceneTargets(book) {
  const missing = [];

  collectReferencedSceneIds(book).forEach((sceneId) => {
    if (!book.scenes[sceneId]) {
      missing.push(sceneId);
    }
  });

  return missing;
}

function validateSceneChoices(book) {
  return Object.values(book.scenes)
    .filter((scene) => scene.mode !== 'ending')
    .filter((scene) => !scene.choices || scene.choices.length === 0)
    .map((scene) => scene.id);
}

function findUnreachableScenes(book) {
  const visited = new Set();
  const queue = [book.config.startSceneId];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId) || !book.scenes[currentId]) continue;

    visited.add(currentId);
    const scene = book.scenes[currentId];

    (scene.choices || []).forEach((choice) => {
      (choice.outcomes || []).forEach((outcome) => {
        if (!visited.has(outcome.to)) {
          queue.push(outcome.to);
        }
      });
    });

    (scene.enterEvents || []).forEach((event) => {
      if (event.nextOverride && !visited.has(event.nextOverride)) {
        queue.push(event.nextOverride);
      }
    });
  }

  return Object.keys(book.scenes).filter((sceneId) => !visited.has(sceneId));
}

function randomPick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function simulateBook(book, runs) {
  const reachedScenes = new Set();
  const reachedEndings = new Map();
  const failedRuns = [];

  for (let i = 0; i < runs; i += 1) {
    try {
      let state = startBook(book);
      let view = enterScene(book, state);
      let steps = 0;

      while (!view.isFinished && steps < 40) {
        reachedScenes.add(view.scene.id);

        if (!view.choices || view.choices.length === 0) {
          throw new Error(`No choices available at scene ${view.scene.id}`);
        }

        const choice = randomPick(view.choices);
        const transition = choose(book, view.state, choice.id);
        view = enterScene(book, transition.state);
        steps += 1;
      }

      reachedScenes.add(view.scene.id);

      if (view.ending) {
        reachedEndings.set(view.ending.id, (reachedEndings.get(view.ending.id) || 0) + 1);
      } else {
        failedRuns.push(`Run ${i + 1} ended without ending`);
      }
    } catch (error) {
      failedRuns.push(`Run ${i + 1}: ${error.message}`);
    }
  }

  return {
    reachedScenes: Array.from(reachedScenes).sort(),
    reachedEndings: Array.from(reachedEndings.entries()).sort((a, b) => b[1] - a[1]),
    failedRuns
  };
}

module.exports = {
  validateSceneTargets,
  validateSceneChoices,
  findUnreachableScenes,
  simulateBook
};

