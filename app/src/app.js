"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var history_1 = require("history");
var react_router_1 = require("react-router");
var container_1 = require("./container");
var history = react_router_1.useRouterHistory(history_1.createHistory)({ basename: "/app" });
var appElement = document.getElementById("app");
if (appElement != null) {
    ReactDOM.render((<react_router_1.Router history={history}>
      <react_router_1.Route path="/" component={container_1.Container}/>
    </react_router_1.Router>), appElement);
}
