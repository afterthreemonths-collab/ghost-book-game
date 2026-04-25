'use strict';

class InputManager {
  constructor() {
    this._regions = [];
    this._pressedRegionId = null;
    this.onTap = null;

    wx.onTouchStart((event) => this._handleTouchStart(event));
    wx.onTouchEnd((event) => this._handleTouchEnd(event));
    wx.onTouchCancel(() => {
      this._pressedRegionId = null;
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
    const region = this._findRegion(touch.clientX, touch.clientY);
    this._pressedRegionId = region ? region.id : null;
  }

  _handleTouchEnd(event) {
    if (!event.changedTouches || event.changedTouches.length === 0) {
      this._pressedRegionId = null;
      return;
    }

    const touch = event.changedTouches[0];
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

