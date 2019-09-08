import { throttle } from "lodash";
import * as React from "react";

const SCROLL_LISTEN_INTERVAL_DEFAULT: number = 50;

interface IScrollListenerProps {
  onScroll: (top: number) => void;
  interval?: number;
}

export const ScrollListener: React.SFC<IScrollListenerProps> = (props) => {
  const scroller = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onScroll = throttle(() =>
      scroller.current && props.onScroll(scroller.current.getClientRects()[0].top),
      props.interval || SCROLL_LISTEN_INTERVAL_DEFAULT,
    );

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  });

  return <div ref={scroller} />;
};
