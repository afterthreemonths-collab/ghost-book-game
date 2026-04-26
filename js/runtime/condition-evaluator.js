function getBucketAndKey(expression) {
  const match = expression.match(/^(stat|relation|flag|route|history|talent|skill|pet|player|system):([^<>=]+)(>=|<=|>|<|=)(.+)$/);

  if (!match) {
    throw new Error(`Invalid condition expression: ${expression}`);
  }

  return {
    bucket: match[1],
    key: match[2],
    operator: match[3],
    rawValue: match[4]
  };
}

function normalizeExpectedValue(rawValue) {
  if (rawValue === 'true') return true;
  if (rawValue === 'false') return false;
  if (!Number.isNaN(Number(rawValue)) && rawValue.trim() !== '') {
    return Number(rawValue);
  }
  return rawValue;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function getActualValue(state, bucket, key) {
  if (bucket === 'stat') return state.stats[key];
  if (bucket === 'relation') return state.relations[key];
  if (bucket === 'flag') return state.flags[key];
  if (bucket === 'route') return state.routeTags[key];
  if (bucket === 'history') return state.history[key];
  if (bucket === 'talent') return state.pet?.talents?.includes(key);
  if (bucket === 'skill') return state.pet?.skills?.includes(key);
  if (bucket === 'pet') return getNestedValue(state.pet, key);
  if (bucket === 'player') return getNestedValue(state.player, key);
  if (bucket === 'system') return getNestedValue(state.system, key);

  return undefined;
}

function compareValues(actual, operator, expected) {
  if (Array.isArray(actual) && operator === '=') {
    return actual.includes(expected);
  }
  if (operator === '=') return actual === expected;
  if (operator === '>=') return Number(actual) >= Number(expected);
  if (operator === '<=') return Number(actual) <= Number(expected);
  if (operator === '>') return Number(actual) > Number(expected);
  if (operator === '<') return Number(actual) < Number(expected);
  return false;
}

function evaluateCondition(expression, state) {
  const parsed = getBucketAndKey(expression);
  const expected = normalizeExpectedValue(parsed.rawValue);
  const actual = getActualValue(state, parsed.bucket, parsed.key);

  return compareValues(actual, parsed.operator, expected);
}

function matchesAll(conditions, state) {
  if (!conditions || conditions.length === 0) return true;
  return conditions.every((condition) => evaluateCondition(condition, state));
}

module.exports = {
  evaluateCondition,
  matchesAll
};
