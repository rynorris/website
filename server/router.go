package main

import (
	"github.com/NYTimes/gziphandler"
	"github.com/discoviking/website/server/auth"
	"github.com/discoviking/website/server/message"
	"github.com/discoviking/website/server/pages"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func createRouter(
	indexPage, assetsDir string,
	authService auth.Service,
	pagesService pages.Service,
	messageService message.Service) *mux.Router {

	// Main Router.
	r := mux.NewRouter()

	// REST API.
	api := r.PathPrefix("/api/").Subrouter()

	auth.AddRoutes(api.PathPrefix("/auth/").Subrouter(), authService)
	message.AddRoutes(api.PathPrefix("/message/").Subrouter(), messageService)
	pages.AddRoutes(api.PathPrefix("/pages/").Subrouter(), pagesService)

	// Serve static assets.
	fs := http.FileServer(http.Dir(assetsDir))
	fs = gziphandler.GzipHandler(fs)
	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", fs))

	// For all other paths just serve the app and defer to the front-end to handle it.
	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Print("Serving index")
		http.ServeFile(w, r, indexPage)
	})

	return r
}
