import React from "react";

import { AppContextProvider } from "../context/userContext";
import { UserHandler } from "../components/UserHandler";

export const MainContextProvider: React.FC = ({ children }) => (
  <AppContextProvider>
    <UserHandler />
    {children}
  </AppContextProvider>
);
