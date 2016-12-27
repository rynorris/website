package auth

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

const (
	tokenCookieName = "access_token"
)

func AddRoutes(r *mux.Router, service Service) {
	// Do not serve these routes over http.
	r.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		req := LoginRequest{}
		err := decoder.Decode(&req)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to decode login request from request body: %v", err), 400)
			return
		}

		token, err := service.Login(req)
		if err != nil {
			// Explicitly do not pass up the reason for login failure.
			http.Error(w, "Invalid username or password.", 403)
			return
		}

		signedString, err := service.Sign(token)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to issue token: %v", err), 503)
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
		cookie, err := r.Cookie(tokenCookieName)
		if err != nil {
			log.Printf("no token provided: %v", err)
			http.Error(w, "no access token provided", 403)
			return
		}

		ss := cookie.Value
		token, err := service.Parse(ss)
		if err != nil {
			log.Printf("invalid token: %v", err)
			http.Error(w, "invalid token", 403)
			return
		}

		claims, ok := token.Claims.(*Claims)
		if !ok {
			log.Printf("invalid token claims")
			http.Error(w, "invalid token", 403)
			return
		}

		info := UserInfo{
			Username: claims.Subject,
		}

		encoder := json.NewEncoder(w)
		err = encoder.Encode(info)
		if err != nil {
			log.Printf("failed to encode user info: %v", err)
			http.Error(w, "failed to return user info", 503)
			return
		}
	}).Methods("GET")
}
