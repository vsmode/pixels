import React from 'react';
import MenuWrapper from './MenuWrapper';

export default ({ active, tool, toolbar, cursor }) => {
  const { settings } = toolbar[tool];
  return (
    <MenuWrapper active={active}>
      <code>{tool} tool</code>
      <br />
      <div>
        <code>
          {Object.entries(settings)
            .map(([key, val]) => `${key}: ${JSON.stringify(val)}`)
            .join('\n')}
        </code>
      </div>
    </MenuWrapper>
  );
};
