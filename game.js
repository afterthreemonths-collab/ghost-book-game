'use strict';

const { GameLoop } = require('./js/loop');
const { InputManager } = require('./js/input');
const { createRenderer } = require('./js/ui/renderer');
const { renderErrorScreen } = require('./js/ui/error-screen');
const { systemPetBook01 } = require('./js/data/books/index');
const { startBook, enterScene, choose } = require('./js/runtime/story-runner');

const systemInfo = wx.getSystemInfoSync();
const pixelRatio = systemInfo.pixelRatio || 1;
const canvas = wx.createCanvas();
const logicalWidth = systemInfo.windowWidth || systemInfo.screenWidth || 375;
const logicalHeight = systemInfo.windowHeight || systemInfo.screenHeight || 667;
const safeTop = Math.max(
  18,
  systemInfo.statusBarHeight || 0,
  systemInfo.safeArea ? systemInfo.safeArea.top || 0 : 0
);
const safeBottomInset = Math.max(
  0,
  systemInfo.safeArea
    ? logicalHeight - (systemInfo.safeArea.bottom || logicalHeight)
    : 0
);
canvas.width = logicalWidth * pixelRatio;
canvas.height = logicalHeight * pixelRatio;

const ctx = canvas.getContext('2d');
if (ctx && typeof ctx.scale === 'function') {
  ctx.scale(pixelRatio, pixelRatio);
}

const metrics = {
  width: logicalWidth,
  height: logicalHeight,
  safeTop,
  safeBottomInset
};

const renderer = createRenderer(ctx, metrics);
const input = new InputManager();

const app = {
  book: systemPetBook01,
  bookTitle: `${systemPetBook01.meta.title} · 首册`,
  state: null,
  scene: null,
  storyText: '',
  choices: [],
  ending: null,
  score: null,
  isFinished: false,
  pressedRegionId: null,
  chapterLabel: '',
  showStatusPanel: false,
  scrollY: 0,
  showSystemPrompt: false
};

function chapterLabelFromScene(scene) {
  const labels = {
    chapter_1: '第一章 · 觉醒',
    chapter_2: '第二章 · 锋芒',
    chapter_3: '第三章 · 碾压',
    chapter_4: '第四章 · 进化'
  };

  return labels[scene.chapter] || (app.book.meta.theme === 'system_pet' ? '灵宠纪元' : '宫斗本');
}

function syncFromView(view, textPrefix) {
  app.state = view.state;
  app.scene = view.scene;
  app.storyText = textPrefix ? `${textPrefix}\n\n${view.text}` : view.text;
  app.choices = view.choices;
  app.ending = view.ending;
  app.score = view.score;
  app.isFinished = view.isFinished;
  app.chapterLabel = chapterLabelFromScene(view.scene);
  app.scrollY = 0;

  const scene = view.scene || {};
  if (scene.systemPrompt && scene.systemPrompt.text) {
    app.showSystemPrompt = true;
  } else {
    app.showSystemPrompt = false;
  }
}

function bootBook() {
  const state = startBook(app.book);
  const view = enterScene(app.book, state);
  syncFromView(view, '');
}

function handleRegionTap(region) {
  if (app.showSystemPrompt) {
    if (region.id === 'system_prompt_confirm') {
      app.showSystemPrompt = false;
    }
    return;
  }

  if (region.id === 'restart') {
    bootBook();
    return;
  }

  if (region.id === 'toggle_status') {
    app.showStatusPanel = !app.showStatusPanel;
    return;
  }

  if (region.id === 'status_panel_bg') {
    app.showStatusPanel = false;
    return;
  }

  const transition = choose(app.book, app.state, region.id);
  const view = enterScene(app.book, transition.state);
  const textPrefix = transition.outcome ? transition.outcome.textAfterChoice : '';
  syncFromView(view, textPrefix);
}

function showFatalError(error) {
  const message = error && error.stack ? error.stack : String(error);
  console.error('[ghost-book-game]', message);
  renderErrorScreen(ctx, metrics, '游戏运行失败', message);
}

input.onTap = (region) => {
  try {
    handleRegionTap(region);
  } catch (error) {
    showFatalError(error);
  }
};

input.onScroll = (dy) => {
  if (app.showStatusPanel || app.showSystemPrompt) return;
  app.scrollY = (app.scrollY || 0) + dy;
};

const loop = new GameLoop({
  update(dt) {
    app.pressedRegionId = input.getPressedRegionId();
  },
  render() {
    try {
      const regions = renderer.render(app);
      input.setRegions(regions);
    } catch (error) {
      showFatalError(error);
      loop.stop();
    }
  }
});

try {
  bootBook();
  input.setRegions(renderer.render(app));
  loop.start();
} catch (error) {
  showFatalError(error);
}
