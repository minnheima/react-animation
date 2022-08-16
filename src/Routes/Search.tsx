import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { getSearch, IGetMoviesResult, IGetMultiSearch } from "../api";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Footer from "../Components/Footer";

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
`;

const SearchCont = styled.div`
  height: 150vh;
  color: white;
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
  background-size: cover;
  border-radius: 5px;
  position: relative;
  transition: all 0.3s ease;
  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;
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
const DetailModal = styled(motion.div)``;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetMultiSearch>(["keyword", keyword], () => getSearch(keyword)); //querykey 필요
  console.log(data, isLoading); // 작동하긴함 (데이터를 가져오고있음)
  // console.log(location); //pathname...
  // console.log(keyword); // ex)thor
  // const pathMatch = useMatch(`/search/:movieId`);
  const moviePathMatch = useMatch("/movies/:movieId");
  const history = useNavigate();
  const onClickedDetail = (movieId: number) => {
    // history(`/movies/${movieId}`);
    console.log(movieId);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>검색중...</Loader>
      ) : (
        <>
          <SearchTitle>'{keyword}' 검색 결과입니다</SearchTitle>
          <SearchCont>
            {data?.results.map((movie) => (
              <Movie key={movie.id} bgphoto={makeImagePath(movie.backdrop_path)} onClick={() => onClickedDetail(movie.id)}>
                <MovieTitle>{movie.original_name || movie.title}</MovieTitle>
              </Movie>
            ))}
          </SearchCont>
          <AnimatePresence>
            {moviePathMatch ? (
              <>
                <Overlay></Overlay>
                <DetailModal></DetailModal>
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
