import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';
import Toggle from './Toggle';

const stories = storiesOf('Toggle', module);

stories.addDecorator(withKnobs);

stories
  .add('with default values', () => <Toggle />)
  .add('with a default toggled state', () => (
    <Toggle defaultToggled={boolean('Default Toggled', true)} />
  ));
