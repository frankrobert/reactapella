import styled from 'styled-components';
import COLORS from '../../constants/colors';

const Button = styled.button`
  width: 200px;
  height: 200px;
  color: #fff;
  border: 2px solid #222;
  border-radius: 25px;
  background-color: ${COLORS.RED};
  cursor: pointer;
  position: relative;
  transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);

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

export default Button;
