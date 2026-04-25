const { palaceBook01 } = require('../js/data/books/index');
const {
  validateSceneTargets,
  validateSceneChoices,
  findUnreachableScenes,
  simulateBook
} = require('../js/runtime/story-validator');

function printList(title, items) {
  console.log(`\n[${title}]`);
  if (!items || items.length === 0) {
    console.log('none');
    return;
  }

  items.forEach((item) => console.log(item));
}

const missingTargets = validateSceneTargets(palaceBook01);
const noChoiceScenes = validateSceneChoices(palaceBook01);
const unreachableScenes = findUnreachableScenes(palaceBook01);
const simulation = simulateBook(palaceBook01, 500);

printList('missing-targets', missingTargets);
printList('no-choice-scenes', noChoiceScenes);
printList('unreachable-scenes', unreachableScenes);

console.log('\n[reached-endings]');
simulation.reachedEndings.forEach(([endingId, count]) => {
  console.log(`${endingId}: ${count}`);
});

printList('failed-runs', simulation.failedRuns);

if (
  missingTargets.length > 0 ||
  noChoiceScenes.length > 0 ||
  unreachableScenes.length > 0 ||
  simulation.failedRuns.length > 0
) {
  process.exitCode = 1;
}
