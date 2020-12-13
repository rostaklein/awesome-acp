import React from "react";
import styled from "@emotion/styled";
import {
  UserOutlined,
  EuroCircleOutlined,
  BarChartOutlined,
  LockFilled,
} from "@ant-design/icons";
import { Col, Row } from "antd";

import { MenuLink } from "./MenuLink";

const Nav = styled(Row)`
  background: rgb(255 255 255 / 2%);
`;

export const TopHeader: React.FC = () => {
  return (
    <Nav>
      <Col xs={24} sm={12} md={6}>
        <MenuLink to="/" icon={<UserOutlined />}>
          Home
        </MenuLink>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <MenuLink to="/change-password" icon={<LockFilled />}>
          Change Password
        </MenuLink>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <MenuLink to="/statistics" icon={<BarChartOutlined />}>
          Statistics
        </MenuLink>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <MenuLink to="/donate" icon={<EuroCircleOutlined />}>
          Donate
        </MenuLink>
      </Col>
    </Nav>
  );
};
