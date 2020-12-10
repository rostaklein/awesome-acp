import React from "react";
import styled from "@emotion/styled";
import {
  UserOutlined,
  UnorderedListOutlined,
  CloudDownloadOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import { Container } from "../common.styles";
import { useAppState } from "../../context/userContext";

import { MenuLink } from "./MenuLink";

const HeaderBg = styled.div`
  background-color: rgb(255 255 255 / 3%);
`;

const Nav = styled.nav`
  display: flex;
`;

export const TopHeader: React.FC = () => {
  const { currentUser } = useAppState();
  return (
    <HeaderBg>
      <Container>
        <Nav>
          <MenuLink to="/">Home</MenuLink>
          <MenuLink to="/features" icon={<UnorderedListOutlined />}>
            Features
          </MenuLink>
          <MenuLink to="/downloads" icon={<CloudDownloadOutlined />}>
            Downloads
          </MenuLink>
          <MenuLink to="/statistics" icon={<BarChartOutlined />}>
            Statistics
          </MenuLink>
          <MenuLink to="/discord">Discord</MenuLink>
          <MenuLink
            to="/account"
            icon={<UserOutlined />}
            primary
            isActive={Boolean(currentUser)}
          >
            {currentUser?.login ?? "Account Panel"}
          </MenuLink>
        </Nav>
      </Container>
    </HeaderBg>
  );
};
