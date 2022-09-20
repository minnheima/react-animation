import styled from "styled-components";
import { getTv, IGetTv } from "../api";
import { makeImagePath, TvTypes } from "../utils";
import { useQuery } from "react-query";
import TvSlider from "../Components/TvSlider";
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

function Tv() {
  const { data, isLoading } = useQuery<IGetTv>(["tvshow", "on_the_air"], () => getTv(TvTypes.on_the_air));
  const bannerIdx = 0;
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            // bgphoto="https://ang-projects.com/public/uploads/contents/testi-no-image.png"
            bgphoto={
              data?.results[bannerIdx].backdrop_path || data?.results[bannerIdx].poster_path !== null
                ? makeImagePath(data?.results[bannerIdx].poster_path || "")
                : "https://ang-projects.com/public/uploads/contents/testi-no-image.png"
            }
          >
            <Title>{data?.results[bannerIdx].name}</Title>
            <Overview>{data?.results[bannerIdx].overview}</Overview>
          </Banner>
          <TvSlider type={TvTypes.on_the_air} />
          <TvSlider type={TvTypes.airing_today} />
          <TvSlider type={TvTypes.popular} />
          <TvSlider type={TvTypes.top_rated} />
          <Footer />
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
