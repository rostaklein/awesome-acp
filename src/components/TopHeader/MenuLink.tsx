import React from "react";
import styled from "@emotion/styled";
import { Link } from "gatsby";

import { primaryColor } from "../common.styles";

const MenuIconWrapper = styled.div`
  display: inline-block;
  margin-right: 8px;
  transition: all 0.2s;
`;

const StyledLink = styled(Link)<{ primary?: boolean }>`
  color: ${({ primary }) => (primary ? primaryColor : "white")};
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  padding: 10px 0;
  margin: 0 2px;
  transition: all 0.2s;
  width: 100%;
  display: inline-block;

  &.active {
    background: rgb(255 255 255 / 5%);
    ${MenuIconWrapper} {
      opacity: 1;
    }
  }

  &:hover {
    background: ${({ primary }) =>
      primary ? "rgb(255 196 57 / 5%)" : "rgba(255 255 255 / 3%)"};
    transition: all 0.2s;
    ${MenuIconWrapper} {
      transition: all 0.2s;
      opacity: 1;
    }
  }
`;

interface Props {
  to: string;
  primary?: boolean;
  icon?: React.ReactNode;
}

export const MenuLink: React.FC<Props> = ({ to, icon, children, primary }) => (
  <StyledLink to={to} primary={primary} activeClassName="active">
    {icon && <MenuIconWrapper>{icon}</MenuIconWrapper>}
    {children}
  </StyledLink>
);
