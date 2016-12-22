import "es6-shim";
import * as React from "react";
import * as ReactDOM from "react-dom"
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {createHistory} from "history";
import {Redirect, Route, Router, useRouterHistory} from "react-router";
import {Container} from "./container";
import FrontPage from "./pages/front-page";
import TeachersPage from "./pages/teachers-page";

// Needed for onTouchTap.
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const history = useRouterHistory(createHistory)({basename: "/"});

const appElement = document.getElementById("app");

if (appElement != null) {
  ReactDOM.render((
    <MuiThemeProvider>
      <Router history={history}>
        <Redirect from="/" to="/front" />
        <Route path="/" component={Container}>
          <Route path="front" component={FrontPage} />
          <Route path="teachers" component={TeachersPage} />
        </Route>
      </Router>
    </MuiThemeProvider>
  ), appElement);
} else {
  console.error("Did not find element with id 'app'");
}
