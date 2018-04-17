import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { withKnobs, number, select } from '@storybook/addon-knobs/react';
import AudioContext from './AudioContext';
import AudioSource from '../AudioSource/AudioSource';
import AnalyserNode from '../AnalyserNode/AnalyserNode';
import StereoPanner from '../StereoPanner/StereoPanner';
import GainNode from '../GainNode/GainNode';
import RemoteControl from '../RemoteControl/RemoteControl';
import Button from '../Button/Button';
import Meter from '../Meter/Meter';
import Knob from '../Knob/Knob';

const sources = [
  'file',
  'microphone',
  'oscillator'
];
const stories = storiesOf('AudioContext', module);

stories.addDecorator(withKnobs).addDecorator(centered);

stories
  .add('with mic input', () => (
    <AudioContext>
      <AudioSource source={select('Source', sources)}>
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
      <AudioSource source={select('Source', sources)}>
        <GainNode initialValue={number('InitialValue', 100)}>
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
      <AudioSource source={select('Source', sources)}>
        <GainNode initialValue={number('InitialValue', 100)}>
          <GainNode>
            <GainNode id="1" />
          </GainNode>
          <Knob
            degreeRange={number('Degree Range #2', 180)}
            degreeOffset={number('Degree Offset #2', 90)}
          />
          <GainNode connections={[{ id: '1' }]}>
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
      <AudioSource source={select('Source', sources)}>
        <GainNode initialValue={number('InitialValue', 100)}>
          <StereoPanner passThrough destination>
            <Knob
              degreeRange={number('Degree Range #2', 180)}
              degreeOffset={number('Degree Offset #2', 90)}
            />
          </StereoPanner>
        </GainNode>
      </AudioSource>
    </AudioContext>
  ))
  .add('with Wet/Dry', () => {
    return (
      <AudioContext>
        <AudioSource source={select('Source', sources)}>
          <GainNode>
            <StereoPanner id="panner">
              <GainNode id="wetMix" initialValue={50} destination>
                <RemoteControl
                  links={[{ id: 'dryMix', rateOfChange: 'inverted' }]}
                >
                  <Knob />
                </RemoteControl>
              </GainNode>
            </StereoPanner>
            <GainNode id="dryMix" initialValue={50}>
              <AnalyserNode
                options={{
                  smoothingTimeConstant: 0.3,
                  maxDecibels: -10,
                  fftSize: 256
                }}
                destination
              >
                <Meter />
              </AnalyserNode>
            </GainNode>
          </GainNode>
        </AudioSource>
        <AudioSource
          source="oscillator"
          options={{ frequency: 4 }}
          connections={[{ id: 'panner', params: ['pan'] }]}
        >
          <Button />
        </AudioSource>
      </AudioContext>
    );
  });
