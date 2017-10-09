import styled from 'styled-components';
import { prop } from 'ramda';

export default styled.canvas`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  image-rendering: pixelated;
  width: ${prop('width')}px;
  height: ${prop('height')}px;
  transform: scale(${prop('scale')}) translateX(${prop('x')}px)
    translateY(${prop('y')}px);
  cursor: ${prop('cursorIcon')};
  pointer-events: ${p => (p.active ? 'auto' : 'none')};
  // ${p => p.active && 'box-shadow: 0 0 0.1px 0.1px rgba(0, 0, 0, 0.1);'};
`;
