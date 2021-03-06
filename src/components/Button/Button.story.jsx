import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs/react';
import centered from '@storybook/addon-centered';
import Button from './Button';
import ControlButton from '../ControlButton/ControlButton';

const stories = storiesOf('Button', module);

stories.addDecorator(withKnobs).addDecorator(centered);

stories
  .add('with a label', () => (
    <Button>{text('Label', 'This is a button label')}</Button>
  ))
  .add('with toggle state', () => <ControlButton mode="toggle" />)
  .add('with active state', () => <ControlButton mode="active" />);
