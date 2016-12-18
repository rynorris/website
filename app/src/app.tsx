import "es6-shim";
import * as React from "react";
import * as ReactDOM from "react-dom"
import {createHistory} from "history";
import {Redirect, Route, Router, useRouterHistory} from "react-router";
import {Container} from "./container";

const history = useRouterHistory(createHistory)({basename: "/app"});

const appElement = document.getElementById("app");

if (appElement != null) {
  ReactDOM.render((
    <Router history={history}>
      <Route path="/" component={Container} />
    </Router>
  ), appElement);
} else {
  console.error("Did not find element with id 'app'");
}
