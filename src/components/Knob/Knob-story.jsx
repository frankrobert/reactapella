import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean } from '@storybook/addon-knobs/react';
import Knob from './Knob';

const stories = storiesOf('Knobs', module);

stories.addDecorator(withKnobs);

stories
  .add('with default values', () => <Knob />)
  .add('with divisions', () => <Knob divisions={number('Divisions', 4)} />)
  .add('with offset', () => <Knob degreeOffset={number('Degree Offset', 45)} />)
  .add('with limited range', () => {
    return <Knob degreeRange={number('Degree Range', 180)} degreeOffset={number('Degree Offset', 90)} />;
  })
  .add('with initialized value', () => <Knob initialValue={number('Initial Value', 50)}/>)
  .add('with value snapping', () => {
    return <Knob initialValue={number('Initial Value', 50)} valueSnapping={boolean('Value Snapping', true)}/>
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
