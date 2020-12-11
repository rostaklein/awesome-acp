import React from "react";

import { PaypalForm } from "../components/PaypalForm/PaypalForm";
import { MainTemplate } from "../templates/main";

const Donate: React.FC = () => {
  return (
    <MainTemplate title="Donate">
      <h2>Donate</h2>
      <PaypalForm />
    </MainTemplate>
  );
};

export default Donate;
