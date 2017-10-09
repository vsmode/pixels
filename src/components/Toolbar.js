import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  padding: 8px;
  justify-content: ${({ justifyContent }) => justifyContent};
`;
