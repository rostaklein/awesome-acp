import { Row, Col } from "antd";
import { Link } from "gatsby";
import React from "react";

import { MainWrapper, Container, PageContainer } from "./common.styles";
import { LogoutButton } from "./LogoutButton";
import { TopHeader } from "./TopHeader/TopHeader";

export const HeaderFooterWrapper: React.FC = ({ children }) => {
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
        <TopHeader />
        <div className="inner">{children}</div>
      </PageContainer>
    </MainWrapper>
  );
};
