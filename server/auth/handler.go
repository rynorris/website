package auth

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
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
		}

		signedString, err := service.Sign(token)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to issue token: %v", err), 503)
		}

		// Return token as a cookie.
		w.Header().Add("Set-Cookie", fmt.Sprintf("%v=%v; Path=/api; Secure; HttpOnly;", tokenCookieName, signedString))

		w.WriteHeader(http.StatusNoContent)
	}).Methods("POST")
}
