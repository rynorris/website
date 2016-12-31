package json

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

type jsonStore map[string]string

type Service struct {
	store jsonStore
}

func NewService(filename string) (*Service, error) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	store := make(jsonStore)
	err = json.Unmarshal(data, store)
	if err != nil {
		return nil, err
	}

	return &Service{store}, nil
}

func (s *Service) Get(key string) ([]byte, error) {
	if val, ok := s.store[key]; ok {
		return []byte(val), nil
	}

	return nil, fmt.Errorf("key %v not found", key)
}

func (s *Service) Put(key string, data []byte) error {
	s.store[key] = string(data)
	return nil
}

func (s *Service) Delete(key string) error {
	delete(s.store, key)
	return nil
}

func (s *Service) List() ([]string, error) {
	keys := make([]string, len(s.store))
	ix := 0
	for k, _ := range s.store {
		keys[ix] = k
		ix++
	}

	return keys, nil
}
