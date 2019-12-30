import Paper from "@material-ui/core/Paper";
import * as React from "react";

import { FloatingLogo } from "./components/floating-logo";
import { ImageGallery } from "./components/image-gallery";
import { LoginWidget } from "./components/login-widget";
import { Navbar } from "./components/navbar";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ScrollListener } from "./components/scroll-listener";
import { ISite } from "./services/site-service";
import { ISetSiteAction, SetSite } from "./state/actions";
import { IAppState } from "./state/model";

interface IStateProps {
  site?: ISite;
}

interface IDispatchProps {
  setSite: (site: ISite) => void;
}

type IAppHeaderProps = IStateProps & IDispatchProps;

interface IAppHeaderState {
  navbarFixed: boolean;
}

const AppHeader = (props: IAppHeaderProps) => {
  const { site } = props;

  const [navbarFixed, setNavbarFixed] = React.useState(false);

  const bannerImages = site != null ? site.banner.images.map((id) => `/api/images/${id}`) : [];
  const navbarLinks = site != null ? site.pages.map((p) => `/${p.id}`) : [];
  const navbarTitles = site != null ? site.pages.map((p) => p.title) : [];

  const handleScroll = (top: number) => {
    const fixed = top <= 0 ? true : false;
    setNavbarFixed(fixed);
  };

  return (
    <div className="app-header">
      <Paper elevation={1} square={true}>
        <LoginWidget />
        {site && <FloatingLogo src={`/api/images/${site.logo}`} />}
        <div className="app-header-image-container">
          <ImageGallery images={bannerImages} interval={10000} />
        </div>
        <ScrollListener onScroll={handleScroll} />
      </Paper>
      <Navbar links={navbarLinks} titles={navbarTitles} fixed={navbarFixed} />
    </div>
  );
};

function mapStateToProps(state: IAppState): IStateProps {
  return {
    site: state.site,
  };
}

function mapDispatchToProps(dispatch: Dispatch<ISetSiteAction>): IDispatchProps {
  return {
    setSite: (site: ISite) => dispatch(SetSite(site)),
  };
}

export const ConnectedAppHeader = connect(mapStateToProps, mapDispatchToProps)(AppHeader);
