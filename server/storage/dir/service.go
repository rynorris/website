package dir

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

type Service struct {
	dirname string
}

func NewService(dirname string) (*Service, error) {
	// Check it's actually a directory.
	stat, err := os.Stat(dirname)
	if err != nil {
		return nil, err
	}

	if !stat.Mode().IsDir() {
		return nil, fmt.Errorf("%v is not a directory", dirname)
	}

	return &Service{
		dirname: dirname,
	}, nil
}

func (s *Service) Get(key string) ([]byte, error) {
	path := s.getPath(key)
	return ioutil.ReadFile(path)
}

func (s *Service) Put(key string, data []byte) error {
	path := s.getPath(key)
	return ioutil.WriteFile(path, data, os.FileMode(0700))
}

func (s *Service) Delete(key string) error {
	path := s.getPath(key)
	return os.Remove(path)
}

func (s *Service) List() ([]string, error) {
	files, err := filepath.Glob(s.dirname + "/*")
	if err != nil {
		return nil, err
	}

	// Glob returns nil if there are no matches.  We'd prefer an empty slice.
	if files == nil {
		return []string{}, nil
	}

	keys := make([]string, len(files))
	for ix, file := range files {
		keys[ix] = filepath.Base(file)
	}

	return keys, nil
}

func (s *Service) getPath(key string) string {
	return filepath.Join(s.dirname, key)
}
