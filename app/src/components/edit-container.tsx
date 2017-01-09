import * as React from "react";
import FlatButton from "material-ui/FlatButton";
import ContentCreate from "material-ui/svg-icons/content/create";
import KeyboardArrowUp from "material-ui/svg-icons/hardware/keyboard-arrow-up";
import KeyboardArrowDown from "material-ui/svg-icons/hardware/keyboard-arrow-down";

import {Card} from "../services/pages-service";

interface IEditContainerProps {
  editable: boolean;
  onEditButtonClick: any;
  onUpButtonClick: any;
  onDownButtonClick: any;
}

export default class EditContainer extends React.Component<IEditContainerProps, {}> {
  render() {
    if (!this.props.children) {
      return <div></div>;
    }

    let editButton: JSX.Element = (
      <div className="edit-button">
        <FlatButton onClick={this.props.onEditButtonClick}>
          <ContentCreate />
        </FlatButton>
        <FlatButton onClick={this.props.onUpButtonClick}>
          <KeyboardArrowUp />
        </FlatButton>
        <FlatButton onClick={this.props.onDownButtonClick}>
          <KeyboardArrowDown />
        </FlatButton>
      </div>
    );

    return (
      <div className={this.props.editable ? "edit-container editable" : "edit-container"}>
        {this.props.editable ? editButton : null}
        {this.props.children}
      </div>
    );
  }
}
