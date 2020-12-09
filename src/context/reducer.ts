import { IUser } from "../../backend/repositories/user";

import { AppState } from "./userContext";

export type ActionTypes = "SET_CURRENT_USER" | "SET_USER_LOADING";

type ActionBase = {
  type: ActionTypes;
};

interface SetCurrentUser extends ActionBase {
  type: "SET_CURRENT_USER";
  user: IUser | null;
}

interface SetUserLoading extends ActionBase {
  type: "SET_USER_LOADING";
  isLoading: boolean;
}

export type Action = SetCurrentUser | SetUserLoading;

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_CURRENT_USER": {
      return {
        ...state,
        currentUser: action.user,
      };
    }
    case "SET_USER_LOADING": {
      return {
        ...state,
        userLoading: action.isLoading,
      };
    }
    default:
      return state;
  }
};
