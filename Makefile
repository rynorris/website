
PHONY: app app-prod server server-prod dist-clean dist

app:
	cd app && webpack

app-prod:
	cd app && webpack --config ./webpack.config.prod.js

server:
	cd server && GOARCH=amd64 && GOOS=linux go build

server-prod:
	cd server && GOARCH=amd64 && GOOS=linux go build -o ./server-linux

dist-clean:
	rm -rf ./dist

dist: dist-clean app-prod server-prod
	mkdir -p ./dist
	cp -r app/build/min/assets ./dist
	cp -r server/server.yml server/test ./dist
	mv server/server-linux ./dist/server
	tar -czf website.tgz ./dist
