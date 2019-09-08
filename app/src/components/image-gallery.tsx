import * as React from "react";

interface ImageGalleryProps {
  images: string[];
  interval: number;
}

export const ImageGallery: React.SFC<ImageGalleryProps> = ({ images, interval }) => {
  const [imageIndex, setImageIndex] = React.useState<number>(0);
  React.useEffect(() => {
    const timerId = setInterval(() => setImageIndex((prev) => (prev + 1) % images.length), interval);
    return () => clearInterval(timerId);
  });

  return (
    <div className="image-gallery">
      {images.map((img, ix) => {
        return (
          <div key={"img_" + ix} className={ix === imageIndex ? "image-gallery-image active" : "image-gallery-image"}>
            <img src={img}/>
          </div>
        );
      })}
    </div>
  );
};
