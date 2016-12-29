import {createStore, Action, ActionCreator, Reducer, Store} from "redux";

// State model.
export interface AppState {
  auth: {
    loggedIn: boolean;
  };
}

// Initial State.
let initialState: AppState = {
  auth: {
    loggedIn: false
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

    default:
      return state;
  }
};

export let store: Store<AppState> = createStore(appReducer);
