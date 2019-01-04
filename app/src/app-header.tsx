import * as React from "react";
import * as ReactDOM from "react-dom";
import Paper from "material-ui/Paper";

import FloatingLogo from "./components/floating-logo";
import ImageGallery from "./components/image-gallery";
import LoginWidget from "./components/login-widget";
import Navbar from "./components/navbar";

import ScrollListener from "./components/scroll-listener";
import { PagesService } from "./services/pages-service";
import ServiceProvider from "./services/service-provider";
import { Dispatch } from "redux";
import { AppState } from "./state/model";
import { SetPages } from "./state/actions";
import { connect } from "react-redux";

const headerImages: string[] = [
  "/api/images/dtc-mindmap.banner.jpg",
  "/api/images/snow-writing.banner.jpg",
  "/api/images/Girl writing.banner.jpeg",
  "/api/images/Ipad apps tilted.banner.jpeg",
];

const logoImage: string = "/api/images/dtc-logo-small.jpg";

interface IStateProps {
  pages: string[];
}

interface IDispatchProps {
  setPages: (pages: string[]) => void;
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
    const pageService: PagesService = ServiceProvider.PagesService();
    pageService.listPages().then(this.props.setPages);
  }

  render() {
    const { pages } = this.props;

    const navbarLinks = pages.map(p => "/" + p);
    const navbarTitles = pages.map(p => p);

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
    pages: state.site.pages,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>): IDispatchProps {
  return {
    setPages: (pages: string[]) => dispatch(SetPages(pages)),
  };
}

export const ConnectedAppHeader = connect(mapStateToProps, mapDispatchToProps)(AppHeader);
