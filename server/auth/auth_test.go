package auth

import (
	"testing"
	"time"
)

const (
	username       = "test-user"
	password       = "test-password"
	hashedPassword = "$2y$10$.VrviK477H6aBjraH3Tma.bocws2nfUGOyp2JetGlBbfj7sro9Ya6"

	// Test tokens generated using the fantastic debugger at jwt.io
	validToken       = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.n5QUuguJ-7zeNgqezW99cQQLrvkb_lWo7ooZQzvUPSY"
	badlySignedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIifQ.YxfoKnP8UxOhu-D6POVsx3NbNRNUMCp1Qr-nGcD7ZPU"
)

func createTestService() Service {
	return NewService("test-secret", 1*time.Second, map[string]string{username: hashedPassword})
}

func TestCreateService(t *testing.T) {
	createTestService()
}

func TestCanIssueAToken(t *testing.T) {
	s := createTestService()
	_, err := s.Login(LoginRequest{username, password})
	if err != nil {
		t.Fatalf("login unexpectedly failed: %v", err)
	}
}

func TestCanSignAnIssuedToken(t *testing.T) {
	s := createTestService()
	token, err := s.Login(LoginRequest{username, password})
	if err != nil {
		t.Fatalf("login unexpectedly failed: %v", err)
	}

	_, err = s.Sign(token)
	if err != nil {
		t.Fatalf("failed to sign token: %v", err)
	}
}

func TestCanValidateToken(t *testing.T) {
	s := createTestService()
	token, err := s.Parse(validToken)
	if err != nil {
		t.Fatalf("failed to parse token: %v", err)
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		t.Fatal("claims were of incorrect type")
	}

	if claims.Subject != username {
		t.Fatalf("wrong sub claim on parsed token. Got %v, expected %v.", claims.Subject, username)
	}
}

func TestRejectBadlySignedToken(t *testing.T) {
	s := createTestService()
	_, err := s.Parse(badlySignedToken)
	if err == nil {
		t.Fatal("parsed badly signed token without error")
	}
}

func TestLoginFailsWithIncorrectPassword(t *testing.T) {
	s := createTestService()
	token, err := s.Login(LoginRequest{username, "wrong-password"})
	if token != nil {
		t.Fatal("issued token despite incorrect password")
	}

	if err == nil {
		t.Fatal("logged in without error despite incorrect password")
	}
}

func TestLoginFailsWithIncorrectUsername(t *testing.T) {
	s := createTestService()
	token, err := s.Login(LoginRequest{"wrong-username", password})
	if token != nil {
		t.Fatal("issued token despite incorrect username")
	}

	if err == nil {
		t.Fatal("logged in without error despite incorrect username")
	}
}
