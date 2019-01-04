package main

import (
	"log"
	"net/http"

	"github.com/NYTimes/gziphandler"
	"github.com/gorilla/mux"
	"github.com/rynorris/website/server/auth"
	"github.com/rynorris/website/server/cache"
	"github.com/rynorris/website/server/images"
	"github.com/rynorris/website/server/message"
	"github.com/rynorris/website/server/pages"
)

func createRouter(
	indexPage, themeFile, assetsDir string,
	authService auth.Service,
	imageService images.Service,
	pagesService pages.Service,
	messageService message.Service) *mux.Router {

	// Main Router.
	r := mux.NewRouter()

	// REST API.
	api := r.PathPrefix("/api/").Subrouter()

	auth.AddRoutes(api.PathPrefix("/auth/").Subrouter(), authService)
	images.AddRoutes(api.PathPrefix("/images/").Subrouter(), imageService, authService)
	message.AddRoutes(api.PathPrefix("/message/").Subrouter(), messageService)
	pages.AddRoutes(api.PathPrefix("/pages/").Subrouter(), pagesService, authService)

	// Serve static assets.
	fs := http.FileServer(http.Dir(assetsDir))
	fs = cache.NewHandler("max-age=31536000", gziphandler.GzipHandler(fs))
	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", fs))

	// Serve theme stylesheet.
	r.HandleFunc("/styles/theme.css", func(w http.ResponseWriter, r *http.Request) {
		log.Print("Serving theme")
		w.Header().Set("Cache-Control", "no-cache")
		http.ServeFile(w, r, themeFile)
	})

	// For all other paths just serve the app and defer to the front-end to handle it.
	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Print("Serving index")
		w.Header().Set("Cache-Control", "no-cache")
		http.ServeFile(w, r, indexPage)
	})

	return r
}
