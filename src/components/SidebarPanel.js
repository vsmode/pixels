import React from 'react';
import styled from 'styled-components';

const SidebarPanelContainer = styled.div`
  padding: 16px;
  // margin-bottom: 16px;
  // box-shadow: 0 0 0 1px rgba(34, 181, 191, .2);
  // border-radius: 8px;
  // background: rgba(34, 181, 191, .1);
  // color: #fff;
  color: #aaa;
  border-right: 8px solid #eee;
  // border-bottom: 1px solid #eee;
`;

const SidebarPanelTitle = styled.h3`
  font-size: 11px;
  font-weight: bold;
  margin: 0;
  color: rgba(34, 181, 191, 1);
  text-transform: uppercase;
`;

// ✨
export default ({ title, children }) => (
  <SidebarPanelContainer>
    <SidebarPanelTitle>{title}</SidebarPanelTitle>
    {children}
  </SidebarPanelContainer>
);
