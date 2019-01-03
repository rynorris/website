import * as React from "react";
import { throttle } from "lodash";

const SCROLL_LISTEN_INTERVAL_DEFAULT: number = 50;

interface ScrollListenerProps {
  onScroll: (top: number) => void;
  interval?: number;
}

interface ScrollListenerState {
  onScroll: () => void;
}

export default class ScrollListener extends React.Component<ScrollListenerProps, ScrollListenerState> {
  private scroller: React.RefObject<HTMLDivElement>;

  constructor(props: ScrollListenerProps) {
    super(props);
    const interval = this.props.interval || SCROLL_LISTEN_INTERVAL_DEFAULT;
    this.state = { 
      onScroll: throttle(() => this.scroller.current && props.onScroll(this.scroller.current.getClientRects()[0].top), interval),
    };
    this.scroller = React.createRef();
  }

  componentWillMount() {
    window.addEventListener("scroll", this.state.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.state.onScroll);
  }

  render() {
    return <div ref={this.scroller}/>;
  }
}
