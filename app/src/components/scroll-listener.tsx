import { throttle } from "lodash";
import * as React from "react";

const SCROLL_LISTEN_INTERVAL_DEFAULT: number = 50;

interface IScrollListenerProps {
  onScroll: (top: number) => void;
  interval?: number;
}

interface IScrollListenerState {
  onScroll: () => void;
}

export default class ScrollListener extends React.Component<IScrollListenerProps, IScrollListenerState> {
  private scroller: React.RefObject<HTMLDivElement>;

  constructor(props: IScrollListenerProps) {
    super(props);
    const interval = this.props.interval || SCROLL_LISTEN_INTERVAL_DEFAULT;
    this.state = {
      onScroll: throttle(() =>
        this.scroller.current && props.onScroll(this.scroller.current.getClientRects()[0].top), interval),
    };
    this.scroller = React.createRef();
  }

  public componentWillMount() {
    window.addEventListener("scroll", this.state.onScroll);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.state.onScroll);
  }

  public render() {
    return <div ref={this.scroller}/>;
  }
}
