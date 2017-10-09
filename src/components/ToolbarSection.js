import React from 'react';
import styled from 'styled-components';
import Toolbar from './Toolbar';
import ToolbarButton from './ToolbarButton';
import { LAYER_LIST_WIDTH } from './LayersMenu';
import { lighten } from '../utils';

const ToolbarSectionWrapper = styled.div`
  transition: bottom 0.3s linear;
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: ${({ showPanels, bottomOffset }) => (showPanels ? bottomOffset : 0)};
`;

const MenuSection = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  background: ${({ active, theme }) => {
    return `linear-gradient(90deg, ${theme.secondary}, ${theme.secondary} ${LAYER_LIST_WIDTH}px, ${lighten(
      theme.secondary,
      0.5
    )})`;
  }};
  color: #fff;
  height: ${({ height }) => height};
`;

export default class extends React.Component {
  isTouching = false;
  repeatAction = null;
  repeatActionId = null;
  repeatActionRate = 50;
  keepPanelsOpen = this.props.panel === 'layers';
  componentWillReceiveProps(props) {
    if (!this.repeatAction) return;
    if (!this.shouldRepeatAction(props)) this.cancelRepeatAction();
  }
  shouldRepeatAction = props => {
    const xs = props[this.repeatAction + 's'];
    return xs && xs.length;
  };
  initRepeatAction = (name, f) => {
    if (this.repeatAction) return;
    this.repeatAction = name;
    this.repeatActionId = setInterval(f, this.repeatActionRate);
  };
  cancelRepeatAction = () => {
    if (!this.repeatActionId) return;
    clearInterval(this.repeatActionId);
    this.repeatAction = null;
    this.repeatActionId = null;
  };
  onRepeatActionStart = (name, action) => {
    this.initRepeatAction(name, () => this.props.dispatch(action));
  };
  onRepeatActionEnd = () => {
    this.cancelRepeatAction();
  };
  render() {
    const {
      bottomMenuHeight,
      children,
      dispatch,
      panel,
      panels,
      redos,
      switchTool,
      togglePanel,
      tool,
      toolbar,
      undos,
      utils
    } = this.props;
    return (
      <ToolbarSectionWrapper
        showPanels={!!panel}
        bottomOffset={bottomMenuHeight}
        onTouchStart={e => {
          if (this.isTouching) return e.preventDefault(); // prevent native pinch zooming
          this.isTouching = true;
        }}
        onTouchEnd={() => (this.isTouching = false)}
      >
        <Toolbar justifyContent="flex-start">
          {Object.entries(utils).map(([name, action]) => (
            <ToolbarButton
              key={name}
              type={name}
              tooltip={name}
              active={name === tool}
              onMouseDown={() => this.onRepeatActionStart(name, action)}
              onMouseUp={this.onRepeatActionEnd}
              onTouchStart={() => this.onRepeatActionStart(name, action)}
              onTouchEnd={this.onRepeatActionEnd}
              disabled={
                ('undo' === name && !undos.length) ||
                ('redo' === name && !redos.length)
              }
            />
          ))}
        </Toolbar>
        <Toolbar justifyContent="center">
          {Object.entries(toolbar).map(([name, data]) => (
            <ToolbarButton
              key={name}
              type={name}
              tooltip={name}
              active={name === tool}
              onClick={() => {
                if (name === tool) {
                  return togglePanel(
                    panel === 'tool'
                      ? this.keepPanelsOpen ? 'layers' : null
                      : 'tool'
                  );
                }
                switchTool(name);
              }}
              border
              {...data}
            />
          ))}
        </Toolbar>
        <Toolbar justifyContent="flex-end">
          {Object.entries(panels).map(([name, action]) => (
            <ToolbarButton
              key={name}
              type={name}
              tooltip={`${name} menu`}
              active={name === panel}
              onClick={() => {
                const open = panel === name;
                this.keepPanelsOpen = !open;
                togglePanel(open ? null : name);
              }}
            />
          ))}
        </Toolbar>
        <MenuSection height={bottomMenuHeight}>{children}</MenuSection>
      </ToolbarSectionWrapper>
    );
  }
}
