import React from 'react';
import styled from 'styled-components';
import Artboard from './Artboard';
import Layer from './Layer';
import Cursor from './Cursor';

const LayerShadow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  box-shadow: 0 0 48px 8px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  will-change: transform;
  width: ${({ width, scale }) => width * scale}px;
  height: ${({ height, scale }) => height * scale}px;
`;

export default ({
  bottomMenuHeight,
  canvas,
  cursor,
  frame,
  handleCursorDown,
  handleCursorMove,
  handleCursorMoveAndDown,
  handleCursorUp,
  layer,
  layers,
  panel,
  selectedTool
}) => (
  <Artboard
    yOffset={panel ? bottomMenuHeight : 0}
    onTouchStart={e => {
      e.preventDefault(); // prevent native pinch zooming
    }}
  >
    {layers.map(({ id, hidden, frames }) => (
      <Layer
        key={id}
        visible={!hidden}
        frame={frame}
        frames={frames}
        active={layer === id}
        width={canvas.w}
        height={canvas.h}
        scale={canvas.s}
        x={canvas.x}
        y={canvas.y}
        cursorIcon={selectedTool.cursor}
        onTouchMove={e => {
          if (!(layer === id)) return;
          handleCursorMove(e.touches[0]);
        }}
        onTouchStart={e => {
          if (!(layer === id)) return;
          handleCursorMoveAndDown(e.touches[0]);
        }}
        onTouchEnd={e => {
          if (!(layer === id)) return;
          handleCursorUp();
        }}
        onMouseMove={layer === id && handleCursorMove}
        onMouseDown={layer === id && handleCursorDown}
        onMouseUp={layer === id && handleCursorUp}
      />
    ))}
    <LayerShadow width={canvas.w} height={canvas.h} scale={canvas.s} style={{
      transform: `translateX(${canvas.x * canvas.s}px) translateY(${canvas.y * canvas.s}px)`
    }} />    
    <Cursor
      scale={canvas.s}
      xOffset={canvas.x - canvas.w / 2}
      yOffset={canvas.y - canvas.h / 2}
      {...cursor}
    />
  </Artboard>
);

// onMouseMove={layer === id && handleCursorMove}
// onMouseDown={layer === id && handleCursorDown}
// onMouseUp={layer === id && handleCursorUp}

// onTouchMove={layer === id && handleCursorMove}
// onTouchStart={layer === id && handleCursorDown}
// onTouchEnd={layer === id && handleCursorUp}
