import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgb(238, 0, 153), rgb(221, 0, 238));
`;
const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  position: absolute;
  top: 100px;
  text-align: center;
  line-height: 200px;
  font-size: 28px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;
const Btn = styled.button`
  display: inline-block;
  padding: 3px 5px;
`;
const boxVariants = {
  invisible: {
    opacity: 0,
    scale: 0,
    x: 500,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: -500,
  },
};
function App() {
  const [visible, setVisible] = useState(1);
  const nextContents = () => setVisible((prev) => (prev === 10 ? 10 : prev + 1));
  const prevContents = () => setVisible((prev) => (prev === 1 ? 1 : prev - 1));

  //지금은 prev 버튼을 눌러도 next 버튼을 눌렀을 때와 같은 방향으로 움직인다. 다음강의에서 변경하기
  return (
    <Wrapper>
      <AnimatePresence>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) =>
          i === visible ? (
            <Box key={i} variants={boxVariants} initial="invisible" animate="visible" exit="exit">
              {i}
            </Box>
          ) : null
        )}
      </AnimatePresence>
      <Btn onClick={prevContents}>prev</Btn>
      <Btn onClick={nextContents}>next</Btn>
    </Wrapper>
  );
}

export default App;
