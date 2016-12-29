import * as React from "react";
import {Unsubscribe} from "redux";
import Snackbar from "material-ui/Snackbar";

import {store, Toast} from "../redux/state";

interface IToasterProps {
  duration?: number;
}

interface IToasterState {
  open: boolean;
  text: string;
}

export default class Toaster extends React.Component<IToasterProps, IToasterState> {
  private unsubscribe: Unsubscribe;

  constructor(props: IToasterProps) {
    super(props);
    this.state = {
      open: false ,
      text: "",
    };
  }

  public static defaultProps: IToasterProps = {
    duration: 2000,
  };

  public static toast(text: string) {
    store.dispatch(Toast(text));
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      let toaster: any = store.getState().toaster;
      if ((toaster.open !== this.state.open) ||
          (toaster.text !== this.state.text)) {
        this.setState({
          open: toaster.open,
          text: toaster.text,
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <Snackbar
        open={this.state.open}
        message={this.state.text}
        autoHideDuration={this.props.duration}
        onRequestClose={this.handleRequestClose.bind(this)}
        />
    );
  }

  private handleRequestClose() {
    this.setState({ open: false, text: this.state.text });
  };

  private handleTouchTap() {
    this.setState({ open: false, text: this.state.text });
  };
}
