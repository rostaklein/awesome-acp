import React from "react";
import { Row, Col, Spin } from "antd";
import styled from "@emotion/styled";

import { useAppState } from "../context/userContext";

import { Register } from "./Register/Register";
import { Login } from "./Login/Login";
import { UserDashboard } from "./UserDashboard/UserDashboard";

const CenteredSpinner = styled(Spin)`
  margin: 20px auto;
  display: block;
`;

export const LoginOrRegister: React.FC = () => {
  const { currentUser, userLoading } = useAppState();

  if (userLoading) {
    return <CenteredSpinner spinning />;
  }

  if (currentUser) {
    return <UserDashboard />;
  }

  return (
    <Row gutter={48} justify="center">
      <Col sm={8} xs={24}>
        <h2>Log In</h2>
        <Login />
      </Col>
      <Col sm={16} xs={24}>
        <h2>Register Game Account</h2>
        <Register />
      </Col>
    </Row>
  );
};
