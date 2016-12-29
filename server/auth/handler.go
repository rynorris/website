package auth

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"time"
)

const (
	tokenCookieName = "access_token"
)

func respondError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	encoder := json.NewEncoder(w)
	encoder.Encode(map[string]string{"message": message})
}

func AddRoutes(r *mux.Router, service Service) {
	// Do not serve these routes over http.
	r.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		req := LoginRequest{}
		err := decoder.Decode(&req)
		if err != nil {
			respondError(w, fmt.Sprintf("failed to decode login request from request body: %v", err), 400)
			return
		}

		token, err := service.Login(req)
		if err != nil {
			// Explicitly do not pass up the reason for login failure.
			respondError(w, "Invalid username or password.", 403)
			return
		}

		signedString, err := service.Sign(token)
		if err != nil {
			respondError(w, fmt.Sprintf("failed to issue token: %v", err), 503)
			return
		}

		// Return token as a cookie.
		cookie := &http.Cookie{
			Name:     tokenCookieName,
			Value:    signedString,
			Path:     "/api",
			Secure:   true,
			HttpOnly: true,
		}
		http.SetCookie(w, cookie)

		w.WriteHeader(http.StatusNoContent)
	}).Methods("POST")

	r.HandleFunc("/user", func(w http.ResponseWriter, r *http.Request) {
		claims, err := validateRequest(r, service)
		if err != nil {
			respondError(w, err.Error(), 403)
			return
		}

		info := UserInfo{
			Username: claims.Subject,
		}

		encoder := json.NewEncoder(w)
		err = encoder.Encode(info)
		if err != nil {
			log.Printf("failed to encode user info: %v", err)
			respondError(w, "failed to return user info", 503)
			return
		}
	}).Methods("GET")

	r.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		// Delete login cookie by setting one with 0 life.
		cookie := &http.Cookie{
			Name:     tokenCookieName,
			Value:    "",
			Path:     "/api",
			Secure:   true,
			HttpOnly: true,
			Expires:  time.Unix(0, 0),
			MaxAge:   -1,
		}
		http.SetCookie(w, cookie)

		w.WriteHeader(http.StatusNoContent)
	}).Methods("POST")
}

func AuthenticateFunc(service Service, f http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, err := validateRequest(r, service)
		if err != nil {
			respondError(w, err.Error(), 403)
		}

		f(w, r)
	}
}

func validateRequest(r *http.Request, service Service) (*Claims, error) {
	cookie, err := r.Cookie(tokenCookieName)
	if err != nil {
		log.Printf("no token provided: %v", err)
		return nil, fmt.Errorf("no access token provided")
	}

	ss := cookie.Value
	token, err := service.Parse(ss)
	if err != nil {
		log.Printf("invalid token: %v", err)
		return nil, fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		log.Printf("invalid token claims")
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
