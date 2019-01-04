import "es6-shim";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Container} from "./container";
import ContactPage from "./pages/contact-page";
import DynamicPage from "./pages/dynamic-page";

const appElement = document.getElementById("app");

if (appElement != null) {
  ReactDOM.render((
    <MuiThemeProvider>
      <BrowserRouter>
        <Container>
          <Switch>
            <Route path="/contact" component={ContactPage} />
            <Route path="/:pageId" component={DynamicPage} />
            <Redirect from="*" to="/home" />
          </Switch>
        </Container>
      </BrowserRouter>
    </MuiThemeProvider>
  ), appElement);
} else {
  console.error("Did not find element with id 'app'");
}
