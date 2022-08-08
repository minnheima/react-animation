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
  width: 400px;
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
  entry: (isBack: boolean) => ({
    opacity: 0,
    scale: 0,
    x: isBack ? -500 : 500,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (isBack: boolean) => ({
    opacity: 0,
    scale: 0,
    x: isBack ? 500 : -500,
  }),
};
function App() {
  const [visible, setVisible] = useState(1);
  const [back, setBack] = useState(false);
  const nextContents = () => {
    setBack(false);
    setVisible((prev) => (prev === 10 ? 10 : prev + 1));
  };

  const prevContents = () => {
    setBack(true);
    setVisible((prev) => (prev === 1 ? 1 : prev - 1));
  };
  return (
    <Wrapper>
      <AnimatePresence custom={back}>
        <Box
          custom={back}
          key={visible}
          variants={boxVariants}
          initial="entry"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7 }}
        >
          {visible}
        </Box>
      </AnimatePresence>
      <Btn onClick={prevContents}>prev</Btn>
      <Btn onClick={nextContents}>next</Btn>
    </Wrapper>
  );
}

export default App;
