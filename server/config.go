package main

import (
	"github.com/go-yaml/yaml"
	"io/ioutil"
)

type Config struct {
	Port         int       `yaml:"port"`
	Ssl          SslConfig `yaml:"ssl"`
	ReadTimeout  int       `yaml:"read-timeout"`
	WriteTimeout int       `yaml:"write-timeout"`
}

type SslConfig struct {
	On   bool   `yaml:"on"`
	Port int    `yaml:"port"`
	Cert string `yaml:"certificate"`
	Key  string `yaml:"private-key"`
}

func LoadConfig(filename string) (Config, error) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return Config{}, err
	}

	conf := Config{}
	err = yaml.Unmarshal(data, &conf)
	return conf, err
}
