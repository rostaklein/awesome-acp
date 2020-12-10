import React, { useEffect } from "react";
import axios from "axios";

import { useAppDispatch, useAppState } from "../context/userContext";
import { useAuthToken } from "../utils/useAuthToken";
import { UserAuthApiResponse } from "../../backend/controllers/account.controller";

export const UserHandler: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppState();
  const [token, setAuthToken] = useAuthToken();

  const setIsLoading = (isLoading: boolean) => {
    dispatch({ type: "SET_USER_LOADING", isLoading });
  };

  const tryLoadingUser = async () => {
    const { data } = await axios.get<UserAuthApiResponse>("/api/me");

    setAuthToken(data.token);

    const { account } = data;
    dispatch({
      type: "SET_CURRENT_USER",
      user: account,
    });
  };

  useEffect(() => {
    if (token && !currentUser) {
      setIsLoading(true);
      tryLoadingUser()
        .catch((err) => {
          if (err?.response?.status === 401) {
            setAuthToken(null);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return null;
};
