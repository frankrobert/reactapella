import { Component } from 'react';
import PropTypes from 'prop-types';

class Destination extends Component {
  static propTypes = {
    currentNode: PropTypes.object,
    audioDestination: PropTypes.object
  };

  componentDidMount() {
    this.setupDestination();
  }

  setupDestination = () => {
    const { audioDestination, currentNode } = this.props;

    if (!audioDestination || !currentNode) {
      return setTimeout(this.setupDestination, 50);
    }

    currentNode.connect(audioDestination);
  };

  render() {
    return null;
  }
}

export default Destination;
