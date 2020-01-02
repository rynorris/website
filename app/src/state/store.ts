import { applyMiddleware, createStore, Store } from "redux";
import thunk from "redux-thunk";

import { IAppState } from "./model";
import { appReducer } from "./reducer";

export let store: Store<IAppState> = createStore(appReducer, applyMiddleware(thunk));
