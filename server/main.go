package main

import (
	"github.com/NYTimes/gziphandler"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/index.html")
	})

	r.HandleFunc("/app/{path:.*}", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/index.html")
	})

	appHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/app.js")
	})
	r.Handle("/app.js", gziphandler.GzipHandler(appHandler))

	fs := http.FileServer(http.Dir("../app/build/src/assets/"))
	r.Handle("/assets/{assetPath:.*}", http.StripPrefix("/assets/", fs))

	http.Handle("/", r)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
