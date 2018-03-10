import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import Knob from './Knob';

const stories = storiesOf('Knobs', module);

stories.addDecorator(withKnobs);

stories.add('with dial', () => (
  <Knob />
));
