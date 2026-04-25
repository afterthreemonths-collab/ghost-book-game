'use strict';

const FIXED_DT = 1 / 60;
const MAX_ACCUMULATOR = 0.1;

class GameLoop {
  constructor(options) {
    this._update = options.update;
    this._render = options.render;
    this._accumulator = 0;
    this._lastTime = 0;
    this._running = false;
    this._rafId = null;
  }

  start() {
    this._running = true;
    this._lastTime = Date.now() / 1000;
    this._accumulator = 0;
    this._schedule();
  }

  stop() {
    this._running = false;
    if (this._rafId !== null) {
      if (typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(this._rafId);
      } else {
        clearTimeout(this._rafId);
      }
      this._rafId = null;
    }
  }

  _schedule() {
    if (typeof requestAnimationFrame === 'function') {
      this._rafId = requestAnimationFrame(() => this._frame());
      return;
    }

    this._rafId = setTimeout(() => this._frame(), 16);
  }

  _frame() {
    if (!this._running) return;

    const now = Date.now() / 1000;
    let elapsed = now - this._lastTime;
    this._lastTime = now;

    if (elapsed > MAX_ACCUMULATOR) {
      elapsed = MAX_ACCUMULATOR;
    }

    this._accumulator += elapsed;

    while (this._accumulator >= FIXED_DT) {
      this._update(FIXED_DT);
      this._accumulator -= FIXED_DT;
    }

    this._render();
    this._schedule();
  }
}

module.exports = {
  GameLoop
};
