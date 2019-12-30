import "es6-shim";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import { Header } from "./components/helmet";
import { Container } from "./container";
import { ConnectedContactPage } from "./pages/contact-page";
import { DynamicPage } from "./pages/dynamic-page";
import { store } from "./state/store";
import { getInjectedConfiguration } from "./utils";
import { SetSite } from "./state/actions";

const appElement = document.getElementById("app");

const siteConfig = getInjectedConfiguration();
if (siteConfig != null) {
  store.dispatch(SetSite(siteConfig));
}

// TODO: Get theme from API.
const theme = createMuiTheme({
  palette: {
    background: { default: "#DDDDDD" },
    error: { main: "#FF7777" },
    primary: { main: "#C2DC5D" },
    secondary: { main: "#59BBE0" },
  },
});

if (appElement != null) {
  ReactDOM.render((
    <Provider store={store}>
      <Header />
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Container>
            <Switch>
              <Route path="/contact" component={ConnectedContactPage} />
              <Route path="/:pageId" component={DynamicPage} />
              <Redirect from="*" to="/home" />
            </Switch>
          </Container>
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>
  ), appElement);
} else {
  throw new Error("Did not find element with id 'app'");
}
