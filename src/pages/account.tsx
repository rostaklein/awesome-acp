import React from "react";

import { LoginOrRegister } from "../components/LoginOrRegister";
import { MainTemplate } from "../templates/main";

const Account: React.FC = () => {
  return (
    <MainTemplate title="Account">
      <LoginOrRegister />
    </MainTemplate>
  );
};

export default Account;
