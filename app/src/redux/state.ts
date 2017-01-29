import {createStore, Action, ActionCreator, Reducer, Store} from "redux";

import {UserInfo} from "../services/auth-service";

// State model.
export interface AppState {
  auth: {
    user: UserInfo | null;
  };
  toaster: {
    open: boolean;
    text: string;
  };
}

// Initial State.
let initialState: AppState = {
  auth: {
    user: null,
  },
  toaster: {
    open: false,
    text: "",
  }
};

// Actions.
interface LoginAction extends Action {
  type: "LOGIN";
  user: UserInfo;
}
export let Login: ActionCreator<LoginAction> = (user: UserInfo) => { return {type: "LOGIN", user: user}; };

interface LogoutAction extends Action {
  type: "LOGOUT";
}
export let Logout: ActionCreator<LogoutAction> = () => { return {type: "LOGOUT"}; };

interface ToastAction extends Action {
  type: "TOAST";
  text: string;
}
export let Toast: ActionCreator<ToastAction> = (text: string) => {
  return {type: "TOAST", text: text};
};

interface CloseToastAction extends Action {
  type: "CLOSE-TOAST";
}
export let CloseToast: ActionCreator<CloseToastAction> = () => { return {type: "CLOSE-TOAST"}; };


let appReducer: Reducer<AppState> = (state = initialState, action: Action) => {
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

export let store: Store<AppState> = createStore(appReducer);
