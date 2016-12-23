import * as React from "react";
import Snackbar from "material-ui/Snackbar";

interface IToasterProps {
  duration?: number;
}

interface IToasterState {
  open: boolean;
  text: string;
}

export default class Toaster extends React.Component<IToasterProps, IToasterState> {
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

  public toast(text: string) {
    this.setState({
      open: true,
      text: text,
    });
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
