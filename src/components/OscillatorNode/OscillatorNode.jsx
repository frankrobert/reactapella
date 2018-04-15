import { Component } from 'react';
import createAudioNode from '../AudioNode/AudioNode';

class Oscillator extends Component {
  onClick = () => {
    const { audioNode } = this.state;

    audioNode.start();
  };
}

export default createAudioNode(Oscillator, OscillatorNode);
