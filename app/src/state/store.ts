import {createStore, Store} from "redux";

import { AppState } from "./model";
import { appReducer } from "./reducer";

export let store: Store<AppState> = createStore(appReducer);
