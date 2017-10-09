import { clamp } from 'ramda';

export const handleCursorMove = ({ canvas, cursor, dispatch }) => e => {
  const { s, w, h } = canvas;
  const rect = e.target.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / s);
  const y = Math.floor((e.clientY - rect.top) / s);
  if (x < 0 || x > w - 1 || y < 0 || y > h - 1) return
  if (cursor.x === x && cursor.y === y) return;
  const payload = {
    ...cursor,
    x,
    y
  };
  dispatch({
    type: 'SET_CURSOR',
    payload
  });
};

export const handleCursorDown = ({ cursor, dispatch }) => () => {
  dispatch({
    type: 'SET_CURSOR',
    payload: {
      ...cursor,
      down: true
    }
  });
};

export const handleCursorUp = ({ cursor, dispatch }) => () => {
  dispatch({
    type: 'SET_CURSOR',
    payload: {
      ...cursor,
      down: false
    }
  });
};

export const handleCursorMoveAndDown = ({ canvas, dispatch }) => e => {
  const { s, w, h } = canvas;
  const rect = e.target.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / s);
  const y = Math.floor((e.clientY - rect.top) / s);
  if (x < 0 || x > w - 1 || y < 0 || y > h - 1) return
  dispatch({
    type: 'SET_CURSOR',
    payload: { x, y, down: true }
  });
};

export const switchTool = ({ dispatch }) => tool => {
  dispatch({
    type: 'SET_TOOL',
    payload: tool
  });
};

export const togglePanel = ({ dispatch }) => panel => {
  dispatch({
    type: 'SET_PANEL',
    payload: panel
  });
};

export const setLayer = ({ dispatch }) => layer => {
  dispatch({
    type: 'SET_LAYER',
    payload: layer
  });
};

export const toggleLayer = ({ dispatch }) => layer => {
  dispatch({
    type: 'TOGGLE_LAYER',
    payload: layer
  });
};

export const createLayer = ({ dispatch }) => () => {
  dispatch({
    type: 'CREATE_LAYER',
    payload: null
  });
};

export const createFrame = ({ dispatch }) => (id, frame) => {
  dispatch({
    type: 'CREATE_FRAME',
    payload: {
      id,
      frame
    }
  });
};

export const setFrame = ({ dispatch }) => frame => {
  dispatch({
    type: 'SET_FRAME',
    payload: frame
  });
};
