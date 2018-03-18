import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean } from '@storybook/addon-knobs/react';
import Knob from './Knob';
import WithValueControl from '../../HOC/WithValueControl/WithValueControl';

const stories = storiesOf('Knobs', module);

stories.addDecorator(withKnobs);

stories
  .add('with default values', () => (
    <WithValueControl>
      <Knob />
    </WithValueControl>
  ))
  .add('with divisions', () => (
    <WithValueControl>
      <Knob divisions={number('Divisions', 4)} />
    </WithValueControl>
  ))
  .add('with offset', () => (
    <WithValueControl>
      <Knob degreeOffset={number('Degree Offset', 45)} />
    </WithValueControl>
  ))
  .add('with limited range', () => (
    <WithValueControl>
      <Knob degreeRange={number('Degree Range', 180)} degreeOffset={number('Degree Offset', 90)} />
    </WithValueControl>
  ))
  .add('with initialized value', () => (
    <WithValueControl initialValue={number('Initial Value', 50)}>
      <Knob/>
    </WithValueControl>
  ))
  .add('with value snapping', () => (
    <WithValueControl initialValue={number('Initial Value', 50)}>
      <Knob valueSnapping={boolean('Value Snapping', true)}/>
    </WithValueControl>
  ))
  .add('side by side', () => (
    <div>
      <WithValueControl>
        <Knob
          degreeRange={number('Degree Range', 270)}
          degreeOffset={number('Degree Offset', 45)}
          divisions={number('Divisions', 6)}
        />
      </WithValueControl>
      <WithValueControl>
        <Knob
          degreeRange={number('Degree Range #2', 180)}
          degreeOffset={number('Degree Offset #2', 90)}
          divisions={number('Divisions #2', 3)}
        />
      </WithValueControl>
    </div>
  ));
