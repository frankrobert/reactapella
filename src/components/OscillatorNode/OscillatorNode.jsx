import { Component } from 'react';
import createAudioNode from '../AudioNode/AudioNode';

class Oscillator extends Component {
  // TODO: Elaborate the onClick ex: On/off
  // TODO: Allow the recreation of an Oscillator within the audio chain
  // without breaking;
  onClick = () => {
    const { audioNode } = this.state;

    audioNode.start();
  };
}

export default createAudioNode(Oscillator, OscillatorNode);
