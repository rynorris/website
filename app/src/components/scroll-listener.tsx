import * as React from "react";
import throttle = require("lodash/throttle");

const SCROLL_LISTEN_INTERVAL_DEFAULT: number = 50;

interface ScrollListenerProps {
  onScroll: () => void;
  interval?: number;
}

interface ScrollListenerState {
  onScroll: () => void;
}

export default class ScrollListener extends React.Component<ScrollListenerProps, ScrollListenerState> {
  constructor(props: ScrollListenerProps) {
    super(props);
    const interval = this.props.interval || SCROLL_LISTEN_INTERVAL_DEFAULT;
    this.state = { onScroll: throttle(props.onScroll, interval) };
  }

  componentWillMount() {
    window.addEventListener("scroll", this.state.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.state.onScroll);
  }

  render() {
    return <div/>;
  }
}
