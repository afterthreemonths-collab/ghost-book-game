/**
 * 回响矩阵检查脚本
 * 检查每个 flag 在故事数据中的回响落地情况
 * 用法: node scripts/check-echo-matrix.js
 */

const { palaceBook01 } = require('../js/data/books/index');

function findFlagReferences(book, flagName) {
  const refs = [];

  Object.values(book.scenes).forEach((scene) => {
    // Check textVariants
    (scene.textVariants || []).forEach((variant, idx) => {
      const conditions = variant.if || [];
      if (conditions.some((c) => c.includes(`flag:${flagName}=`))) {
        refs.push({ type: 'textVariant', scene: scene.id, priority: variant.priority || 0 });
      }
    });

    // Check choices showIf/disableIf
    (scene.choices || []).forEach((choice) => {
      const showIf = choice.showIf || [];
      if (showIf.some((c) => c.includes(`flag:${flagName}=`))) {
        refs.push({ type: 'choiceShowIf', scene: scene.id, choice: choice.id });
      }
    });

    // Check choice effects (flagsOn)
    (scene.choices || []).forEach((choice) => {
      const flagsOn = choice.effects?.flagsOn || [];
      if (flagsOn.includes(flagName)) {
        refs.push({ type: 'flagsOn', scene: scene.id, choice: choice.id });
      }
    });

    // Check scene onEnterEffects
    const onEnterFlags = scene.onEnterEffects?.flagsOn || [];
    if (onEnterFlags.includes(flagName)) {
      refs.push({ type: 'onEnterFlags', scene: scene.id });
    }
  });

  // Check endings
  Object.values(book.endings || {}).forEach((ending) => {
    const showIf = ending.showIf || [];
    if (showIf.some((c) => c.includes(`flag:${flagName}=`))) {
      refs.push({ type: 'ending', ending: ending.id, priority: ending.priority || 0 });
    }
  });

  return refs;
}

function analyzeFlagEcho(flagName, refs) {
  const hasTextEcho = refs.some((r) => r.type === 'textVariant');
  const hasChoiceEcho = refs.some((r) => r.type === 'choiceShowIf');
  const hasEndingEcho = refs.some((r) => r.type === 'ending');
  const hasFlagSet = refs.some((r) => r.type === 'flagsOn' || r.type === 'onEnterFlags');

  return { flagName, hasTextEcho, hasChoiceEcho, hasEndingEcho, hasFlagSet, refs };
}

// Define expected echo patterns from the echo matrix
const echoMatrix = {
  observedRivals: { text: true, choice: true, ending: false },
  madeShowyDebut: { text: true, choice: false, ending: true },
  bribedEunuch: { text: true, choice: true, ending: false },
  hadGardenEncounter: { text: true, choice: false, ending: true },
  offendedConsort: { text: true, choice: false, ending: true },
  foundPoisonClue: { text: true, choice: true, ending: true },
  protectedMaid: { text: true, choice: true, ending: true },
  hasConsortLeverage: { text: true, choice: false, ending: true },
  choseFactionEmpress: { text: true, choice: true, ending: true },
  choseFactionPrince: { text: true, choice: true, ending: true },
  preparedEscapeRoute: { text: true, choice: true, ending: true }
};

console.log('=== Echo Matrix Check ===\n');

Object.entries(echoMatrix).forEach(([flag, expected]) => {
  const refs = findFlagReferences(palaceBook01, flag);
  const analysis = analyzeFlagEcho(flag, refs);

  const issues = [];
  if (expected.text && !analysis.hasTextEcho) issues.push('missing text echo');
  if (expected.choice && !analysis.hasChoiceEcho) issues.push('missing choice echo');
  if (expected.ending && !analysis.hasEndingEcho) issues.push('missing ending echo');
  if (!analysis.hasFlagSet) issues.push('FLAG NEVER SET');

  const status = issues.length > 0 ? '⚠️' : '✅';
  console.log(`${status} ${flag}:`);
  console.log(`   text: ${analysis.hasTextEcho ? '✓' : '✗'}  choice: ${analysis.hasChoiceEcho ? '✓' : '✗'}  ending: ${analysis.hasEndingEcho ? '✓' : '✗'}  set: ${analysis.hasFlagSet ? '✓' : '✗'}`);
  if (issues.length > 0) {
    console.log(`   issues: ${issues.join(', ')}`);
  }
  console.log();
});

// Check for flags that are set but not in echo matrix
const allFlags = Object.keys(palaceBook01.stateModel.flags || {});
const matrixFlags = Object.keys(echoMatrix);
const unregistered = allFlags.filter((f) => !matrixFlags.includes(f));

if (unregistered.length > 0) {
  console.log('=== Unregistered Flags (not in echo matrix) ===');
  unregistered.forEach((f) => console.log(`  ${f}`));
}
