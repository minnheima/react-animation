import { useLocation, useMatch } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { getSearch, ISearch, IGetMultiSearch } from "../api";
import { makeImagePath } from "../utils";

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

const Content = styled.div`
  height: 100vh;
  color: white;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(5, 1fr);
`;
const Movie = styled.div<{ bgphoto: string }>`
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

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetMultiSearch>(["keyword", keyword], () => getSearch(keyword)); //([keyword])
  console.log(data, isLoading); // 작동하긴함 (데이터를 가져오고있음)
  // console.log(location); //pathname...
  // console.log(keyword); // ex)thor
  const pathMatch = useMatch(`/search/:movieId`);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>검색중...</Loader>
      ) : (
        <>
          <SearchTitle>'{keyword}' 검색 결과입니다</SearchTitle>
          <Content>
            {data?.results.map((movie) => (
              <Movie key={movie.id} bgphoto={makeImagePath(movie.backdrop_path)}>
                <MovieTitle>{movie.original_name || movie.title}</MovieTitle>
              </Movie>
            ))}
          </Content>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
