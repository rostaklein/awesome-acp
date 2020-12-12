import { Divider } from "antd";
import React from "react";

import { SecondaryParagraph } from "../components/common.styles";
import { DonateList } from "../components/DonateList/DonateList";
import { PaypalForm } from "../components/PaypalForm/PaypalForm";
import { MainTemplate } from "../templates/main";

const Donate: React.FC = () => {
  return (
    <MainTemplate title="Donate">
      <h2>Donate</h2>
      <SecondaryParagraph>
        When donating coins to a character, we strongly recommend to put this
        character offline!
      </SecondaryParagraph>
      <PaypalForm />
      <Divider />
      <h2>Previous donates</h2>
      <DonateList />
    </MainTemplate>
  );
};

export default Donate;
