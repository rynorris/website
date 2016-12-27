package auth

import (
	jwt "github.com/dgrijalva/jwt-go"
)

type LoginRequest struct {
	Username string
	Password string
}

type Service interface {
	Login(r LoginRequest) (*jwt.Token, error)
	Sign(t *jwt.Token) (string, error)
	Parse(ss string) (*jwt.Token, error)
}
