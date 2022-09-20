import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath, Types } from "../utils";
import MovieSlider from "../Components/MovieSlider";
import Footer from "../Components/Footer";

const Wrapper = styled.div`
  background-color: black;
  height: auto;
  overflow-x: hidden;
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

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "now_playing"], () => getMovies(Types.now_playing));

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
          <MovieSlider type={Types.now_playing} />
          <MovieSlider type={Types.popular} />
          <MovieSlider type={Types.top_rated} />
          <MovieSlider type={Types.upcoming} />
          <Footer />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
