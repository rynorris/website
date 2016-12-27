package auth

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

func AddRoutes(r *mux.Router, service Service) {
	// Explicitly only serve login over https.
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

		n, err := w.Write([]byte(signedString))
		if err != nil || n != len(signedString) {
			http.Error(w, fmt.Sprintf("failed to write response: %v", err), 503)
		}
	}).Methods("POST").Schemes("https")
}
