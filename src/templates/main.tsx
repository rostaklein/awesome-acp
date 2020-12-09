import React from "react";
import { Helmet } from "react-helmet";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/core";

import logo from "../images/ropa_logo_white.svg";
import bg from "../images/ropa_main_bg.jpg";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import { RegisterHeader } from "../components/RegisterHeader/RegisterHeader";
import { Container } from "../components/common.styles";
import { TopHeader } from "../components/TopHeader/TopHeader";
import { UserHandler } from "../components/UserHandler";

const MainWrapper = styled.main`
  margin: 10px 25px;
`;

const Logo = styled.img`
  width: 250px;
  height: 64px;
  margin: 25px 0;
`;

const PageContainer = styled(Container)`
  padding: 2rem 3rem;
  background-color: rgb(255 255 255 / 3%);
  margin: 45px auto;
`;

type Props = {
  title?: string;
};

export const MainTemplate: React.FC<Props> = ({ children, title }) => {
  const baseTitle = "100ka - awesome account panel";
  const htmlTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  return (
    <>
      <Helmet>
        <title>{htmlTitle}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        ></meta>
      </Helmet>
      <Global
        styles={css`
          body {
            &::after {
              content: "";
              background: url("${bg}") top center;
              background-repeat: no-repeat;
              opacity: 0.25;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              position: absolute;
              z-index: -1;
            }
          }
        `}
      />
      <TopHeader />
      <MainWrapper>
        <Container>
          <Logo src={logo} style={{ textAlign: "center" }} />
        </Container>
        <Container>
          <RegisterHeader />
        </Container>
        <PageContainer>
          <ErrorBoundary>
            <UserHandler />
            {children}
          </ErrorBoundary>
        </PageContainer>
      </MainWrapper>
    </>
  );
};
