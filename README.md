# website 
![Build Status](https://travis-ci.org/palantir/stacktrace.svg?branch=master)

## Development

### Building a distribution

`make dist` will output a file `website.tgz` in the repository root which is ready to be deployed.

### Local development

1. In one terminal window, start the server with test config: `cd server && go build && ./server --config server.yml`
2. In another, start webpack running: `cd app && webpack --watch`
3. Now changes to the front-end code will be reflected in browser after a refresh.
