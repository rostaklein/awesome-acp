import React from "react";
import { Row, Button, Col } from "antd";
import { DownloadOutlined, UserAddOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Link } from "gatsby";

const DividerAnd = styled.div`
  text-align: center;
  margin: 5px 0;
`;

const Title = styled.h4`
  text-align: center;
`;

const CenteredCol = styled(Col)`
  text-align: center;
`;

export const RegisterHeader: React.FC = () => (
  <>
    <Row align="middle" justify="center">
      <Title>Lets make the Interlude great again. Join us today!</Title>
    </Row>
    <Row align="middle" justify="center" gutter={24}>
      <CenteredCol xs={24} md={5}>
        <Link to="/account">
          <Button type="primary" size="large" icon={<UserAddOutlined />}>
            Register account
          </Button>
        </Link>
      </CenteredCol>
      <CenteredCol xs={24} sm={2} md={1}>
        <DividerAnd>and</DividerAnd>
      </CenteredCol>
      <CenteredCol xs={24} md={5}>
        <Link to="/downloads">
          <Button type="ghost" size="large" icon={<DownloadOutlined />}>
            Download patch
          </Button>
        </Link>
      </CenteredCol>
    </Row>
  </>
);
