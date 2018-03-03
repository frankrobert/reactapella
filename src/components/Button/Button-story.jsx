import React from 'react';
import Button from './Button';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';

const stories = storiesOf('Storybook Knobs', module);
stories.addDecorator(withKnobs);

stories.add('with a button', () => (
  <Button primary={boolean('Primary', true)}>{ text('Label', '😀 😎 👍 💯') }</Button>
));
