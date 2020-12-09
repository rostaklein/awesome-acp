import React, { useReducer, useContext } from "react";

import { IUser } from "../../backend/repositories/user";

import { reducer, Action } from "./reducer";

export type AppState = {
  currentUser: IUser | null;
  userLoading: boolean;
};

type Context = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = React.createContext<Context | undefined>(undefined);

export const defaultState: AppState = {
  currentUser: null,
  userLoading: false,
};

export const AppContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("App context not defined while accessing it");
  }

  return context;
};

export const useAppState = (): AppState => useAppContext().state;
export const useAppDispatch = (): React.Dispatch<Action> =>
  useAppContext().dispatch;
