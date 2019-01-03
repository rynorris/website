import "es6-shim";
import * as React from "react";
import * as ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {createHistory} from "history";
import {Redirect, Route, Router, useRouterHistory} from "react-router";
import {Container} from "./container";
import AboutPage from "./pages/about-page";
import ContactPage from "./pages/contact-page";
import FrontPage from "./pages/front-page";
import ServicesPage from "./pages/services-page";
import TeachersPage from "./pages/teachers-page";

const history = useRouterHistory(createHistory)({basename: "/"});

const appElement = document.getElementById("app");

if (appElement != null) {
  ReactDOM.render((
    <MuiThemeProvider>
      <Router history={history}>
        <Redirect from="/" to="/front" />
        <Route path="/" component={Container}>
          <Route path="front" component={FrontPage} />
          <Route path="about" component={AboutPage} />
          <Route path="teachers" component={TeachersPage} />
          <Route path="services" component={ServicesPage} />
          <Route path="contact" component={ContactPage} />
        </Route>
      </Router>
    </MuiThemeProvider>
  ), appElement);
} else {
  console.error("Did not find element with id 'app'");
}
