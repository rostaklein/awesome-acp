import { Row, Col } from "antd";
import { Link } from "gatsby";
import React from "react";

import { useAppState } from "../context/userContext";

import { MainWrapper, Container, PageContainer, Footer } from "./common.styles";
import { LoginOrRegister } from "./LoginOrRegister";
import { LogoutButton } from "./LogoutButton";
import { TopHeader } from "./TopHeader/TopHeader";

export const HeaderFooterWrapper: React.FC = ({ children }) => {
  const { currentUser } = useAppState();
  return (
    <MainWrapper>
      <Container style={{ margin: "35px auto" }}>
        <Row align="middle">
          <Col span={16}>
            <Link to="/">
              <h1 style={{ margin: 0 }}>Lineage 2 100ka - Account Panel</h1>
            </Link>
          </Col>
          <Col span={8}>
            <Row justify="end">
              <LogoutButton />
            </Row>
          </Col>
        </Row>
      </Container>
      <PageContainer>
        {currentUser ? (
          <>
            <TopHeader />
            <div className="inner">{children}</div>
          </>
        ) : (
          <div className="inner">
            <LoginOrRegister />
          </div>
        )}
      </PageContainer>
      <Container>
        <Footer>
          © 2020 L2 100ka - All rights reserved <span>|</span> Awesome ACP
        </Footer>
      </Container>
    </MainWrapper>
  );
};
