import {createStore, Store} from "redux";

import { IAppState } from "./model";
import { appReducer } from "./reducer";

export let store: Store<IAppState> = createStore(appReducer);
