import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import Button from './Button';

const stories = storiesOf('Storybook Knobs', module);

stories.addDecorator(withKnobs);

stories.add('with a button', () => (
  <Button primary={boolean('Primary', true)}>{ text('Label', '😀 😎 👍 💯') }</Button>
));
