import React from "react";
import { Helmet } from "react-helmet";
import { Global, css } from "@emotion/core";

import bg from "../images/100ka_acp_bg.jpg";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import { UserHandler } from "../components/UserHandler";
import { HeaderFooterWrapper } from "../components/HeaderFooterWrapper";

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
      {/* <TopHeader /> */}
      {/* <Container>
          <Logo src={logo} style={{ textAlign: "center" }} />
        </Container> */}
      {/* <Container>
          <RegisterHeader />
        </Container> */}
      <ErrorBoundary>
        <UserHandler />
        <HeaderFooterWrapper>{children}</HeaderFooterWrapper>
      </ErrorBoundary>
    </>
  );
};
