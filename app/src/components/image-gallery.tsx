import * as React from "react";

interface ImageGalleryProps {
  images: string[];
  interval: number;
}

interface ImageGalleryState {
  imageIndex: number;
  timerID?: number;
}

export default class ImageGallery extends React.Component<ImageGalleryProps, ImageGalleryState> {
  constructor(props: ImageGalleryProps) {
    super(props);
    this.state = {
      imageIndex: 0,
    };
  }

  componentWillMount() {
    const timerID: number = setInterval(this.rotateImage.bind(this), this.props.interval);
    this.setState(Object.assign({}, this.state, { timerID }));
  }

  componentWillUnmount() {
    if (this.state.timerID) {
      clearInterval(this.state.timerID);
    }
  }

  render() {
    return (
      <div className="image-gallery">
        {this.props.images.map((img, ix) => {
          return (
            <div key={"img_" + ix} className={ix === this.state.imageIndex ? "image-gallery-image active" : "image-gallery-image"}>
              <img src={img}/>
            </div>
          );
        })}
      </div>
    );
  }

  private rotateImage() {
    const currentIndex: number = this.state.imageIndex;
    this.setState({
      imageIndex: (currentIndex + 1) % this.props.images.length,
    });
  }
}
