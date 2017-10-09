import styled from 'styled-components';

export default styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  // -webkit-overflow-scrolling: auto !important;
  transition: all 0.5s ease-in-out;
  transform: ${({ active }) => (active ? 'translateY(0)' : 'translateY(50%)')};
  opacity: ${({ active }) => (active ? 1 : 0)};
`;
