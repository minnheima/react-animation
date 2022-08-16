import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";

const Wrapper = styled.div`
  height: 300px;
  background-color: ${(props) => props.theme.black.veryDark};
  margin-top: 50px;
`;
const IconWrap = styled.div`
  width: 60%;
  margin: 0 20%;
  padding: 50px 0;
  svg {
    width: 25px;
    height: 25px;
    margin-right: 20px;
  }
`;

function Footer() {
  return (
    <>
      <Wrapper>
        <IconWrap>
          <FontAwesomeIcon icon={faFacebookF} />
          <FontAwesomeIcon icon={faInstagram} />
          <FontAwesomeIcon icon={faTwitter} />
          <FontAwesomeIcon icon={faYoutube} />
        </IconWrap>
      </Wrapper>
    </>
  );
}

export default Footer;
