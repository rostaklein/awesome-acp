import React from "react";
import { Button } from "antd";

import { useAppState, useAppDispatch } from "../../context/userContext";
import { useAuthToken } from "../../utils/useAuthToken";
import { PaypalForm } from "../PaypalForm/PaypalForm";

export const UserDashboard: React.FC = () => {
  const { currentUser } = useAppState();

  if (!currentUser) {
    throw new Error(
      "Should have not displayed this component when current user is not set."
    );
  }

  return <></>;
};
