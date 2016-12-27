package auth

import (
	"fmt"
	jwt "github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type Claims struct {
	jwt.StandardClaims
}

func NewService(secret string, tokenDuration time.Duration, users map[string]string) Service {
	return &serviceImpl{
		secret:        secret,
		tokenDuration: tokenDuration,
		users:         users,
	}
}

type serviceImpl struct {
	secret        string
	tokenDuration time.Duration
	users         map[string]string // Map of username to password hash.
}

func (s *serviceImpl) Login(r LoginRequest) (*jwt.Token, error) {
	// Retrieve stored password hash.
	hash, ok := s.users[r.Username]
	if !ok {
		return nil, fmt.Errorf("user %v does not exist", r.Username)
	}

	// Compare with user supplied password.
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(r.Password))
	if err != nil {
		return nil, fmt.Errorf("invalid password: %v", err)
	}

	// User is now successfully authenticated.
	// Issue them with a token.
	claims := Claims{
		jwt.StandardClaims{
			Subject:   r.Username,
			IssuedAt:  time.Now().Unix(),
			ExpiresAt: time.Now().Add(s.tokenDuration).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token, nil
}

func (s *serviceImpl) Sign(t *jwt.Token) (string, error) {
	return t.SignedString([]byte(s.secret))
}

func (s *serviceImpl) Parse(ss string) (*jwt.Token, error) {
	token, err := jwt.ParseWithClaims(ss, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.secret), nil
	})
	if err != nil {
		return nil, fmt.Errorf("failed to parse signed token: %v", err)
	}

	return token, nil
}
