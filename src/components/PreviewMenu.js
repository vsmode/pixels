import React from 'react';
import { withState } from 'recompose';
import styled from 'styled-components';
import MenuWrapper from './MenuWrapper';
import Layer from './Layer';
import { play as Play, pause as Pause } from './Icons';
import { mergePixels, debounce } from '../utils';

class Debounce extends React.Component {
  update = debounce(() => this.forceUpdate(), this.props.delay);
  componentDidMount() {
    this.forceUpdate();
  }
  componentWillReceiveProps() {
    this.update();
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return this.props.children();
  }
}

const PreviewImage = styled.img`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  margin: auto;
  background-color: #fff;
  image-rendering: pixelated;
  transform: translateZ(0);
  border-radius: 4px;
`;

class Preview extends React.Component {
  state = {
    paused: true,
    frame: 0,
    fps: 2,
    from: 0,
    to: Infinity
  };
  tick = () => {
    this.timer = setTimeout(() => {
      if (!this.state.paused)
        this.setState({
          frame: this.state.frame + 1
        });
      this.tick();
    }, 1000 / this.state.fps);
  };
  setPaused = paused => this.setState({ paused });
  setFPS = fps => this.setState({ fps });
  setFrame = frame => this.setState({ frame });
  componentDidMount() {
    this.tick();
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  render() {
    const { setFPS, setFrame, setPaused } = this;
    const { sources, width, height, children, style } = this.props;
    const { paused, fps } = this.state;
    const index = this.state.frame % sources.length;
    return (
      <div style={style}>
        <PreviewImage
          src={sources[index]}
          width={width}
          height={height}
          style={{ display: 'block', margin: '0 auto' }}
          onClick={() => setPaused(!paused)}
        />
        {React.Children.map(children, x =>
          React.cloneElement(x, {
            index,
            sources,
            fps,
            paused,
            setFPS,
            setFrame,
            setPaused
          })
        )}
      </div>
    );
  }
}

const PreviewControls = ({
  index,
  sources,
  fps,
  paused,
  setFPS,
  setFrame,
  setPaused
}) => (
  <div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      {sources.map((uri, i) => {
        return (
          <Debounce key={i} delay={50}>
            {() => (
              <div
                style={{
                  opacity: index === i ? 1 : 0.5
                }}
              >
                <PreviewImage
                  width="32px"
                  height="32px"
                  src={uri}
                  onClick={() => setFrame(i)}
                />
              </div>
            )}
          </Debounce>
        );
      })}
    </div>
    <div
      style={{
        position: 'absolute',
        top: 28,
        left: 24,
        width: 64,
        fontSize: 36,
        textAlign: 'center'
      }}
    >
      {paused && (
        <button
          onClick={() => setPaused(false)}
          style={{ outline: 'none', background: 'none', border: 'none ' }}
        >
          <Play height={48} width={48} color="#fff" />
        </button>
      )}
      {!paused && (
        <button
          onClick={() => setPaused(true)}
          style={{ outline: 'none', background: 'none', border: 'none ' }}
        >
          <Pause height={48} width={48} color="#fff" />
        </button>
      )}
    </div>
    <div
      style={{
        position: 'absolute',
        top: 24,
        right: 24,
        width: 64,
        fontSize: 36,
        textAlign: 'center'
      }}
    >
      <div>
        {fps}
        <span style={{ fontSize: 18 }}>fps</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <button
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            margin: 0,
            width: 24,
            height: 24,
            border: '1px solid #fff',
            borderRadius: 24,
            background: 'none',
            outline: 'none'
          }}
          onClick={() => setFPS(fps >= 59 ? 60 : fps + 1)}
        >
          +
        </button>
        <button
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            margin: 0,
            width: 24,
            height: 24,
            border: '1px solid #fff',
            borderRadius: 24,
            background: 'none',
            outline: 'none'
          }}
          onClick={() => setFPS(fps <= 1 ? 0 : fps - 1)}
        >
          -
        </button>
      </div>
    </div>
  </div>
);

export default ({
  active,
  bottomMenuHeight,
  canvas,
  cursor,
  dataURIs,
  layers,
  undos,
  redos
}) => {
  return (
    <MenuWrapper active={active}>
      <Preview
        width="72px"
        height="72px"
        sources={dataURIs}
        style={{ paddingTop: 16 }}
      >
        <PreviewControls />
      </Preview>
    </MenuWrapper>
  );
};
