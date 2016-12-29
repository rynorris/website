import {createStore, Action, ActionCreator, Reducer, Store} from "redux";

// State model.
export interface AppState {
  auth: {
    loggedIn: boolean;
  };
  toaster: {
    open: boolean;
    text: string;
  };
}

// Initial State.
let initialState: AppState = {
  auth: {
    loggedIn: false
  },
  toaster: {
    open: false,
    text: "",
  }
};

// Actions.
interface LoginAction extends Action {
  type: "LOGIN";
}
export let Login: ActionCreator<LoginAction> = () => { return {type: "LOGIN"}; };

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
          loggedIn: true
        }
      });

    case "LOGOUT":
      return Object.assign({}, state, {
        auth: {
          loggedIn: false
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
