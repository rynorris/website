import * as React from "react";
import Paper from "material-ui/Paper";

import { FloatingLogo } from "./components/floating-logo";
import { ImageGallery } from "./components/image-gallery";
import { LoginWidget } from "./components/login-widget";
import Navbar from "./components/navbar";

import ScrollListener from "./components/scroll-listener";
import ServiceProvider from "./services/service-provider";
import { Dispatch } from "redux";
import { AppState } from "./state/model";
import { SetSite, SetSiteAction } from "./state/actions";
import { connect } from "react-redux";
import { SiteService, Site } from "./services/site-service";

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

    const bannerImages = site.banner.images.map(id => `/api/images/${id}`);
    const navbarLinks = site.pages.map(p => `/${p.id}`);
    const navbarTitles = site.pages.map(p => p.title);

    return (
      <div className="app-header">
        <Paper zDepth={1} rounded={false}>
          <LoginWidget />
          <FloatingLogo src={`/api/images/${site.logo}`} />
          <div className="app-header-image-container">
            <ImageGallery images={bannerImages} interval={10000} />
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

function mapDispatchToProps(dispatch: Dispatch<SetSiteAction>): IDispatchProps {
  return {
    setSite: (site: Site) => dispatch(SetSite(site)),
  };
}

export const ConnectedAppHeader = connect(mapStateToProps, mapDispatchToProps)(AppHeader);
