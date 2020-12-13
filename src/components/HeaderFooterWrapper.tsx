import { Row, Col, Button } from "antd";
import { Link } from "gatsby";
import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { useAppState } from "../context/userContext";

import { MainWrapper, Container, PageContainer, Footer } from "./common.styles";
import { LoginOrRegister } from "./LoginOrRegister";
import { LogoutButton } from "./LogoutButton";
import { TopHeader } from "./TopHeader/TopHeader";

export const HeaderFooterWrapper: React.FC = ({ children }) => {
  const { currentUser } = useAppState();
  return (
    <MainWrapper>
      <Container>
        <Button icon={<ArrowLeftOutlined />} type="link" href="http://100ka.cz">
          Back to Main Page
        </Button>
      </Container>
      <Container style={{ margin: "35px auto" }}>
        <Row align="middle">
          <Col xs={{ span: 24, order: 2 }} md={{ span: 16, order: 1 }}>
            <Link to="/">
              <h1 style={{ margin: 0 }}>Lineage 2 100ka - Account Panel</h1>
            </Link>
          </Col>
          <Col xs={{ span: 24, order: 1 }} md={{ span: 8, order: 2 }}>
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
