import React, { Component } from 'react';
import { mapPixels } from '../utils';
import Canvas from './Canvas';

const onionSkin = (prev, curr) =>
  mapPixels(
    ([r, g, b, a], i) =>
      curr[i + 3] ? curr.slice(i, i + 4) : [r, g, b, a > 0 ? 32 : 0],
    prev
  );

export default class Layer extends Component {
  componentDidMount = this.update;
  componentDidUpdate = this.update;
  setContext = canvas => {
    if (this.ctx) return;
    this.ctx = canvas.getContext('2d');
  };
  update() {
    const { ctx, props } = this;
    const { width, height, visible, frame, frames } = props;
    const imgData = ctx.createImageData(width, height);
    if (visible) {
      const prev = frames[frame - 1];
      const curr = frames[frame];
      const pixels = prev && curr
        ? // onion-skin previous animation frame
          onionSkin(prev, curr)
        : // otherwise, display normally
          curr;
      // no pixels when frame does not exist for layer
      if (pixels) imgData.data.set(pixels);
    }
    ctx.putImageData(imgData, 0, 0);
  }
  render() {
    const { frame, frames, ...props } = this.props;
    return <Canvas innerRef={this.setContext} {...props} />;
  }
}
