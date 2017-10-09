import React from 'react';
import styled from 'styled-components';
import { compose, withState } from 'recompose';
import Layer from './Layer';
import MenuWrapper from './MenuWrapper';
import * as Icons from './Icons';
import { lighten } from '../utils';

export const LAYER_LIST_WIDTH = 140;

const ToggleLayerButton = ({ hidden, onClick, ...props }) =>
  React.createElement(Icons[hidden ? 'closedEye' : 'openEye'], {
    width: 32,
    height: 32,
    style: { cursor: 'pointer', margin: '0 8px' },
    onClick,
    ...props
  });

const LayerTitle = styled.input`
  background: none;
  border: none;
  color: #fff;
  font-size: 14px;
  width: ${LAYER_LIST_WIDTH - 60}px;
  padding: 8px;
`;

const FrameWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  user-select: none;
  box-shadow: 0 2px 0 0px rgba(0, 0, 0, 0.25),
    inset 0 0 0 2px
      ${({ active, theme }) => (active ? theme.tertiary : 'transparent')};
  opacity: ${({ active }) => (active ? 1 : 0.66)};
`;

const FrameThumbnail = ({
  active,
  canvasHeight,
  canvasWidth,
  frame,
  height,
  onClick,
  width
}) => (
  <FrameWrapper active={active} onClick={onClick}>
    <Layer
      visible
      frame={0}
      frames={[frame]}
      active={active}
      width={canvasWidth}
      height={canvasHeight}
      scale={Math.min(width / canvasWidth, height / canvasHeight)}
      x={0}
      y={0}
      style={{ pointerEvents: 'none', transformOrigin: '0 0', margin: 0 }}
    />
  </FrameWrapper>
);

const EmptyFrameButton = styled.button`
  display: inline-block;
  position: relative;
  width: 32px;
  height: 32px;
  cursor: pointer;
  vertical-align: top;
  user-select: none;
  background: none;
  border: none;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: ${({ active, theme }) =>
      active ? theme.tertiary : 'rgba(255, 255, 255, 0.75)'};
  }
`;

const FrameList = styled.div`
  position: absolute;
  top: 0;
  left: ${LAYER_LIST_WIDTH}px;
  min-width: calc(100% - ${LAYER_LIST_WIDTH}px);
  width: ${({ width }) => width}px;
`;

const FrameListItem = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.1s linear;
  background: ${({ active }) => `rgba(0, 0, 0, ${active ? 0.25 : 0})`};
`;

const FrameListScrubber = styled.div`
  position: absolute;
  top: 24px;
  bottom: 24px;
  width: 2px;
  background: ${({ theme }) => theme.tertiary};
  // box-shadow: 0 0 0 1px ${({ theme }) => theme.tertiary};
  left: ${({ frame }) => 15 + 32 * frame}px;
`;

const LayerList = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100%;
  will-change: transform;
  background: ${({ theme }) => theme.secondary};
`;

const LayerListItem = styled.div`
  display: flex;
  align-items: center;
  width: ${LAYER_LIST_WIDTH}px;
  height: 48px;
  padding: 0 8px;
  cursor: pointer;
  transition: background 0.1s linear;
  background: ${({ active }) => `rgba(0, 0, 0, ${active ? 0.25 : 0})`};
`;

const LayerActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  text-align: center;
`;

const LayerActionButton = styled.button`
  display: block;
  margin: 16px;
  padding: 8px;
  width: 100%;
  color: #fff;
  text-transform: uppercase;
  font-size: 10px;
  box-shadow: 0 0 0 1px #fff;
  border-radius: 16px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
`;

const enhance = withState('left', 'setLeft', 0);

export default enhance(
  ({
    active,
    canvas,
    createFrame,
    createLayer,
    frame,
    frameCount,
    frames,
    layer,
    layers,
    left,
    setFrame,
    setLayer,
    setLeft,
    toggleLayer
  }) => {
    const totalWidth = frameCount * 32;
    return (
      <MenuWrapper
        active={active}
        onScroll={e => {
          const { scrollLeft } = e.target;
          if (scrollLeft !== left) setLeft(scrollLeft);
        }}
      >
        <FrameList width={totalWidth}>
          <FrameListScrubber frame={frame} />
          {layers.map(({ id, frames }) => {
            const active = layer === id;
            const emptyFrames = Array(frameCount).fill(null);
            return (
              <FrameListItem
                key={id}
                active={active}
                onClick={() => setLayer(id)}
              >
                {emptyFrames.map((_, i) => {
                  const pixels = frames[i];
                  const active = frame === i;
                  return !pixels ? (
                    <EmptyFrameButton
                      key={i}
                      active={active}
                      onClick={e => {
                        e.stopPropagation();
                        createFrame(id, i);
                      }}
                    />
                  ) : (
                    <FrameThumbnail
                      key={i}
                      active={active}
                      canvasHeight={canvas.h}
                      canvasWidth={canvas.w}
                      frame={pixels}
                      height={32}
                      width={32}
                      onClick={() => setFrame(i)}
                    />
                  );
                })}
              </FrameListItem>
            );
          })}
        </FrameList>
        <LayerList style={{ transform: `translateX(${left}px)` }}>
          {layers.map(({ hidden, id, name }) => {
            const active = layer === id;
            return (
              <LayerListItem
                key={id}
                active={active}
                onClick={() => setLayer(id)}
              >
                <ToggleLayerButton
                  width="20"
                  height="20"
                  hidden={hidden}
                  onClick={e => {
                    e.stopPropagation();
                    toggleLayer(id);
                  }}
                />
                <LayerTitle disabled defaultValue={name} />
              </LayerListItem>
            );
          })}
          <LayerActions>
            <LayerActionButton onClick={() => createLayer()}>
              ＋ new layer
            </LayerActionButton>
          </LayerActions>
        </LayerList>
      </MenuWrapper>
    );
  }
);
