import * as React from "react";

import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import {List, ListItem, makeSelectable} from "material-ui/List";

import ServiceProvider from "../services/service-provider";

let SelectableList = makeSelectable(List);

interface IImageSelectorProps {
  open: boolean;
  onRequestClose: () => void;
  onDone: (imageUrl: string) => void;
}

interface IImageSelectorState {
  imageKeys: string[];
  selectedValue: string;
}

export default class ImageSelector extends React.Component<IImageSelectorProps, IImageSelectorState> {
  constructor(props: IImageSelectorProps) {
    super(props);
    this.state = {
      imageKeys: [],
      selectedValue: "",
    };
  }

  componentDidMount() {
    let image = ServiceProvider.ImageService();
    image.listImages().then((images) => {
      this.setState(Object.assign({}, this.state, { imageKeys: images, selectedValue: "" }));
    }).catch(() => {
      console.log("Failed to load image list");
    });
  }

  render() {
    let actions: any[] = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.props.onRequestClose.bind(this)} />,
      <FlatButton
        label="Choose"
        onTouchTap={this.handleChoose.bind(this)} />
    ];

    let items = this.state.imageKeys.map((key) => {
      return (
        <ListItem value={key} primaryText={key} />
      );
    });

    return (
      <div>
        <Dialog
          title="Choose Image"
          open={this.props.open}
          actions={actions}
          onRequestClose={this.props.onRequestClose}
          contentClassName="image-selector"
          bodyClassName="image-selector-body"
          >
          <div className="image-selector-preview">
            {this.state.selectedValue !== "" ? <img src={"/api/images/" + this.state.selectedValue} /> : null}
          </div>
          <div className="image-selector-list">
            <SelectableList
              value={this.state.selectedValue}
              onChange={this.handleSelectImage.bind(this)}
              >
              {items}
            </SelectableList>
          </div>
        </Dialog>
      </div>
    );
  }

  private handleChoose() {
    let image = ServiceProvider.ImageService();
    this.props.onDone(image.getUrl(this.state.selectedValue));
    this.props.onRequestClose();
  }

  private handleSelectImage(ev: any, value: any) {
    this.setState(Object.assign({}, this.state, { selectedValue: value }));
  }

  private selectedImageUri(): string {
    if (this.state.selectedValue === "") {
      return "";
    }

    let image = ServiceProvider.ImageService();
    return image.getUrl(this.state.selectedValue);
  }
}
