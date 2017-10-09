import styled from 'styled-components';

export default styled.section`
  position: relative;
  overflow: hidden;
  width: 100vw;
  transition: height .3s linear;
  height: calc(100vh - ${p => p.yOffset ? p.yOffset : '0px'});
`;
