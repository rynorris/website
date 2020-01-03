package images

import (
	"bytes"
	"fmt"
	"image"
	"log"
	_ "image/gif"
	_ "image/jpeg"
	"image/png"

	"github.com/disintegration/imaging"
)

const (
	HEADER ImageTransform = "header"
)

type ImageTransform = string

func TransformImage(raw Image, transform ImageTransform) (Image, error) {
	img, format, err := image.Decode(bytes.NewBuffer(raw.Blob))
	if err != nil {
		return Image{}, fmt.Errorf("failed to decode raw image: %s", err)
	}
	log.Printf("decoded image with format %s", format)

	switch transform {
	case HEADER:
		converted := imaging.Fill(img, 800, 300, imaging.Center, imaging.Lanczos)
		return encodeAndPackage(converted)
	default:
		return Image{}, fmt.Errorf("unknown transform type %s", transform)
	}
}

func encodeAndPackage(img image.Image) (Image, error) {
	buf := new(bytes.Buffer)
	err := png.Encode(buf, img)
	if err != nil {
		return Image{}, fmt.Errorf("failed to encode image: %s", err)
	}
	
	return Image{
		Type: PNG,
		Blob: buf.Bytes(),
	}, nil
}
