import * as React from "react";
import Paper from "material-ui/Paper";

import FloatingLogo from "./components/floating-logo";
import ImageGallery from "./components/image-gallery";
import LoginWidget from "./components/login-widget";
import Navbar from "./components/navbar";

import ScrollListener from "./components/scroll-listener";
import ServiceProvider from "./services/service-provider";
import { Dispatch } from "redux";
import { AppState } from "./state/model";
import { SetSite } from "./state/actions";
import { connect } from "react-redux";
import { SiteService, Site } from "./services/site-service";

const headerImages: string[] = [
  "/api/images/dtc-mindmap.banner.jpg",
  "/api/images/snow-writing.banner.jpg",
  "/api/images/Girl writing.banner.jpeg",
  "/api/images/Ipad apps tilted.banner.jpeg",
];

const logoImage: string = "/api/images/dtc-logo-small.jpg";

interface IStateProps {
  site: Site;
}

interface IDispatchProps {
  setSite: (site: Site) => void;
}

type IAppHeaderProps = IStateProps & IDispatchProps;

interface IAppHeaderState {
  navbarFixed: boolean;
}

class AppHeader extends React.Component<IAppHeaderProps, IAppHeaderState> {
  state: Readonly<IAppHeaderState> = {
    navbarFixed: false,
  };

  componentDidMount() {
    const siteService: SiteService = ServiceProvider.SiteService();
    siteService.loadSite().then(this.props.setSite);
  }

  render() {
    const { site } = this.props;

    const navbarLinks = site.pages.map(p => "/" + p.id);
    const navbarTitles = site.pages.map(p => p.title);

    return (
      <div className="app-header">
        <Paper zDepth={1} rounded={false}>
          <LoginWidget />
          <FloatingLogo src={logoImage} />
          <div className="app-header-image-container">
            <ImageGallery images={headerImages} interval={10000} />
          </div>
          <ScrollListener onScroll={this.handleScroll.bind(this)} />
        </Paper>
        <Navbar links={navbarLinks} titles={navbarTitles} fixed={this.state.navbarFixed} />
      </div>
    );
  }

  private handleScroll(top: number) {
    const navbarFixed = top <= 0 ? true : false;
    this.setState({ navbarFixed });
  }
}

function mapStateToProps(state: AppState): IStateProps {
  return {
    site: state.site,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>): IDispatchProps {
  return {
    setSite: (site: Site) => dispatch(SetSite(site)),
  };
}

export const ConnectedAppHeader = connect(mapStateToProps, mapDispatchToProps)(AppHeader);
