import React from 'react';
import styled from 'styled-components';
import MenuWrapper from './MenuWrapper';

// 1. preview player
// 2. start button
// 3. stop button
// 4. fps input
// 5. frame count input

export default ({ active, bottomMenuHeight, canvas, cursor, undos, redos }) => {
  const { w, h, s, x, y } = canvas;
  return (
    <MenuWrapper active={active}>
      preview menu!
    </MenuWrapper>
  );
};
