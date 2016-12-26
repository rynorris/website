import * as React from "react";
import FlatButton from "material-ui/FlatButton";
import ContentCreate from "material-ui/svg-icons/content/create";

import {Card} from "../services/pages-service";

interface IEditContainerProps {
  editable: boolean;
}

export default class EditContainer extends React.Component<IEditContainerProps, {}> {
  render() {
    if (!this.props.children) {
      return <div></div>;
    }

    let editButton: JSX.Element = (
      <div className="edit-button">
        <FlatButton>
          <ContentCreate />
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
