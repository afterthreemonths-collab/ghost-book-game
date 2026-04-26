const BOOK_SCHEMA_VERSION = 'v1';

const SCENE_MODES = {
  CHOICE: 'choice',
  EVENT: 'event',
  DEATH: 'death',
  ENDING: 'ending'
};

const CONDITION_PREFIX = {
  STAT: 'stat',
  RELATION: 'relation',
  FLAG: 'flag',
  ROUTE: 'route',
  HISTORY: 'history',
  TALENT: 'talent',
  SKILL: 'skill',
  PET: 'pet',
  PLAYER: 'player',
  SYSTEM: 'system'
};

function clonePlainObject(source) {
  return JSON.parse(JSON.stringify(source));
}

function createInitialState(stateModel) {
  return {
    stats: clonePlainObject(stateModel.stats || {}),
    relations: clonePlainObject(stateModel.relations || {}),
    flags: clonePlainObject(stateModel.flags || {}),
    routeTags: clonePlainObject(stateModel.routeTags || {}),
    player: clonePlainObject(stateModel.player || {}),
    pet: clonePlainObject(stateModel.pet || {}),
    system: clonePlainObject(stateModel.system || {}),
    step: 0,
    currentSceneId: null,
    endingId: null,
    endingCategory: null,
    history: {
      visitedScenes: [],
      pickedChoices: []
    }
  };
}

module.exports = {
  BOOK_SCHEMA_VERSION,
  SCENE_MODES,
  CONDITION_PREFIX,
  createInitialState
};
