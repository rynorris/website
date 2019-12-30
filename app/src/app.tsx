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
import { ITheme } from "./services/site-service";
import { SetSite } from "./state/actions";
import { store } from "./state/store";
import { getInjectedConfiguration } from "./utils";

const appElement = document.getElementById("app");

const siteConfig = getInjectedConfiguration();
if (siteConfig != null) {
  store.dispatch(SetSite(siteConfig));
}

const themeConfig: ITheme = siteConfig != null ? siteConfig.theme : {
  colors: {
    background: "#DDDDDD",
    error: "#FF7777",
    primary: "#C2DC5D",
    secondary: "#59BBEo",
  },
};

const theme = createMuiTheme({
  palette: {
    background: { default: themeConfig.colors.background },
    error: { main: themeConfig.colors.error },
    primary: { main: themeConfig.colors.primary },
    secondary: { main: themeConfig.colors.secondary },
  },
});

const themeCss = `:root {
    --background-color: ${themeConfig.colors.background};
    --primary-color: ${themeConfig.colors.primary};
    --secondary-color: ${themeConfig.colors.secondary};
    --error-color: ${themeConfig.colors.error};
}`;

const themeElement = document.createElement("style");
themeElement.innerText = themeCss;
document.head.appendChild(themeElement);

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
