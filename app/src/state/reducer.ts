import { Action, Reducer } from "redux";

import { LoginAction, ToastAction, SetSiteAction } from "./actions";
import { AppState } from "./model";

// Initial State.
const initialState: AppState = {
  auth: {
    user: null,
  },
  site: {
      banner: {
          images: [],
      },
      contact: {
          email: "",
          phone: "",
      },
      logo: "",
      pages: [],
      title: "Website",
  },
  toaster: {
    open: false,
    text: "",
  }
};

export const appReducer: Reducer<AppState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case "SITE/SET":
      return { ...state, site: (action as SetSiteAction).site };

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
