'use strict';

class InputManager {
  constructor() {
    this._regions = [];
    this._pressedRegionId = null;
    this.onTap = null;
    this.onScroll = null;
    this._touchStartY = 0;
    this._touchStartX = 0;
    this._isScrolling = false;

    wx.onTouchStart((event) => this._handleTouchStart(event));
    wx.onTouchMove((event) => this._handleTouchMove(event));
    wx.onTouchEnd((event) => this._handleTouchEnd(event));
    wx.onTouchCancel(() => {
      this._pressedRegionId = null;
      this._isScrolling = false;
    });
  }

  setRegions(regions) {
    this._regions = regions || [];
  }

  getPressedRegionId() {
    return this._pressedRegionId;
  }

  _findRegion(x, y) {
    return this._regions.find((region) => (
      x >= region.x &&
      x <= region.x + region.w &&
      y >= region.y &&
      y <= region.y + region.h
    ));
  }

  _handleTouchStart(event) {
    if (!event.touches || event.touches.length === 0) return;
    const touch = event.touches[0];
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
    this._isScrolling = false;

    const region = this._findRegion(touch.clientX, touch.clientY);
    this._pressedRegionId = region ? region.id : null;
  }

  _handleTouchMove(event) {
    if (!event.touches || event.touches.length === 0) return;
    const touch = event.touches[0];
    const dy = this._touchStartY - touch.clientY;
    const dx = Math.abs(touch.clientX - this._touchStartX);

    if (Math.abs(dy) > 10 && dy > dx * 0.5) {
      this._isScrolling = true;
      this._pressedRegionId = null;
      if (this.onScroll) {
        this.onScroll(dy);
      }
      this._touchStartY = touch.clientY;
    }
  }

  _handleTouchEnd(event) {
    if (!event.changedTouches || event.changedTouches.length === 0) {
      this._pressedRegionId = null;
      this._isScrolling = false;
      return;
    }

    const touch = event.changedTouches[0];

    if (this._isScrolling) {
      this._isScrolling = false;
      this._pressedRegionId = null;
      return;
    }

    const region = this._findRegion(touch.clientX, touch.clientY);

    if (region && region.id === this._pressedRegionId && this.onTap) {
      this.onTap(region);
    }

    this._pressedRegionId = null;
  }
}

module.exports = {
  InputManager
};

