# Reactapella

## Purpose

The Web Audio API is brilliant, but extremely complex and has an ever-changing specification.
In a component-based architecture, there is a
tendency to want functionalities abstracted into components.

`Reactapella`'s goal is to reduce the friction and barrier to entry for using the Web Audio API for developers.
By simplifying its API the library allows the flexibility to create simple or extremely complex Web Audio Graphs with
ease.

## Installation

> nvm use or install Node 8.9
>
> npm i
>
> npm run storybook or npm run start

## Usage

The simplest example could be as follows:

```jsx
import {
  AudioContext,
  AudioSource,
  GainNode
} from 'reactapella;

const AudioGraph = () => (
  <AudioContext>
    <AudioSource source="microphone"> // will use the browser's microphone audio stream
      <GainNode destination />
    </AudioSource>
  </AudioContext>
);
```

Components can be nested naturally in a way mirroring the web audio graph you want to create
allowing for very intuitive development.

This approach allows for fairly complex graph development as well:

```jsx
import {
  AudioContext,
  AudioSource,
  GainNode,
  StereoPanner,
  AnalyserNode
} from 'reactapella';

const AudioGraph = () => (
<AudioContext>
  // Will render a file input and all nodes will wait for audio source
  <AudioSource source="file">
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
</AudioContext>
);
```

The above would generate an audio graph as follows:

![](https://i.imgur.com/7HvQXJF.png)

## WIP

For the time being this will be a place to create all of the atomic-level components to
eventually build the project with as this evolves.

- Components can be found under `/src/components`
- Stories can be found next to their respective component
  - `/src/components/Button/Button.js`
  - `/src/components/Button/Button.story.jsx`

### TODO

• Primary goal is to remove or separate visual components

• Secondary goal is to turn this into a library and NPM module

• Tertiary goal is to complete the API
