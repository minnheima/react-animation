import styled from "styled-components";

const Title = styled.h1`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Tv() {
  return (
    <div>
      <Title>TV show</Title>
    </div>
  );
}

export default Tv;
