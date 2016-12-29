package main

import (
	"github.com/go-yaml/yaml"
	"io/ioutil"
)

type Config struct {
	Auth    AuthConfig    `yaml:"auth"`
	Contact ContactConfig `yaml:"contact"`
	Pages   PagesConfig   `yaml:"pages"`
	Server  ServerConfig  `yaml:"server"`
}

type AuthConfig struct {
	TokenDuration int               `yaml:"token-duration"`
	Secret        string            `yaml:"secret"`
	Users         map[string]string `yaml:"users"`
}

type PagesConfig struct {
	Directory string `yaml:"directory"`
}

type ServerConfig struct {
	Port         int           `yaml:"port"`
	Serve        ServeConfig   `yaml:"serve"`
	Ssl          SslConfig     `yaml:"ssl"`
	ReadTimeout  int           `yaml:"read-timeout"`
	WriteTimeout int           `yaml:"write-timeout"`
	Log          LoggingConfig `yaml:"log"`
	RequestLog   LoggingConfig `yaml:"request-log"`
}

type LoggingConfig struct {
	Filename   string `yaml:"filename"`
	MaxSize    int    `yaml:"max-size"`
	MaxBackups int    `yaml:"max-backups"`
	MaxAge     int    `yaml:"max-age"`
}

type ServeConfig struct {
	Assets string `yaml:"assets"`
	Index  string `yaml:"index"`
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
