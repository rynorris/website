import * as React from "react";
import Paper from "material-ui/Paper";

import FloatingLogo from "./components/floating-logo";
import ImageGallery from "./components/image-gallery";
import LoginWidget from "./components/login-widget";
import Navbar from "./components/navbar";

let navbarLinks: string[] = [
  "/front",
  "/about",
  "/teachers",
  "/services"
];

let navbarTitles: string[] = [
  "Home",
  "About",
  "Our Teachers",
  "Our Services",
];

const headerImages: string[] = [
  "/api/images/dtc-mindmap.banner.jpg",
  "/api/images/snow-writing.banner.jpg",
  "/api/images/Girl writing.banner.jpeg",
  "/api/images/Ipad apps tilted.banner.jpeg",
];

const logoImage: string = "/api/images/dtc-logo-small.jpg";

export default class AppHeader extends React.Component<{}, {}> {
  render() {
    return (
      <div className="app-header">
        <Paper zDepth={1} rounded={false}>
          <LoginWidget />
          <FloatingLogo src={logoImage} />
          <div className="app-header-image-container">
            <ImageGallery images={headerImages} interval={10000} />
          </div>
          <Navbar links={navbarLinks} titles={navbarTitles} />
        </Paper>
      </div>
    );
  }
}
