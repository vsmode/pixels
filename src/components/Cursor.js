import styled, { keyframes } from 'styled-components';
import { prop } from 'ramda';

const pulse = keyframes`
 from { opacity: .75 }
 to { opacity: .25 }
`

export default styled.div`
  position: absolute;
  top: calc(1px * ${prop('scale')});
  right: 0;
  bottom: 0;
  left: calc(1px * ${prop('scale')});
  margin: auto;
  width: calc(1px * ${prop('scale')});
  height: calc(1px * ${prop('scale')});
  // transition: .05s all linear;
  transform: translateX(
      calc((${prop('x')}px + ${prop('xOffset')}px) * ${prop('scale')})
    )
    translateY(
      calc((${prop('y')}px + ${prop('yOffset')}px) * ${prop('scale')})
    );
  border: 1px dashed #ddd;
  pointer-events: none;
  animation: ${pulse} 2.4s linear alternate infinite;
`;
