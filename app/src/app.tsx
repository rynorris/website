import "es6-shim";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Container} from "./container";
import AboutPage from "./pages/about-page";
import ContactPage from "./pages/contact-page";
import FrontPage from "./pages/front-page";
import ServicesPage from "./pages/services-page";
import TeachersPage from "./pages/teachers-page";

const appElement = document.getElementById("app");

if (appElement != null) {
  ReactDOM.render((
    <MuiThemeProvider>
      <BrowserRouter>
        <Container>
          <Switch>
            <Route path="/front" component={FrontPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/teachers" component={TeachersPage} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/contact" component={ContactPage} />
            <Redirect from="*" to="/front" />
          </Switch>
        </Container>
      </BrowserRouter>
    </MuiThemeProvider>
  ), appElement);
} else {
  console.error("Did not find element with id 'app'");
}
