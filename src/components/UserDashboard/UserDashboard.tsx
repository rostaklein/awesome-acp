import React from "react";
import { Button } from "antd";

import { useAppState, useAppDispatch } from "../../context/userContext";
import { useAuthToken } from "../../utils/useAuthToken";
import { PaypalForm } from "../PaypalForm/PaypalForm";

export const UserDashboard: React.FC = () => {
  const { currentUser } = useAppState();
  const dispatch = useAppDispatch();
  const [, setAuthToken] = useAuthToken();

  const logout = () => {
    dispatch({ type: "SET_CURRENT_USER", user: null });
    setAuthToken(null);
  };
  if (!currentUser) {
    throw new Error(
      "Should have not displayed this component when current user is not set."
    );
  }

  return (
    <>
      <p>
        Logged in as {currentUser.login} ({currentUser.email})
      </p>
      <PaypalForm />
      <Button onClick={logout}>Log Out</Button>
    </>
  );
};
