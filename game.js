'use strict';

const { GameLoop } = require('./js/loop');
const { InputManager } = require('./js/input');
const { createRenderer } = require('./js/ui/renderer');
const { renderErrorScreen } = require('./js/ui/error-screen');
const { palaceBook01 } = require('./js/data/books/index');
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
  book: palaceBook01,
  bookTitle: `${palaceBook01.meta.title} · 首册`,
  state: null,
  scene: null,
  storyText: '',
  choices: [],
  ending: null,
  score: null,
  isFinished: false,
  pressedRegionId: null,
  chapterLabel: ''
};

function chapterLabelFromScene(scene) {
  const labels = {
    chapter_1: '第一章 · 入宫',
    chapter_2: '第二章 · 永巷',
    chapter_3: '第三章 · 流言',
    chapter_4: '第四章 · 毒局',
    chapter_5: '第五章 · 定局'
  };

  return labels[scene.chapter] || '宫斗本';
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
}

function bootBook() {
  const state = startBook(app.book);
  const view = enterScene(app.book, state);
  syncFromView(view, '');
}

function handleRegionTap(region) {
  if (region.id === 'restart') {
    bootBook();
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
