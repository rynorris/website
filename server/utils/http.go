package utils

import "net/http"
import "log"

func LogAndFail(w http.ResponseWriter, msg string, statusCode int) {
	log.Printf(msg)
	http.Error(w, msg, statusCode)
}