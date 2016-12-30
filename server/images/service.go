package images

const (
	JPG ImageType = iota
	PNG
	GIF
)

type ImageType int

type Image struct {
	Type ImageType
	Blob []byte
}

type Service interface {
	Get(key string) (Image, error)
	Put(key string, image Image) error
	Delete(key string) error
}
