import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import styled from "styled-components";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { getTv, IGetTv } from "../api";
import { makeImagePath, TvTypes } from "../utils";

const SliderWrap = styled.div`
  position: relative;
  top: -10vw;
  height: 250px;
  margin-bottom: 20px;
`;
const SliderCategory = styled.h3`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 5px;
  padding-left: 60px;
  text-transform: uppercase;
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
  position: relative;
  height: 200px;
  border-radius: 5px;
  overflow: hidden;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  z-index: 0;
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
    zIndex: 5,
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
const TvDetail = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 70vh;
  min-height: 350px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 10px;
  overflow: auto;
  z-index: 6;
  background-color: ${(props) => props.theme.black.darker};
  ::-webkit-scrollbar-thumb {
    background: #999;
    border-radius: 5px;
  }
`;
const TvCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;
const TvWrap = styled.div`
  position: relative;
  top: -60px;
  padding: 0 30px;
  color: ${(props) => props.theme.white.lighter};
`;
const TvTitle = styled.h3`
  font-size: 36px;
`;
const TvOverview = styled.p`
  font-size: 18px;
  margin-top: 10px;
`;

const offset = 6;

function TvSlider({ type }: { type: TvTypes }) {
  const { scrollY } = useScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 110);
  const navigate = useNavigate(); // useHistory() -> useNavigate() : React router dom v6
  const { data, isLoading } = useQuery<IGetTv>(["tvshow", type], () => getTv(type));
  const tvPathMatch = useMatch(`/tv/${type}/:tvId`);

  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIdx = () => {
    setBack(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = data.results.length - 1; // -1은 banner에 쓰고 있는 영화를 하나 빼야하기 때문
      const maxIdx = Math.floor(totalTv / offset) - 1;
      setIdx((prev) => (prev === maxIdx ? 0 : prev + 1)); //prev+1만 할 게 아니라 madIdx가 되면 0으로 돌려줘야함
    }
  };
  const decreaseIdx = () => {
    setBack(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = data.results.length - 1;
      const maxIdx = Math.floor(totalTv / offset) - 1;
      setIdx((prev) => (prev === 0 ? maxIdx : prev - 1));
    }
  };
  const onBoxClicked = ({ tvId, category }: { tvId: number; category: string }) => {
    navigate(`/tv/${category}/${tvId}`);
  };
  const onOverlayClick = () => {
    navigate("./");
  };

  const clickedTvShow = tvPathMatch?.params.tvId && data?.results.find((tv) => tv.id + "" === tvPathMatch.params.tvId);
  // console.log(clickedMovie);

  return (
    <>
      <SliderWrap>
        <AnimatePresence custom={back} initial={false} onExitComplete={toggleLeaving}>
          <SliderCategory>
            {type === TvTypes.on_the_air
              ? "on the air"
              : type === TvTypes.airing_today
              ? "airing today"
              : type === TvTypes.top_rated
              ? "top rated"
              : type}
          </SliderCategory>
          <Row
            custom={back}
            key={idx}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
          >
            {type === TvTypes.on_the_air
              ? data?.results
                  .slice(1)
                  .slice(offset * idx, offset * idx + offset)
                  .map((tv) => (
                    <Box
                      key={type + tv.id}
                      layoutId={type + tv.id + ""}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      bgphoto={makeImagePath(tv.poster_path, "w500")}
                      onClick={() => onBoxClicked({ tvId: tv.id, category: type })}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))
              : data?.results?.slice(offset * idx, offset * idx + offset).map((tv) => (
                  <Box
                    key={type + tv.id}
                    layoutId={type + tv.id + ""}
                    variants={boxVariants}
                    whileHover="hover"
                    initial="normal"
                    bgphoto={makeImagePath(tv.poster_path, "w500")}
                    onClick={() => onBoxClicked({ tvId: tv.id, category: type })}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tv.name}</h4>
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
      </SliderWrap>
      <AnimatePresence>
        {tvPathMatch ? (
          <>
            <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <TvDetail style={{ top: setScrollY }} layoutId={type + tvPathMatch.params.tvId}>
              {clickedTvShow && (
                <>
                  <TvCover
                    style={{
                      backgroundImage: `linear-gradient(to top,#181818, transparent),url(${makeImagePath(
                        clickedTvShow.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <TvWrap>
                    <TvTitle>{clickedTvShow.name}</TvTitle>
                    <TvOverview>{clickedTvShow.overview}</TvOverview>
                  </TvWrap>
                </>
              )}
              <BtnClose onClick={onOverlayClick}>
                <FontAwesomeIcon icon={faCircleXmark} />
              </BtnClose>
            </TvDetail>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default TvSlider;
