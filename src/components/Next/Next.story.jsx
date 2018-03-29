import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { withKnobs } from '@storybook/addon-knobs/react';
import Next from '../Next/Next';

const stories = storiesOf('Next', module);

stories.addDecorator(withKnobs).addDecorator(centered);

stories.add('with default values', () => <Next />)