import React from "react";
import { Button } from "antd";
import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "gatsby";

import { useAppDispatch, useAppState } from "../context/userContext";
import { useAuthToken } from "../utils/useAuthToken";

export const LogoutButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppState();
  const [, setAuthToken] = useAuthToken();

  const logout = () => {
    dispatch({ type: "SET_CURRENT_USER", user: null });
    setAuthToken(null);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <Link to="/">
        <strong style={{ margin: "0 10px" }}>
          <UserOutlined /> {currentUser.login}
        </strong>
      </Link>

      <Button onClick={logout} icon={<LoginOutlined />} size="small">
        Log Out
      </Button>
    </div>
  );
};
