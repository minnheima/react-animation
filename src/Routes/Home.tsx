import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Components/Footer";

const Wrapper = styled.div`
  background-color: black;
  height: auto;
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
  font-weight: 400;
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
  height: 250px;
  margin-bottom: 20px;
`;
const SliderTitle = styled.h3`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 5px;
  padding-left: 60px;
`;
const SliderBtn = styled.span`
  position: absolute;
  width: auto;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  svg {
    height: 50px;
  }
`;
const SliderRBtn = styled(SliderBtn)`
  right: 10px;
`;
const SliderLBtn = styled(SliderBtn)`
  left: 10px;
`;
const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  margin: 0 2.5%;
  width: 95%;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
`;
const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.outerWidth : window.outerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: back ? window.outerWidth : -window.outerWidth,
  }),
};
const Box = styled(motion.div)<{ bgphoto: string }>`
  height: 200px;
  border-radius: 5px;
  overflow: hidden;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
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
    scale: 1.4,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};
const Info = styled(motion.div)`
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  h4 {
    font-weight: 500;
    font-size: 18px;
  }
`;
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      type: "tween",
    },
  },
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const MovieDetail = styled(motion.div)`
  position: absolute;
  width: 45vw;
  height: 70vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.darker};
`;
const MovieCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;
const BtnClose = styled.span`
  position: absolute;
  right: 12px;
  top: 10px;
  width: 30px;
  height: 30px;
  font-size: 30px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    color: ${(props) => props.theme.white.darker};
  }
`;
const MovieWrap = styled.div`
  position: relative;
  top: -60px;
  padding: 0 30px;
  color: ${(props) => props.theme.white.lighter};
`;
const MovieTitle = styled.h3`
  font-size: 36px;
`;

const MovieOverview = styled.p`
  font-size: 18px;
  margin-top: 10px;
`;

const offset = 6;

function Home() {
  const history = useNavigate(); // useHistory() -> useNavigate() : React router dom v6
  const moviePathMatch = useMatch("/movies/:movieId");
  // console.log(bigMovieMatch);
  const { scrollY } = useScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 110);

  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  // console.log(data, isLoading);  // undefined true :Object false
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const increaseIdx = () => {
    setBack(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1; // -1은 banner에 쓰고 있는 영화를 하나 빼야하기 때문
      const maxIdx = Math.floor(totalMovies / offset) - 1;
      setIdx((prev) => (prev === maxIdx ? 0 : prev + 1)); //prev+1만 할 게 아니라 madIdx가 되면 0으로 돌려줘야함
    }
  };
  const decreaseIdx = () => {
    setBack(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIdx = Math.floor(totalMovies / offset) - 1;
      setIdx((prev) => (prev === 0 ? maxIdx : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history(`/movies/${movieId}`);
  };
  const onOverlayClick = () => {
    history("/");
  };

  const clickedMovie =
    moviePathMatch?.params.movieId && data?.results.find((movie) => movie.id + "" === moviePathMatch.params.movieId);
  console.log(clickedMovie);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderTitle>Now Playing</SliderTitle>
            <AnimatePresence custom={back} initial={false} onExitComplete={toggleLeaving}>
              <Row
                custom={back}
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
                      layoutId={movie.id + ""}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween", duration: 0.3 }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      onClick={() => onBoxClicked(movie.id)} /* movie.id를넘기기위해 익명함수*/
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <SliderLBtn onClick={decreaseIdx}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </SliderLBtn>
            <SliderRBtn onClick={increaseIdx}>
              <FontAwesomeIcon icon={faAngleRight} />
            </SliderRBtn>
          </Slider>
          <AnimatePresence>
            {moviePathMatch ? (
              <>
                <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                <MovieDetail style={{ top: setScrollY }} layoutId={moviePathMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <MovieCover
                        style={{
                          backgroundImage: `linear-gradient(to top,#181818, transparent),url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <MovieWrap>
                        <MovieTitle>{clickedMovie.title}</MovieTitle>
                        <MovieOverview>{clickedMovie.overview}</MovieOverview>
                      </MovieWrap>
                    </>
                  )}
                  <BtnClose onClick={onOverlayClick}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </BtnClose>
                </MovieDetail>
              </>
            ) : null}
          </AnimatePresence>
          <Footer />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
