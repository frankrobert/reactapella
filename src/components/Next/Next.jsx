import styled from 'styled-components';
import Button from '../Button/Button';

export default styled(Button)`
  width: 30px;
  height: 20px;
  color: #222;
  border: unset;
  border-radius: unset;
  background-color: unset;
  cursor: pointer;
  position: relative;
  transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);

  &::after {
    content: '→';
    font-size: 24px;
    position: absolute;
    top: 50%;
    left: 50;
    transform: translate(-50%, -50%);
  }


  &:hover {
    box-shadow: 0px 0px 20px 0px #63535b;
    transform: scale(1.01, 1.01);
  }

  &:focus {
    outline: none;
  }

  &:active {
    box-shadow: inset 0px 0px 12px 3px #63535b;
  }
`;