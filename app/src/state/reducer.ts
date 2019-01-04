import { Action, Reducer } from "redux";

import { LoginAction, ToastAction, SetPagesAction } from "./actions";
import { AppState } from "./model";

// Initial State.
const initialState: AppState = {
  auth: {
    user: null,
  },
  site: {
      pages: [],
  },
  toaster: {
    open: false,
    text: "",
  }
};

export const appReducer: Reducer<AppState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case "PAGES/SET":
      return { ...state, site: { ...state.site, pages: (action as SetPagesAction).pages } };

    case "LOGIN":
      return { ...state, auth: { user: (action as LoginAction).user } };

    case "LOGOUT":
      return { ...state, auth: { user: null } };

    case "TOAST":
      return { ...state, toaster: { open: true, text: (action as ToastAction).text } };

    case "CLOSE-TOAST":
      return { ...state, toaster: { open: false, text: "" } };

    default:
      return state;
  }
};
