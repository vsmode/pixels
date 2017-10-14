import React from 'react';
import MenuWrapper from './MenuWrapper';

export default ({ active, bottomMenuHeight, canvas, cursor, undos, redos }) => {
  const { w, h, s, x, y } = canvas;
  return (
    <MenuWrapper active={active}>
      preview menu!
    </MenuWrapper>
  );
};
