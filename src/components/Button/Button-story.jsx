import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs/react';
import centered from '@storybook/addon-centered';
import Button from './Button';

const stories = storiesOf('Button', module);

stories
  .addDecorator(withKnobs)
  .addDecorator(centered);

stories.add('with emojis', () => (
  <Button>
    {text('Label', 'This is a button label')}
  </Button>
));
