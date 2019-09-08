import * as React from "react";

interface IImageGalleryProps {
  images: string[];
  interval: number;
}

export const ImageGallery: React.SFC<IImageGalleryProps> = ({ images, interval }) => {
  const [imageIndex, setImageIndex] = React.useState<number>(0);
  React.useEffect(() => {
    const timerId = setInterval(() => setImageIndex((prev) => (prev + 1) % images.length), interval);
    return () => clearInterval(timerId);
  });

  const imageElements = images.map((img, ix) => {
    return (
      <div key={"img_" + ix} className={ix === imageIndex ? "image-gallery-image active" : "image-gallery-image"}>
        <img src={img} />
      </div>
    );
  });

  return (
    <div className="image-gallery">
      {imageElements}
    </div>
  );
};
