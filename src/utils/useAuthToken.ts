import axios from "axios";

import { useLocalStorage } from "./useLocalStorage";

const AUTH_TOKEN_KEY = "auth-token";

export const useAuthToken = (): [
  string | null,
  (token: string | null) => void
] => {
  const [tokenObject, setTokenObject] = useLocalStorage<{
    token: null | string;
  }>(AUTH_TOKEN_KEY, { token: null });

  const setToken = (token: string | null) => {
    setTokenObject({ token });
  };

  const { token } = tokenObject;

  return [token, setToken];
};

axios.interceptors.request.use((config) => {
  const tokenObject = window.localStorage.getItem(AUTH_TOKEN_KEY);

  const { token } = JSON.parse(tokenObject ?? "{}");

  if (token) {
    config.headers["x-authorization-token"] = token;
  }

  return config;
});
