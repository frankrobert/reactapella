import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs/react';
import centered from '@storybook/addon-centered';
import AudioContext from './AudioContext';
import AudioSource from '../AudioSource/AudioSource';
// import AnalyserNode from '../AnalyserNode/AnalyserNode';
// import StereoPanner from '../StereoPanner/StereoPanner';
// import GainNode from '../GainNode/GainNode';
// import RemoteControl from '../RemoteControl/RemoteControl';
// import LessonSpace from '../LessonSpace/LessonSpace';
// import Button from '../Button/Button';
// import Meter from '../Meter/Meter';
// import Knob from '../Knob/Knob';

const nodes = [
	{
  	id: 'sound',
		audioNode: { type: 'OscillatorNode', options: { frequency: 780 } },
    connections: [
    	{
        id: 'gain-node',
      	audioNode: { type: 'GainNode' },
        connections: [
          {
            id: 'panner',
            audioNode: { type: 'StereoPannerNode' },
            connections: [{ id: 'WetMix', audioNode: { type: 'GainNode' }, destination: true }]
          },
          {
          	id: 'DryMix',
            audioNode: { type: 'GainNode' },
            connections: [
            	{
              	id: 'meter',
                audioNode: { type: 'AnalyserNode', options: {
                	smoothingTimeConstant: 0.3,
                  maxDecibels: -10,
                  fftSize: 256
                } },
                destination: true,
                remoteControls: [{ id: 'WetMix' }]
              }
            ]
          }
        ]
      }
    ]
	},
  {
  	id: 'lfo',
    audioNode: { type: 'OscillatorNode', options: { frequency: 4 } },
    remoteControls: [{ id: 'panner', params: ['pan'] }]
  }
];


const nodes2 = [
  {
    id: 'gain-node',
    audioNode: { type: 'GainNode' },
    connections: [
      {
        id: 'panner',
        audioNode: { type: 'StereoPannerNode' },
        connections: [{ id: 'WetMix', audioNode: { type: 'GainNode' }, destination: true }]
      },
      {
        id: 'DryMix',
        audioNode: { type: 'GainNode' },
        connections: [
          {
            id: 'meter',
            audioNode: { type: 'AnalyserNode', options: {
              smoothingTimeConstant: 0.3,
              maxDecibels: -10,
              fftSize: 256
            } },
            destination: true,
            remoteControls: [{ id: 'WetMix' }]
          }
        ]
      }
    ]
  }
];


// const Visuals1 = (props) => (
//   <div style={
//     {
//       background: 'goldenrod',
//       display: 'flex',
//       flexWrap: 'wrap',
//       justifyContent: 'center'
//     }
//   }>
//     <h1 style={{ margin: 'auto', textAlign: 'center', width: '100%' }}>React Web Audio Demo</h1>
//     <RemoteControl {...props} controls={[{ id: 'analyser' }]}>
//       <Meter />
//     </RemoteControl>
//     <div style={
//       {
//         background: 'cyan',
//         display: 'flex',
//         flexWrap: 'wrap',
//         width: '100%'
//       }
//     }>
//       <RemoteControl {...props} controls={[{ id: 'lfo' }]}>
//         <Button />
//       </RemoteControl>
//       <RemoteControl {...props} controls={
//         [
//           { id: 'dryMix', rateOfChange: 'inverted' },
//           { id: 'wetMix' }
//         ]
//       }>
//         <Knob initialValue={100} />
//       </RemoteControl>
//     </div>
//   </div>
// );

// const lessonTitle = 'Gain some Gains';
// const lessonText = `
// Gain is a pretty straightforward concept. It's most commonly used to modify volume values.
// \n\n
// Let's try it out:
// \n  1. Upload audio file.
// \n  2. Press play.
// \n  3. Twist the knob and hear the results.
// `;

// const Visuals2 = (props) => (
//   <div style={{ background: 'grey' }}>
//     <div>
//       <LessonSpace text={lessonText} title={lessonTitle} />
//     </div>
//     <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//       <RemoteControl {...props} controls={[{ id: 'gain' }]}>
//         <Knob degreeRange={180} degreeOffset={90} />
//       </RemoteControl>
//     </div>
//   </div>
// );

const sources = [
  'file',
  'microphone',
  'oscillator'
];
const stories = storiesOf('AudioContext', module);

stories.addDecorator(withKnobs).addDecorator(centered);

stories
  .add('with a nodes array', () => (
    <AudioContext nodes={nodes}>
      <div>{JSON.stringify(nodes, null, 4)}</div>
    </AudioContext>
  ))
  .add('with a mic or file source', () => (
    <AudioContext>
      <AudioSource nodes={nodes2} source={select('Source', sources)} />
    </AudioContext>
  ));
