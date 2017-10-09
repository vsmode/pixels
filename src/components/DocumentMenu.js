import React from 'react';
import MenuWrapper from './MenuWrapper';

export default ({ active, bottomMenuHeight, canvas, cursor, undos, redos }) => {
  const { w, h, s, x, y } = canvas;
  return (
    <MenuWrapper active={active}>
      <div
        style={{
          float: 'left',
          display: 'inline-block',
          width: '50%',
          height: bottomMenuHeight,
          overflow: 'auto',
          fontSize: 10
        }}
      >
        {[...redos].reverse().map(([name, opts], i) => (
          <span key={i}>
            <code style={{ opacity: 0.5 }}>
              {name}({opts.x},{opts.y}) | {opts.color.join(',')}
            </code>
            <br />
          </span>
        ))}
        {undos.map(([name, opts], i) => (
          <span key={i}>
            <code>
              {name}({opts.x},{opts.y}) | {opts.color.join(',')}
            </code>
            <br />
          </span>
        ))}
      </div>
      <div
        style={{
          float: 'right',
          display: 'inline-block',
          width: '50%',
          height: bottomMenuHeight
        }}
      >
        <code>
          size: {w} x {h}
        </code>
        <br />
        <code>
          cursor: {cursor.x},{cursor.y}
        </code>
        <br />
        <code>zoom: {s * 100}%</code>
        <br />
        <code>x: {x}</code>
        <br />
        <code>y: {y}</code>
      </div>
    </MenuWrapper>
  );
};
