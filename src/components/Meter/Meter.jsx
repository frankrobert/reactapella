import styled from 'styled-components';

const Meter = styled.meter.attrs({
  min: 0,
  max: 100,
  low: (props) => props.low,
  high: (props) => props.high,
  value: (props) => props.value,
  optimum: (props) => props.optimum
})`
  height: 50px;
  width: 200px;
  ${(props) => (props.vertical ? 'transform: rotate(90deg)' : '')};
  & > * {
    transition: background 0.3s ease-in-out;
  }

  &::-webkit-meter-bar {
    border-radius: 25px;
    background: #b8bc9e;
    border: 2px solid #222;
    box-shadow: 0px 0px 20px 0px #63535b;
    position: relative;
  }
  &::-webkit-meter-optimum-value {
    border-radius: 50px;
    background: #629b89;
    height: 40px;
    width: 180px;
    max-width: 180px;
    margin: 5px;
  }
  &::-webkit-meter-suboptimum-value {
    border-radius: 50px;
    background: #fcd4a9;
    height: 40px;
    width: 180px;
    max-width: 180px;
    margin: 5px;
  }
  &::-webkit-meter-even-less-good-value {
    border-radius: 50px;
    background: #7a2e48;
    height: 40px;
    width: 180px;
    max-width: 180px;
    margin: 5px;
  }
`;

Meter.defaultProps = {
  optimum: 50,
  low: 40,
  high: 80,
  vertical: false
};

export default Meter;
