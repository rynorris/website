package auth

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

const (
	loginRequest      = "{\"username\": \"dummy\", \"password\": \"dummy\"}"
	dummySignedToken  = "dummy-token"
	dummyCookieHeader = "access_token=dummy-token; Path=/api; HttpOnly; Secure"
)

var (
	dummyCookie *http.Cookie = &http.Cookie{
		Name:  tokenCookieName,
		Value: "dummy-token",
	}

	dummyToken *jwt.Token = jwt.New(jwt.SigningMethodHS256)

	userInfoClaims = &Claims{
		jwt.StandardClaims{
			Subject: "test-user",
		},
	}
	dummyTokenWithUserInfo *jwt.Token = jwt.NewWithClaims(jwt.SigningMethodHS256, userInfoClaims)

	badClaims = &badClaimsType{
		Extra: "unexpected-data",
		StandardClaims: jwt.StandardClaims{
			Subject: "test-user",
		},
	}
	dummyTokenWithBadClaims *jwt.Token = jwt.NewWithClaims(jwt.SigningMethodHS256, badClaims)
)

func TestLoginSuccess(t *testing.T) {
	svc := &dummyService{}
	svr := createServer(svc)
	defer svr.Close()

	svc.nextLogin = dummyToken
	svc.nextSign = dummySignedToken

	resp, err := http.Post(svr.URL+"/login", "application/json", strings.NewReader(loginRequest))
	if err != nil {
		t.Error(err)
	}

	if resp.StatusCode != 204 {
		t.Errorf("Should return 204 on successful login.  Got: %v", resp.StatusCode)
	}

	header := resp.Header.Get("Set-Cookie")
	if len(header) == 0 {
		t.Fatalf("Didn't find Set-Cookie header on response: %v", err)
	}

	if header != dummyCookieHeader {
		t.Fatalf("Set-Cookie header didn't match expected.\nGot: %v\nExpected: %v", header, dummyCookieHeader)
	}
}

func TestLoginFailure(t *testing.T) {
	svc := &dummyService{}
	svr := createServer(svc)
	defer svr.Close()

	svc.nextError = fmt.Errorf("fail")

	resp, err := http.Post(svr.URL+"/login", "application/json", strings.NewReader(loginRequest))
	if err != nil {
		t.Error(err)
	}

	if resp.StatusCode != 403 {
		t.Errorf("Should return 403 on failed login.  Got: %v", resp.StatusCode)
	}

}

func TestLoginWithNoBody(t *testing.T) {
	svc := &dummyService{}
	svr := createServer(svc)
	defer svr.Close()

	resp, err := http.Post(svr.URL+"/login", "application/json", strings.NewReader(""))
	if err != nil {
		t.Fatal(err)
	}

	if resp.StatusCode != 400 {
		t.Errorf("Should return 400 for bad request.  Got %v.", resp.StatusCode)
	}
}

func TestUserInfoSuccess(t *testing.T) {
	svc := &dummyService{}
	svr := createServer(svc)
	defer svr.Close()

	svc.nextParse = dummyTokenWithUserInfo

	req, err := http.NewRequest("GET", svr.URL+"/user", nil)
	if err != nil {
		t.Fatal(err)
	}

	req.AddCookie(dummyCookie)
	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatal(err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("Should return 200 for successful user info request.  Got %v.", resp.StatusCode)
	}
}

func TestUserInfoNoCookie(t *testing.T) {
	svc := &dummyService{}
	svr := createServer(svc)
	defer svr.Close()

	req, err := http.NewRequest("GET", svr.URL+"/user", nil)
	if err != nil {
		t.Fatal(err)
	}

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatal(err)
	}

	if resp.StatusCode != 403 {
		t.Errorf("Should return 403 when no token cookie provided.  Got %v.", resp.StatusCode)
	}
}

func TestUserInfoBadCookie(t *testing.T) {
	svc := &dummyService{}
	svr := createServer(svc)
	defer svr.Close()

	svc.nextParse = dummyTokenWithBadClaims

	req, err := http.NewRequest("GET", svr.URL+"/user", nil)
	if err != nil {
		t.Fatal(err)
	}

	req.AddCookie(dummyCookie)
	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatal(err)
	}

	if resp.StatusCode != 403 {
		t.Errorf("Should return 403 for invalid token.  Got %v.", resp.StatusCode)
	}
}

func createServer(service Service) *httptest.Server {
	r := mux.NewRouter()
	AddRoutes(r, service)
	return httptest.NewServer(r)
}

type dummyService struct {
	nextLogin *jwt.Token
	nextSign  string
	nextParse *jwt.Token
	nextError error
}

func (s *dummyService) Login(r LoginRequest) (*jwt.Token, error) {
	if s.nextError != nil {
		err := s.nextError
		s.nextError = nil
		return nil, err
	}

	token := s.nextLogin
	s.nextLogin = nil
	return token, nil
}

func (s *dummyService) Sign(*jwt.Token) (string, error) {
	if s.nextError != nil {
		err := s.nextError
		s.nextError = nil
		return "", err
	}

	ss := s.nextSign
	s.nextSign = ""
	return ss, nil
}

func (s *dummyService) Parse(ss string) (*jwt.Token, error) {
	if s.nextError != nil {
		err := s.nextError
		s.nextError = nil
		return nil, err
	}

	token := s.nextParse
	s.nextParse = nil
	return token, nil
}

type badClaimsType struct {
	Extra string
	jwt.StandardClaims
}
