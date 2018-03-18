import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import Button from './Button';

const stories = storiesOf('Button', module);

stories.addDecorator(withKnobs);

stories.add('with emojis', () => (
  <Button primary={boolean('Primary', true)}>
    {text('Label', '😀 😎 👍 💯')}
  </Button>
));
