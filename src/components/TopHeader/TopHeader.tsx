import React from "react";
import styled from "@emotion/styled";
import {
  UserOutlined,
  EuroCircleOutlined,
  BarChartOutlined,
  LockFilled,
} from "@ant-design/icons";

import { MenuLink } from "./MenuLink";

const Nav = styled.nav`
  display: flex;
  background: rgb(255 255 255 / 2%);
`;

export const TopHeader: React.FC = () => {
  return (
    <Nav>
      <MenuLink to="/" icon={<UserOutlined />}>
        Home
      </MenuLink>
      <MenuLink to="/change-password" icon={<LockFilled />}>
        Change Password
      </MenuLink>
      <MenuLink to="/statistics" icon={<BarChartOutlined />}>
        Statistics
      </MenuLink>
      <MenuLink to="/donate" icon={<EuroCircleOutlined />}>
        Donate
      </MenuLink>
    </Nav>
  );
};
