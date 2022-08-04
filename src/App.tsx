import styled from "styled-components";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: white;
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;
const boxVariants = {
  hover: {
    scale: 1.5,
    rotateZ: 90,
  },
  click: {
    scale: 1,
    borderRadius: "100px",
  },
  drag: {
    backgroundColor: "rgba(232,21,4)",
  },
};
function App() {
  return (
    <Wrapper>
      <Box variants={boxVariants} drag whileHover="hover" whileTap="click" whileDrag="drag"></Box>
      <Box drag></Box>
    </Wrapper>
  );
}

export default App;
