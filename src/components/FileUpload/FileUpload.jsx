import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FileUpload extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    audioContext: PropTypes.object,
    audioDestination: PropTypes.object
  };

  state = {
    file: null,
    audioSource: null
  };

  onChange = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const file = this.input.files[0];

    this.setState({ file });
    this.getAudioElementSource();
  };

  getAudioElementSource = () => {
    const { audioContext } = this.props;

    if (!audioContext || !this.audioElement) {
      return setTimeout(this.getAudioElementSource, 50);
    }

    const audioSource = audioContext.createMediaElementSource(
      this.audioElement
    );

    this.setState({ audioSource });
  };

  render() {
    const { children, ...rest } = this.props;
    const { audioSource, file } = this.state;

    const newElements = React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ...rest,
        ...this.state,
        currentNode: audioSource
      });
    });

    if (file) {
      return (
        <div>
          {/* eslint-disable-next-line */}
          <audio
            controls
            ref={(e) => {
              this.audioElement = e;
            }}
          >
            <source src={URL.createObjectURL(file)} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          {newElements}
        </div>
      );
    }

    return (
      <input
        ref={(e) => (this.input = e)} // eslint-disable-line
        type="file"
        id="input"
        onChange={this.onChange}
      />
    ); // eslint-disable-line
  }
}

export default FileUpload;
