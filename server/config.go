package main

import (
	"github.com/go-yaml/yaml"
	"io/ioutil"
)

type Config struct {
	Contact ContactConfig `yaml:"contact"`
	Server  ServerConfig  `yaml:"server"`
}

type ServerConfig struct {
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

type ContactConfig struct {
	Email EmailContactConfig `yaml:"email"`
}

type EmailContactConfig struct {
	To string `yaml:"to"`
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
