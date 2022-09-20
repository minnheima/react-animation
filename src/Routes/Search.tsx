import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { useState } from "react";
import { getMovieDetail, getSearch, IGetMovieDetail, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Footer from "../Components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const Wrapper = styled.div`
  width: 100%;
  padding: 80px 60px 0px;
  background-color: ${(props) => props.theme.black.veryDark};
`;
const SearchTitle = styled.h2`
  display: inline-block;
  font-size: 30px;
  font-weight: 400;
  margin: 50px 0 20px;
  color: white;
`;

const SearchCont = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(5, 1fr);
  height: auto;
  padding-bottom: 50px;
`;

const Movie = styled(motion.div)<{ bgphoto: string }>`
  width: 100%;
  height: 200px;
  padding: 20px;
  color: white;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
`;
const MovieVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    transition: {
      type: "tween",
      delay: 0.3,
    },
    zIndex: 5,
  },
};
const MovieTitle = styled.h3`
  position: absolute;
  bottom: 20px;
  font-size: 18px;
  font-weight: 400;
`;
const Loader = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
`;
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
const DetailCover = styled.div<{ bgphoto: string }>`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url(${(props) => props.bgphoto});
`;
const DetailWrap = styled.div`
  position: relative;
  top: -50px;
  padding: 0 30px;
  color: ${(props) => props.theme.white.lighter};
`;
const DetailTitle = styled.h2`
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 10px;
`;
const DetailOverview = styled.p`
  font-size: 18px;
  margin-top: 10px;
`;
const Genres = styled.span`
  font-size: 14px;
  margin-right: 5px;
`;
function Search() {
  const location = useLocation();
  const navigate = useNavigate(); //for redirecting
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetMoviesResult>(["keyword"], () => getSearch(keyword)); //querykey 필요
  const moviePathMatch = useMatch("/search/:movieId/");
  const { scrollY } = useScroll();
  const setScrollY = useTransform(scrollY, (value) => value + 110);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onClickedDetail = (movieId: number) => {
    navigate(`/search/${movieId}?category=movies&keyword=${keyword}`);
  };

  // const { data: movieDetail, isLoading: detailLoading } = useQuery<IGetMovieDetail>(
  //   [moviePathMatch?.params.movieId, "detail"],
  //   () => getMovieDetail(movieId)
  // );
  // console.log(movieDetail);

  const onOverlayClick = () => {
    navigate(`/search?keyword=${keyword}`);
  };
  const clickedMovie =
    moviePathMatch?.params.movieId && data?.results.find((movie) => movie.id + "" === moviePathMatch.params.movieId);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>검색중...</Loader>
      ) : (
        <>
          <SearchTitle>'{keyword}' 검색 결과입니다</SearchTitle>
          <SearchCont>
            {data?.results.map((movie) => (
              <Movie
                key={movie.id}
                layoutId={movie.id + ""}
                variants={MovieVariants}
                whileHover="hover"
                initial="normal"
                transition={{ type: "tween", duration: 0.3 }}
                bgphoto={
                  movie.poster_path || movie.backdrop_path !== null
                    ? makeImagePath(movie.backdrop_path || movie.poster_path, "w500")
                    : "https://ang-projects.com/public/uploads/contents/testi-no-image.png"
                }
                onClick={() => onClickedDetail(movie.id)}
              >
                <MovieTitle>{movie.original_name || movie.title || movie.name}</MovieTitle>
              </Movie>
            ))}
          </SearchCont>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            {moviePathMatch ? (
              <>
                <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                <MovieDetail style={{ top: setScrollY }} layoutId={moviePathMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <DetailCover
                        bgphoto={
                          clickedMovie.backdrop_path || clickedMovie.poster_path !== null
                            ? makeImagePath(clickedMovie.backdrop_path || clickedMovie.poster_path, "w500")
                            : "https://ang-projects.com/public/uploads/contents/testi-no-image.png"
                        }
                      />
                      <DetailWrap>
                        <DetailTitle>{clickedMovie.title}</DetailTitle>
                        <div>개봉일: {clickedMovie.release_date}</div>
                        <DetailOverview>{clickedMovie.overview}</DetailOverview>
                      </DetailWrap>
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

export default Search;
