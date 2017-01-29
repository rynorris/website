package cache

import "net/http"

type handler struct {
	cacheControl string
	delegate     http.Handler
}

func NewHandler(cacheControl string, delegate http.Handler) *handler {
	return &handler{
		cacheControl: cacheControl,
		delegate:     delegate,
	}
}

func (h *handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", h.cacheControl)
	h.delegate.ServeHTTP(w, r)
}
