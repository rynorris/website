import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import "es6-shim";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/helmet";
import {Container} from "./container";
import { ConnectedContactPage } from "./pages/contact-page";
import { DynamicPage } from "./pages/dynamic-page";
import { store } from "./state/store";

const appElement = document.getElementById("app");

// TODO: Get theme from API.
const theme = createMuiTheme({
  palette: {
    primary: { main: "#C2DC5D" },
    secondary: { main: "#59BBE0" },
    background: { default: "#DDDDDD" },
    error: { main: "#FF7777" },
  },
});

if (appElement != null) {
  ReactDOM.render((
    <Provider store={store}>
      <Header />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Container>
            <Switch>
              <Route path="/contact" component={ConnectedContactPage} />
              <Route path="/:pageId" component={DynamicPage} />
              <Redirect from="*" to="/home" />
            </Switch>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  ), appElement);
} else {
  console.error("Did not find element with id 'app'");
}
