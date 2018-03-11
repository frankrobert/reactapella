import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import Knob from './Knob';

const stories = storiesOf('Knobs', module);

stories.addDecorator(withKnobs);

stories
  .add('with divisions', () => <Knob divisions={4} />)
  .add('with offset', () => <Knob degreeOffset={45} />)
  .add('with limited range', () => <Knob degreeRange={180} degreeOffset={90} />)
  .add('side by side', () => (
    <div>
      <Knob degreeOffset={45} degreeRange={270} divisions={6} />
      <Knob degreeRange={180} degreeOffset={90} divisions={3} />
    </div>
  ));
