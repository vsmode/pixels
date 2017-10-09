export default store => {
  const handleKeyboard = e => {
    const state = store.getState();
    const { dispatch } = store;
    const { cursor, layer } = state;
    // zoom
    if ('=' === e.key) {
      dispatch({
        type: 'ZOOM_CANVAS',
        payload: Math.round(state.canvas.s + 1),
      });
    }
    if ('0' === e.key) {
      const w = (window.innerWidth - 320) / state.canvas.w;
      const h = window.innerHeight / state.canvas.h;
      dispatch({
        type: 'ZOOM_CANVAS',
        payload: Math.min(w, h),
      });
    }
    if ('-' === e.key) {
      dispatch({
        type: 'ZOOM_CANVAS',
        payload: Math.round(state.canvas.s - 1),
      });
    }
    // pan
    if ('a' === e.key) {
      dispatch({
        type: 'PAN_CANVAS',
        payload: {
          x: Math.max(state.canvas.x - (8 / state.canvas.s), -state.canvas.w),
        },
      });
    }
    if ('d' === e.key) {
      dispatch({
        type: 'PAN_CANVAS',
        payload: {
          x: Math.min(state.canvas.x + (8 / state.canvas.s), state.canvas.w),
        },
      });
    }
    if ('w' === e.key) {
      dispatch({
        type: 'PAN_CANVAS',
        payload: {
          y: Math.max(state.canvas.y - (8 / state.canvas.s), -state.canvas.h),
        },
      });
    }
    if ('s' === e.key) {
      dispatch({
        type: 'PAN_CANVAS',
        payload: {
          y: Math.min(state.canvas.y + (8 / state.canvas.s), state.canvas.h),
        },
      });
    }
    // toggle layer
    if ('h' === e.key) {
      dispatch({
        type: 'TOGGLE_LAYER',
        payload: layer,
      });
    }
    // change layer
    if ('1' === e.key || '2' === e.key) {
      dispatch({
        type: 'SET_LAYER',
        payload: Number(e.key) - 1,
      });
    }
    // change frame
    if (',' === e.key) {
      dispatch({
        type: 'SET_FRAME',
        payload: 0,
      });
    }
    if ('.' === e.key) {
      dispatch({
        type: 'SET_FRAME',
        payload: 1,
      });
    }
    // use tool
    if (' ' === e.key) {
      dispatch({
        type: 'SET_CURSOR',
        payload: {
          ...cursor,
          down: true,
        },
      });
      dispatch({
        type: 'SET_CURSOR',
        payload: {
          ...cursor,
          down: false,
        },
      });
    }
    // undo/redo
    if ('z' === e.key && state.undos.length) {
      dispatch({
        type: 'UNDO',
        payload: 1,
      });
    }
    if ('x' === e.key && state.redos.length) {
      dispatch({
        type: 'REDO',
        payload: 1,
      });
    }
    // switch tool
    if ('e' === e.key) {
      dispatch({
        type: 'SET_TOOL',
        payload: 'eraser',
      });
    }
    if ('p' === e.key) {
      dispatch({
        type: 'SET_TOOL',
        payload: 'pencil',
      });
    }
    // move cursor
    if ('ArrowLeft' === e.key) {
      dispatch({
        type: 'SET_CURSOR',
        payload: {
          ...cursor,
          x: Math.max(state.cursor.x - 1, 0),
        },
      });
    }
    if ('ArrowRight' === e.key) {
      dispatch({
        type: 'SET_CURSOR',
        payload: {
          ...cursor,
          x: Math.min(state.cursor.x + 1, state.canvas.w - 1),
        },
      });
    }
    if ('ArrowUp' === e.key) {
      dispatch({
        type: 'SET_CURSOR',
        payload: {
          ...cursor,
          y: Math.max(state.cursor.y - 1, 0),
        },
      });
    }
    if ('ArrowDown' === e.key) {
      dispatch({
        type: 'SET_CURSOR',
        payload: {
          ...cursor,
          y: Math.min(state.cursor.y + 1, state.canvas.h - 1),
        },
      });
    }
  };

  window.onkeypress = e => {
    handleKeyboard(e);
  };

  window.onkeydown = e => {
    if (!/^Arrow/.test(e.key)) return;
    handleKeyboard(e);
  };
};
