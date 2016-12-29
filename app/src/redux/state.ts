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

let appReducer: Reducer<AppState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      return Object.assign({}, state, {
        auth: {
          loggedIn: true
        }
      });

    default:
      return state;
  }
};

export let store: Store<AppState> = createStore(appReducer);
