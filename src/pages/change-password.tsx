import { Col, Row } from "antd";
import React from "react";

import { ChangePassword } from "../components/ChangePassword/ChangePassword";
import { MainTemplate } from "../templates/main";

const ChangePasswordPage: React.FC = () => {
  return (
    <MainTemplate title="Change Password">
      <h2>Change Password</h2>
      <Row gutter={48} justify="center">
        <Col sm={8} xs={24}>
          <ChangePassword />
        </Col>
      </Row>
    </MainTemplate>
  );
};

export default ChangePasswordPage;
