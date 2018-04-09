import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { withKnobs } from '@storybook/addon-knobs/react';
import Previous from '../Previous/Previous';

const stories = storiesOf('Previous', module);

stories.addDecorator(withKnobs).addDecorator(centered);

stories.add('with default values', () => <Previous />);
