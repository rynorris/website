import "es6-shim";
import * as React from "react";
import * as ReactDOM from "react-dom"
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {createHistory} from "history";
import {Redirect, Route, Router, useRouterHistory} from "react-router";
import {Container} from "./container";

// Needed for onTouchTap.
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const history = useRouterHistory(createHistory)({basename: "/app"});

const appElement = document.getElementById("app");

if (appElement != null) {
  ReactDOM.render((
    <MuiThemeProvider>
      <Router history={history}>
        <Route path="/" component={Container} />
      </Router>
    </MuiThemeProvider>
  ), appElement);
} else {
  console.error("Did not find element with id 'app'");
}
