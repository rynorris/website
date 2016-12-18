package main

import (
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/index.html")
	})

	r.HandleFunc("/app.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/app.js")
	})

	fs := http.FileServer(http.Dir("../app/build/src/assets"))
	r.Handle("/assets/", http.StripPrefix("/assets/", fs))

	http.Handle("/", r)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
