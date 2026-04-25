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

function analyzeEndingDistribution(reachedEndings, totalRuns) {
  const total = reachedEndings.reduce((sum, [, count]) => sum + count, 0);
  const allEndingIds = Object.keys(palaceBook01.endings || {});
  const reachedIds = new Set(reachedEndings.map(([id]) => id));
  const neverReached = allEndingIds.filter((id) => !reachedIds.has(id));

  console.log('\n[ending-distribution]');
  reachedEndings.forEach(([endingId, count]) => {
    const pct = ((count / totalRuns) * 100).toFixed(1);
    console.log(`${endingId}: ${count} (${pct}%)`);
  });

  if (neverReached.length > 0) {
    console.log('\n[never-reached-endings] ⚠️');
    neverReached.forEach((id) => {
      const ending = palaceBook01.endings[id];
      console.log(`  ${id}: "${ending?.title || id}" — priority ${ending?.priority || '?'}`);
    });
  }

  // Check for severely imbalanced endings
  console.log('\n[balance-check]');
  if (reachedEndings.length >= 2) {
    const maxCount = reachedEndings[0][1];
    const minCount = reachedEndings[reachedEndings.length - 1][1];
    const ratio = maxCount / Math.max(minCount, 1);
    if (ratio > 50) {
      console.log(`  WARNING: max/min ratio is ${ratio.toFixed(1)} (${reachedEndings[0][0]} vs ${reachedEndings[reachedEndings.length - 1][0]})`);
      console.log('  Suggestion: check if high-frequency ending conditions are too loose, or low-frequency conditions are unreachable');
    } else if (ratio > 20) {
      console.log(`  CAUTION: max/min ratio is ${ratio.toFixed(1)} — consider tuning thresholds`);
    } else {
      console.log(`  OK: max/min ratio is ${ratio.toFixed(1)}`);
    }
  }

  const coverage = ((reachedIds.size / allEndingIds.length) * 100).toFixed(1);
  console.log(`\n  Coverage: ${reachedIds.size}/${allEndingIds.length} endings reached (${coverage}%)`);
}

const RUNS = 500;

const missingTargets = validateSceneTargets(palaceBook01);
const noChoiceScenes = validateSceneChoices(palaceBook01);
const unreachableScenes = findUnreachableScenes(palaceBook01);
const simulation = simulateBook(palaceBook01, RUNS);

printList('missing-targets', missingTargets);
printList('no-choice-scenes', noChoiceScenes);
printList('unreachable-scenes', unreachableScenes);
analyzeEndingDistribution(simulation.reachedEndings, RUNS);
printList('failed-runs', simulation.failedRuns);

if (
  missingTargets.length > 0 ||
  noChoiceScenes.length > 0 ||
  unreachableScenes.length > 0 ||
  simulation.failedRuns.length > 0
) {
  process.exitCode = 1;
}
