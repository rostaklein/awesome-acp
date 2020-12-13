import styled from "@emotion/styled";
import { Spin } from "antd";

export const primaryColor = "#ffc439";
export const gray = "rgba(255,255,255,0.4)";
export const green = "#62ef61";
export const red = "#ef6161";

export const Container = styled.div`
  margin: 0 auto;
  max-width: 960px;
`;

export const MainWrapper = styled.main`
  margin: 10px 25px;
  @media only screen and (min-width: 600px) {
    margin-top: 140px;
  }
`;

export const Logo = styled.img`
  width: 250px;
  height: 64px;
  margin: 25px 0;
`;

export const PageContainer = styled(Container)`
  background-color: rgb(255 255 255 / 3%);
  margin: 15px auto;
  .inner {
    padding: 2rem 3rem;
    @media only screen and (max-width: 600px) {
      padding: 1rem;
    }
  }
`;

export const Footer = styled.footer`
  text-align: center;
  color: ${gray};
  span {
    color: rgba(255, 255, 255, 0.2);
    padding: 0 5px;
  }
`;

export const CenteredSpinner = styled(Spin)`
  margin: 20px auto;
  display: block;
`;

export const SecondaryParagraph = styled.p`
  color: ${gray};
`;
