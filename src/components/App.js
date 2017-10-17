import React from 'react';
import { compose, mapProps, withHandlers, withState } from 'recompose';
import styled, { ThemeProvider } from 'styled-components';
import * as actionCreators from '../actionCreators';
import ArtboardSection from './ArtboardSection';
import ToolbarSection from './ToolbarSection';
import MenuWrapper from './MenuWrapper';
import ToolMenu from './ToolMenu';
import LayersMenu from './LayersMenu';
import DocumentMenu from './DocumentMenu';
import PreviewMenu from './PreviewMenu';
import theme from '../theme';
import { toDataURI } from '../utils';

const transformProps = props => {
  return {
    ...props,
    selectedTool: {
      name: props.tool,
      ...props.toolbar[props.tool]
    }
  };
};

const enhance = compose(
  mapProps(transformProps),
  withState('bottomMenuHeight', 'setBottomMenuHeight', '25vh'),
  withHandlers(actionCreators)
);

export default enhance(props => (
  <ThemeProvider theme={theme}>
    <main>
      <ArtboardSection {...props} />
      <ToolbarSection {...props}>
        <ToolMenu active={props.panel === 'tool'} {...props} />
        <LayersMenu active={props.panel === 'layers'} {...props} />
        <PreviewMenu active={props.panel === 'preview'} {...props} />
        {/* <DocumentMenu active={props.panel === 'document'} {...props} /> */}
      </ToolbarSection>
    </main>
  </ThemeProvider>
));
