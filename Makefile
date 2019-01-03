
.PHONY: app app-deps app-prod app-clean app-clean-prod server server-deps server-prod dist-clean dist

app-deps:
	cd app && yarn

app: app-deps
	cd app && webpack

app-prod: app-deps
	cd app && webpack --config ./webpack.config.prod.js

app-clean:
	rm -rf ./app/build

app-clean-prod:
	rm -rf ./app/build/min

server-deps:
	cd server && go get

server: server-deps
	cd server && GOARCH=amd64 && GOOS=linux go build

server-prod: server-deps
	cd server && GOARCH=amd64 && GOOS=linux go build -o ./server-linux

dist-clean:
	rm -rf ./dist

dist: app-clean-prod dist-clean app-prod server-prod
	mkdir -p ./dist
	mkdir -p ./dist/service
	mkdir -p ./dist/var
	cp -r app/build/min/assets ./dist/service/
	mv server/server-linux ./dist/service/server
	cp -r server/server-prod.yml ./dist/var/server-example.yml
	tar -czf website.tgz ./dist
