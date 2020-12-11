import React from "react";

import { Characters } from "../components/Characters/Characters";
import { MainTemplate } from "../templates/main";

const Index: React.FC = () => {
  return (
    <MainTemplate>
      <h2>Your characters</h2>
      <Characters />
    </MainTemplate>
  );
};

export default Index;
