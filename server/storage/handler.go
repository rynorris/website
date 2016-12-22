package storage

import (
	"fmt"
	"net/http"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	blob, err := h.service.Get(path)
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to load object %v", err), 404)
		return
	}

	n, err := w.Write(blob)
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to write object %v", err), 503)
		return
	}

	if n != len(blob) {
		http.Error(w, "failed to write out object", 503)
		return
	}

	return
}
