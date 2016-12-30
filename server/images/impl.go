package images

import (
	"fmt"
	"strings"

	"github.com/discoviking/website/server/storage"
)

type serviceImpl struct {
	storage storage.Service
}

var extToType = map[string]ImageType{
	"png": PNG,
	"jpg": JPG,
	"gif": GIF,
}

const defaultType = PNG

func NewService(s storage.Service) Service {
	return &serviceImpl{
		storage: s,
	}
}

func (s *serviceImpl) Get(key string) (Image, error) {
	blob, err := s.storage.Get(key)
	if err != nil {
		return Image{}, err
	}

	return Image{Type: keyToType(key), Blob: blob}, nil
}

func (s *serviceImpl) Put(key string, image Image) error {
	// Check the image type and file extension match.
	if keyToType(key) != image.Type {
		return fmt.Errorf("Image type does not match file extension")
	}

	return s.storage.Put(key, image.Blob)
}

func (s *serviceImpl) Delete(key string) error {
	return s.storage.Delete(key)
}

func keyToType(key string) ImageType {
	lastDot := strings.LastIndex(key, ".")
	if lastDot == -1 {
		// No explicit extension,  return default.
		return defaultType
	}

	ext := strings.ToLower(key[lastDot+1:])
	t, ok := extToType[ext]
	if !ok {
		// Unknown extension,  return default.
		return defaultType
	}

	return t
}
