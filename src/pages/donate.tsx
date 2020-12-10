import React from "react";

import { PaypalForm } from "../components/PaypalForm/PaypalForm";
import { MainTemplate } from "../templates/main";

const Donate: React.FC = () => {
  return (
    <MainTemplate title="Donate">
      <PaypalForm />
    </MainTemplate>
  );
};

export default Donate;
