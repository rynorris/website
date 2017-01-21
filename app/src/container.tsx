import * as React from "react";
import Paper from "material-ui/Paper";
import * as Colors from "material-ui/styles/colors";
import ImageGallery from "./components/image-gallery";
import LoginWidget from "./components/login-widget";
import Navbar from "./components/navbar";
import Toaster from "./components/toaster";

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
  "/api/images/DTC mindmap.banner.jpeg",
  "/api/images/Snow writing.banner.jpeg",
  "/api/images/Girl writing.banner.jpeg",
  "/api/images/Ipad apps tilted.banner.jpeg",
];

export let Container = React.createClass({
  render() {
    return (
      <div className="app-container">
        <div className="app-header">
          <Paper zDepth={1} rounded={false}>
            <LoginWidget />
            <div className="app-header-image-container">
              <ImageGallery images={headerImages} interval={10000} />
            </div>
            <Navbar links={navbarLinks} titles={navbarTitles} />
          </Paper>
        </div>
        <div className="app-body">
          {this.props.children}
        </div>
        <Toaster />
      </div>
    );
  }
});
