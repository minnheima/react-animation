import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1)), url(${(props) => props.bgphoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 28px;
  width: 50%;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
`;

const Slider = styled.div`
  position: relative;
  top: -10vw;
`;
const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  width: 100%;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
`;
const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};
const Box = styled(motion.div)<{ bgphoto: string }>`
  height: 200px;
  border-radius: 5px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -30,
    zIndex: 10,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};
const offset = 6;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  // console.log(data, isLoading);
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIdx = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1; // -1은 banner에 쓰고 있는 영화를 하나 빼야하기 때문
      const maxIdx = Math.floor(totalMovies / offset) - 1;
      setIdx((prev) => (prev === maxIdx ? 0 : prev + 1)); //prev+1만 할 게 아니라 madIdx가 되면 0으로 돌려줘야함
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner onClick={increaseIdx} bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={idx}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * idx, offset * idx + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween", duration: 0.3 }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    />
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
