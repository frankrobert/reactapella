import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Next from '../Next/Next';
import Previous from '../Previous/Previous';
import { COLORS } from '../../constants/constants';

const OuterText = styled.div`
  overflow: hidden;
  background-color: ${COLORS.WHITE};
  border-radius: 10px;
  box-shadow: 0 3px 2px 0 rgba(0, 0, 0, 0.05);
  width: 600px;
  font-size: 14px;
  position: relative;
  font-family: 'Segoe UI', 'Open Sans', 'Roboto', sans-serif;

  &::before {
    content: '';
    background: -webkit-linear-gradient(left, ${COLORS.GREEN} 0%, ${COLORS.LIGHT_GREEN} 100%);
    background: linear-gradient(to right, ${COLORS.GREEN} 0%, ${COLORS.LIGHT_GREEN} 100%);
    position: absolute;
    top: 0;
    display: block;
    height: 10px;
    width: 100%;
  }
`;

const TextArea = styled.div`
  overflow-y: auto;
  padding: 10px 30px;
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: ${COLORS.WHITE};
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-clip: content-box;
    background-color: #d5d6d6;
    border: 3px solid transparent;
    border-radius: 6px;
  }
`;

const Buttons = styled.div`
  background: -webkit-linear-gradient(left, ${COLORS.GREEN} 0%, ${COLORS.LIGHT_GREEN} 100%);
  background: linear-gradient(to right, ${COLORS.GREEN} 0%, ${COLORS.LIGHT_GREEN} 100%);
  border-top: 1px solid #222;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 30px;
  width: 100%;
  position: absolute;
  bottom: 0;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(0);
  }

  ${(props) =>
    props.isScrolling
      ? 'transform: translateY(0)'
      : 'transform: translateY(100%);'};
`;

const Title = styled.h3`
  color: #222;
  font-size: 18px;
  text-decoration: underline;
`;

// eslint-disable-next-line
class LessonSpace extends Component {
  static propTypes = {
    text: PropTypes.string,
    title: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.scrolling = null;
  }

  state = {
    isScrolling: false
  };

  updateOnScroll = () => {
    clearTimeout(this.scrolling);
    this.setState({ isScrolling: true });

    this.scrolling = setTimeout(
      () => this.setState({ isScrolling: false }),
      100
    );
  };

  render() {
    const { isScrolling } = this.state;
    const { text, title } = this.props;

    return (
      <OuterText onWheel={this.updateOnScroll}>
        <TextArea>
          <Title>{title}</Title>
          <p>{text}</p>
        </TextArea>
        <Buttons
          innerRef={(e) => (this.buttons = e)} // eslint-disable-line
          isScrolling={isScrolling}
        >
          <Previous />
          <Next />
        </Buttons>
      </OuterText>
    );
  }
}

export default LessonSpace;
