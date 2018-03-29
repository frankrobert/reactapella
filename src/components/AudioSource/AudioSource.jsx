import React from 'react';
import PropTypes from 'prop-types';
import Microphone from '../Microphone/Microphone';
import FileUpload from '../FileUpload/FileUpload';

const AudioSource = ({ children, source, ...rest }) => {
  switch(source) {
    case 'microphone':
      return <Microphone {...rest}>{children}</Microphone>;
    case 'file':
      return <FileUpload {...rest}>{children}</FileUpload>;
    default:
      return children;
  }
};

AudioSource.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  source: PropTypes.string
};

export default AudioSource;
