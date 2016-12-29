package main

import (
	"flag"
	"fmt"
	"github.com/discoviking/website/server/auth"
	"github.com/discoviking/website/server/message/email"
	pages "github.com/discoviking/website/server/pages/storage"
	"github.com/discoviking/website/server/storage/dir"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"gopkg.in/natefinch/lumberjack.v2"
	"log"
	"net/http"
	"time"
)

var (
	configFile = flag.String("config", "./server.yml", "Config File")
)

func main() {
	flag.Parse()

	// Load config.
	conf, err := LoadConfig(*configFile)
	if err != nil {
		log.Fatal("failed to load config: %v", err)
	}

	// Redirect log output.
	logger := &lumberjack.Logger{
		Filename:   conf.Server.Log.Filename,
		MaxSize:    conf.Server.Log.MaxSize, // megabytes
		MaxBackups: conf.Server.Log.MaxBackups,
		MaxAge:     conf.Server.Log.MaxAge, //days
	}
	log.SetOutput(logger)

	storageService, err := dir.NewService(conf.Pages.Directory)
	if err != nil {
		log.Fatal("failed to create storage service: %v", err)
	}

	authService := auth.NewService(
		conf.Auth.Secret,
		time.Duration(conf.Auth.TokenDuration)*time.Second,
		conf.Auth.Users,
	)
	pagesService := pages.NewService(storageService)
	messageService := email.NewService(conf.Contact.Email.To)

	router := createRouter(
		conf.Server.Serve.Index,
		conf.Server.Serve.Assets,
		authService,
		pagesService,
		messageService,
	)

	// Print out configured routes.
	log.Print("Serving the following routes:")
	router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		template, err := route.GetPathTemplate()
		if err != nil {
			log.Print("Unknown route")
			return nil
		}

		log.Print(template)
		return nil
	})

	// Add logging to all routes.
	requestLog := &lumberjack.Logger{
		Filename:   conf.Server.RequestLog.Filename,
		MaxSize:    conf.Server.RequestLog.MaxSize, // megabytes
		MaxBackups: conf.Server.RequestLog.MaxBackups,
		MaxAge:     conf.Server.RequestLog.MaxAge, //days
	}
	loggingHandler := handlers.CombinedLoggingHandler(requestLog, router)

	if conf.Server.Ssl.On {
		// Main server over HTTPS.
		log.Print("SSL On")
		startHttpRedirectServer(conf.Server.Port, conf.Server.Ssl.Port)
		mainSrv := &http.Server{
			Addr:         fmt.Sprintf(":%v", conf.Server.Ssl.Port),
			ReadTimeout:  time.Duration(conf.Server.ReadTimeout) * time.Second,
			WriteTimeout: time.Duration(conf.Server.WriteTimeout) * time.Second,
			// IdleTimeout:  120 * time.Second, // Go 1.8 only.
			TLSConfig: getTlsConfig(),
			Handler:   loggingHandler,
		}
		log.Print("Begin serving")
		log.Fatal(mainSrv.ListenAndServeTLS(conf.Server.Ssl.Cert, conf.Server.Ssl.Key))
	} else {
		// Main Server over HTTP.
		log.Print("SSL Off")
		mainSrv := &http.Server{
			Addr:         fmt.Sprintf(":%v", conf.Server.Port),
			ReadTimeout:  time.Duration(conf.Server.ReadTimeout) * time.Second,
			WriteTimeout: time.Duration(conf.Server.WriteTimeout) * time.Second,
			// IdleTimeout:  120 * time.Second, // Go 1.8 only.
			Handler: loggingHandler,
		}
		log.Print("Begin serving")
		log.Fatal(mainSrv.ListenAndServe())
	}
}
