import { Action, Reducer } from "redux";

import { LoginAction, ToastAction } from "./actions";
import { AppState } from "./model";

// Initial State.
const initialState: AppState = {
  auth: {
    user: null,
  },
  toaster: {
    open: false,
    text: "",
  }
};

export const appReducer: Reducer<AppState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      return Object.assign({}, state, {
        auth: {
          user: (action as LoginAction).user,
        }
      });

    case "LOGOUT":
      return Object.assign({}, state, {
        auth: {
          user: null,
        }
      });

    case "TOAST":
      let toast: ToastAction = action as ToastAction;
      return Object.assign({}, state, {
        toaster: {
          open: true,
          text: toast.text,
        }
      });

    case "CLOSE-TOAST":
      return Object.assign({}, state, {
        toaster: {
          open: false,
          text: "",
        }
      });

    default:
      return state;
  }
};
