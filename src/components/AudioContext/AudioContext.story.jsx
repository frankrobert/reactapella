import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { withKnobs, number, text } from '@storybook/addon-knobs/react';
import AudioContext from './AudioContext';
import AudioSource from '../AudioSource/AudioSource';
import AnalyserNode from '../AnalyserNode/AnalyserNode';
import StereoPanner from '../StereoPanner/StereoPanner';
import GainNode from '../GainNode/GainNode';
import Meter from '../Meter/Meter';
import Knob from '../Knob/Knob';

const stories = storiesOf('AudioContext', module);

stories.addDecorator(withKnobs).addDecorator(centered);

stories
  .add('with mic input', () => (
    <AudioContext>
      <AudioSource source={text('Source', 'microphone')}>
        <GainNode initialValue={100}>
          <Knob
            degreeRange={number('Degree Range #2', 180)}
            degreeOffset={number('Degree Offset #2', 90)}
          />
          <AnalyserNode destination>
            <Meter />
          </AnalyserNode>
        </GainNode>
      </AudioSource>
    </AudioContext>
  ))
  .add('with file input', () => (
    <AudioContext>
      <AudioSource source={text('Source', 'file')}>
        <GainNode  initialValue={number('InitialValue', 100)}>
          <Knob
            degreeRange={number('Degree Range #2', 180)}
            degreeOffset={number('Degree Offset #2', 90)}
          />
          <AnalyserNode destination>
            <Meter />
          </AnalyserNode>
        </GainNode>
      </AudioSource>
    </AudioContext>
  ))
  .add('with a distant connection', () => (
    <AudioContext>
      <AudioSource source={text('Source', 'file')}>
        <GainNode  initialValue={number('InitialValue', 100)}>
          <GainNode>
            <GainNode id="1"/>
          </GainNode>
          <Knob
            degreeRange={number('Degree Range #2', 180)}
            degreeOffset={number('Degree Offset #2', 90)}
          />
          <GainNode connections={[{id: '1'}]}>
            <AnalyserNode destination>
              <Meter />
            </AnalyserNode>
          </GainNode>
        </GainNode>
      </AudioSource>
    </AudioContext>
  ))
  .add('with StereoPanner', () => (
    <AudioContext>
      <AudioSource source={text('Source', 'file')}>
        <GainNode initialValue={number('InitialValue', 100)}>
          <StereoPanner destination>
            <Knob
              degreeRange={number('Degree Range #2', 180)}
              degreeOffset={number('Degree Offset #2', 90)}
            />
          </StereoPanner>
        </GainNode>
      </AudioSource>
    </AudioContext>
  ));
