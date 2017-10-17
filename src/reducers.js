import { compose } from 'recompose';
import { setPixel, getPixel, indexWhere, toDataURI } from './utils';

const reducers = {};

export const createReducer = r => (s, a) =>
  a && r[a.type] ? r[a.type](s, a.payload, a.meta) : s;

export const createDataURIs = state => ({
  ...state,
  dataURIs: toDataURI(state.layers, state.canvas.w, state.canvas.h)
});

export const BATCH = (reducers.BATCH = (state, actions) => {
  return actions.reduce(
    (nextState, action) => reducers[action.type](nextState, action.payload),
    state
  );
});

export const REDO = (reducers.REDO = (state, length) => {
  const redos = [...state.redos];
  const undos = [...redos.splice(0, length), ...state.undos];
  // re-draw each layer + frame
  const { w, h } = state.canvas;
  let n = undos.length;
  let nextState = {
    ...state,
    layers: state.layers.map(layer => ({
      ...layer,
      // clear pixel buffers
      frames: layer.frames.map(
        x => (x ? new Uint8ClampedArray(4 * w * h) : null)
      )
    }))
  };
  while (n--) {
    const [type, payload] = undos[n];
    nextState = reducers[type](nextState, payload);
  }
  return {
    ...nextState,
    undos,
    redos
  };
});

export const UNDO = (reducers.UNDO = (state, length) => {
  const undos = [...state.undos];
  const redos = [...undos.splice(0, length), ...state.redos];
  // re-draw each layer + frame
  const { w, h } = state.canvas;
  let n = undos.length;
  let nextState = {
    ...state,
    layers: state.layers.map(layer => ({
      ...layer,
      // clear pixel buffers
      frames: layer.frames.map(
        x => (x ? new Uint8ClampedArray(4 * w * h) : null)
      )
    }))
  };
  while (n--) {
    const [type, payload] = undos[n];
    nextState = reducers[type](nextState, payload);
  }
  return {
    ...nextState,
    undos,
    redos
  };
});

export const SET_CANVAS = (reducers.SET_CANVAS = (state, canvas) => ({
  ...state,
  canvas: {
    ...state.canvas,
    ...canvas
  }
}));

export const ZOOM_CANVAS = (reducers.ZOOM_CANVAS = (state, s) => ({
  ...state,
  canvas: {
    ...state.canvas,
    s
  }
}));

export const PAN_CANVAS = (reducers.PAN_CANVAS = (
  state,
  { x = state.canvas.x, y = state.canvas.y }
) => ({
  ...state,
  canvas: {
    ...state.canvas,
    x,
    y
  }
}));

export const SET_TOOL = (reducers.SET_TOOL = (state, tool) => ({
  ...state,
  tool
}));

export const SET_PANEL = (reducers.SET_PANEL = (state, panel) => ({
  ...state,
  panel
}));

export const SET_LAYER = (reducers.SET_LAYER = (state, layer) => ({
  ...state,
  layer
}));

export const TOGGLE_LAYER = (reducers.TOGGLE_LAYER = (state, id) => ({
  ...state,
  layers: state.layers.map(
    layer =>
      id !== layer.id
        ? layer
        : {
            ...layer,
            hidden: !layer.hidden
          }
  )
}));

export const REORDER_LAYER = (reducers.REORDER_LAYER = (
  state,
  { from, to }
) => {
  const layers = [...state.layers];
  const [x] = layers.splice(from, 1);
  layers.place(to, 0, x);
  return {
    ...state,
    layers
  };
});

export const CREATE_LAYER = (reducers.CREATE_LAYER = (state, payload) => {
  const { w, h } = state.canvas;
  return {
    ...state,
    layers: [
      ...state.layers,
      {
        id: Date.now(), //state.layers.length,
        name: `Layer ${state.layers.length + 1}`,
        hidden: false,
        frames: [
          new Uint8ClampedArray(4 * w * h),
          ...Array(state.frameCount - 1).fill(null)
        ]
      }
    ]
  };
});

export const DELETE_LAYER = (reducers.DELETE_LAYER = (state, id) => {
  const layers = [...state.layers];
  layers.splice(id, 1);
  return {
    ...state,
    layers
  };
});

export const SET_FRAME = (reducers.SET_FRAME = (state, frame) => ({
  ...state,
  frame
}));

export const MOVE_FRAME = (reducers.MOVE_FRAME = (state, { id, from, to }) => {
  const layers = [...state.layers];
  const index = indexWhere(x => x.id === id, layers);
  const layer = { ...layers[index] };
  const frames = [...layer.frames];
  const [x] = frames.splice(from, 1);
  frames.place(to, 0, x);
  layer.frames = frames;
  layers[index] = layer;
  return {
    ...state,
    layers
  };
});

export const CREATE_FRAME = (reducers.CREATE_FRAME = (state, { id, frame }) => {
  const { w, h } = state.canvas;
  const layers = [...state.layers];
  const index = indexWhere(x => x.id === id, layers);
  const layer = { ...layers[index] };
  const frames = [...layer.frames];
  frames[frame] = new Uint8ClampedArray(4 * w * h);
  layer.frames = frames;
  layers[index] = layer;
  return {
    ...state,
    layers
  };
});

export const DELETE_FRAME = (reducers.DELETE_FRAME = (state, { id, frame }) => {
  const layers = [...state.layers];
  const index = indexWhere(x => x.id === id, layers);
  const layer = { ...layers[index] };
  const frames = [...layer.frames];
  frames.splice(frame, 1);
  layer.frames = frames;
  layers[index] = layer;
  return {
    ...state,
    layers
  };
});

export const SET_CURSOR = (reducers.SET_CURSOR = (state, cursor) => {
  let nextState = state;
  // optionally, handle tool action
  if (cursor.down) {
    const { tool, toolbar, layer, frame } = nextState;
    const { action, settings } = toolbar[tool];
    nextState = reducers[action](nextState, {
      ...cursor,
      ...settings,
      layer,
      frame
    });
  }
  return {
    ...nextState,
    cursor
  };
});

export const UPDATE_TOOL_SETTINGS = (reducers.UPDATE_TOOL_SETTINGS = (
  state,
  settings
) => {
  return {
    ...state,
    toolbar: {
      ...state.toolbar,
      settings: {
        ...state.toolbar.settings,
        ...settings
      }
    }
  };
});

// tool actions

export const SET_PIXEL = (reducers.SET_PIXEL = (state, payload) => {
  const { x, y, color, layer, frame } = payload;
  const { canvas, layers } = state;
  const { w } = canvas;
  const index = indexWhere(x => x.id === layer, layers);
  const buffer = layers[index].frames[frame];
  const pixel = getPixel({ width: w, x, y, buffer });
  // compare current pixel color
  if (
    pixel[0] === color[0] &&
    pixel[1] === color[1] &&
    pixel[2] === color[2] &&
    pixel[3] === color[3]
  ) {
    // same color
    return state;
  }
  // update layer frame
  const nextFrames = [...layers[index].frames];
  const nextLayers = [...layers];
  const undos = [['SET_PIXEL', payload], ...state.undos];
  nextFrames[frame] = setPixel({
    width: w,
    x,
    y,
    color,
    buffer
  });
  nextLayers[index].frames[frame] = nextFrames[frame];
  return {
    ...state,
    layers: nextLayers,
    undos,
    redos: []
  };
});

export const UNSET_PIXEL = (reducers.UNSET_PIXEL = (state, payload) =>
  reducers.SET_PIXEL(state, { ...payload, color: [0, 0, 0, 0] }));

export default compose(createDataURIs, createReducer(reducers));
