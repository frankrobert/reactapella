import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number } from '@storybook/addon-knobs/react';
import Knob from './Knob';

const stories = storiesOf('Knobs', module);

stories.addDecorator(withKnobs);

stories
  .add('with divisions', () => <Knob divisions={number('Divisions', 4)} />)
  .add('with offset', () => <Knob degreeOffset={number('Degree Offset', 45)} />)
  .add('with limited range', () => {
    return <Knob degreeRange={number('Degree Range', 180)} degreeOffset={number('Degree Offset', 90)} />;
  })
  .add('side by side', () => (
    <div>
      <Knob
        degreeRange={number('Degree Range', 270)}
        degreeOffset={number('Degree Offset', 45)}
        divisions={number('Divisions', 6)}
      />
      <Knob
        degreeRange={number('Degree Range #2', 180)}
        degreeOffset={number('Degree Offset #2', 90)}
        divisions={number('Divisions #2', 3)}
      />
    </div>
  ));
