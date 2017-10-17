import React from 'react';

/**
 * The initial state of the application
 */
type initialStateOptions = {
  width: number,
  height: number,
  frameCount: number
};
export default ({ width, height, frameCount }: initialStateOptions) => ({
  // canvas dimensions and display information
  canvas: {
    w: width,
    h: height,
    s: 30,
    x: 0,
    y: -1
  },
  // cursor display information
  cursor: {
    x: 0,
    y: 0,
    down: false
  },
  // index of active frame
  frame: 0,
  frameCount,
  // index of active layer
  layer: 0,
  // canvas layers
  layers: [
    {
      id: 0,
      name: 'Layer 1',
      hidden: false,
      frames: [
        new Uint8ClampedArray(4 * width * height),
        ...Array(frameCount - 1).fill(null)
      ]
    },
  ],
  // @todo preview pane
  preview: {
    fps: 2,
    frame: 0,
    play: false,
    loop: true,
  },

  // selected tool
  tool: 'pencil',
  // all available tools
  toolbar: {
    pencil: {
      // cursor + tool settings are passed to this reducer when activated
      action: 'SET_PIXEL',
      // cursor icon
      cursor: 'crosshair',
      // tool settings
      settings: {
        color: [0, 0, 0, 255]
      }
    },
    eraser: {
      action: 'UNSET_PIXEL',
      cursor: 'crosshair',
      settings: {}
    }
  },

  // selected panel
  panel: 'preview',
  panels: {
    // tool: {},
    layers: {},
    preview: {}
    // document: {},
  },

  // utils
  utils: {
    undo: {
      type: 'UNDO',
      payload: 1
    },
    redo: {
      type: 'REDO',
      payload: 1
    }
  },

  // history stack
  undos: [],
  redos: []
});
