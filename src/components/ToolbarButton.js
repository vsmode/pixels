import React from 'react';
import styled from 'styled-components';
import * as icons from './Icons';

const ToolbarButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  padding: 0;
  margin: 8px 4px;
  border: none;
  outline: none;
  transition: all .1s linear;
  transform-origin: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)}; 
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  ${({ type, theme, active, border }) =>
    border && active
      ? `box-shadow: inset 0 0 0 ${theme.primary}, 0 0 0 2px ${active
          ? theme.primary
          : '#ccc'};`
      : `box-shadow: inset 0 0 20px transparent;`}
  color: ${({ theme, active }) => (active ? theme.primary : '#aaa')};
  // &::before {
  //   transform: translateY(8px);
  //   opacity: 0;
  //   pointer-events: none;
  //   visibility: none;
  //   content: '';
  //   position: absolute;
  //   bottom: calc(100% + 2px);
  //   left: 0;
  //   right: 0;
  //   width: 0;
  //   margin: auto;
  //   border-top: 5px solid rgba(0, 0, 0, 0.5);
  //   border-right: 5px solid transparent;
  //   border-left: 5px solid transparent;
  //   transition: all linear .2s;
  // }
  // &::after {
  //   transform: translateY(8px);
  //   opacity: 0;
  //   pointer-events: none;
  //   visibility: none;
  //   display: block;
  //   position: absolute;
  //   bottom: calc(100% + 7px);
  //   left: -9999px;
  //   right: -9999px;
  //   width: fit-content;
  //   margin: auto;
  //   padding: 8px;
  //   border-radius: 4px;
  //   color: #fff;
  //   font-size: 12px;
  //   white-space: nowrap;
  //   background: rgba(0, 0, 0, .5);
  //   transition: all linear .2s;
  //   content: '${({ tooltip }) => tooltip}';
  // }
  // &:hover::before {
  //   visiblity: visible;
  //   opacity: 1;
  //   transform: translateY(0);
  // }
  // &:hover::after {
  //   visiblity: visible;
  //   opacity: 1;
  //   transform: translateY(0);
  // }
  & svg {
    display: inline-block;
    margin: 0 auto;
    width: 20px;
    height: 20px;
    stroke-width: ${({ active }) => (active ? 2 : 1)};
  }
`;

export default ({ type, ...props }) => (
  <ToolbarButton {...props}>{React.createElement(icons[type])}</ToolbarButton>
);
