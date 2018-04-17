import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import AudioContext, { ReactWebAudioConsumer } from './AudioContext';
import { withKnobs, number, select } from '@storybook/addon-knobs/react';
import AudioSource from '../AudioSource/AudioSource';
import AnalyserNode from '../AnalyserNode/AnalyserNode';
import StereoPanner from '../StereoPanner/StereoPanner';
import GainNode from '../GainNode/GainNode';
import RemoteControl from '../RemoteControl/RemoteControl';
import LessonSpace from '../LessonSpace/LessonSpace';
import Button from '../Button/Button';
import Meter from '../Meter/Meter';
import Knob from '../Knob/Knob';

const Visuals1 = (props) => (
  <div style={
    {
      background: 'goldenrod',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }>
    <h1 style={{ margin: 'auto', textAlign: 'center', width: '100%' }}>React Web Audio Demo</h1>
    <RemoteControl {...props} controls={[{ id: 'analyser' }]}>
      <Meter />
    </RemoteControl>
    <div style={
      {
        background: 'cyan',
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%'
      }
    }>
      <RemoteControl {...props} controls={[{ id: 'lfo' }]}>
        <Button />
      </RemoteControl>
      <RemoteControl {...props} controls={
        [
          { id: 'dryMix', rateOfChange: 'inverted' },
          { id: 'wetMix' }
        ]
      }>
        <Knob initialValue={100} />
      </RemoteControl>
    </div>
  </div>
);

const lessonTitle = 'Gain some Gains';
const lessonText = `
Gain is a pretty straightforward concept. It's most commonly used to modify volume values.
\n\n
Let's try it out:
\n  1. Upload audio file.
\n  2. Press play.
\n  3. Twist the knob and hear the results.
`;

const Visuals2 = (props) => (
  <div style={{ background: 'grey' }}>
    <div>
      <LessonSpace text={lessonText} title={lessonTitle} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <RemoteControl {...props} controls={[{ id: 'gain' }]}>
        <Knob degreeRange={180} degreeOffset={90} />
      </RemoteControl>
    </div>
  </div>
);

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
  .add('with Wet/Dry and controlled UI', () => {
    return (
      <AudioContext>
        <AudioSource source={select('Source', sources)}>
          <GainNode>
            <StereoPanner id="panner">
              <GainNode id="wetMix" destination />
            </StereoPanner>
            <GainNode id="dryMix">
              <AnalyserNode
                id="analyser"
                options={{
                  smoothingTimeConstant: 0.3,
                  maxDecibels: -10,
                  fftSize: 256
                }}
                destination
              />
            </GainNode>
          </GainNode>
        </AudioSource>
        <AudioSource
          id="lfo"
          source="oscillator"
          options={{ frequency: 4 }}
          connections={[{ id: 'panner', params: ['pan'] }]}
        />

        <ReactWebAudioConsumer>
          {config => <Visuals1 {...config} />}
        </ReactWebAudioConsumer>
      </AudioContext>
    );
  })
  .add('With Dummy Lesson', () => (
    <AudioContext>
      <AudioSource source="file">
        <GainNode id="gain" destination />
      </AudioSource>

      <ReactWebAudioConsumer>
        {config => <Visuals2 {...config} />}
      </ReactWebAudioConsumer>
    </AudioContext>
  ));
