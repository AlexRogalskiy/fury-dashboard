# Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

FROM node:lts as webapp

ENV APP_ENV=production
ENV SERVER_OFFLINE=false
ENV SERVER_BASE_PATH=""

COPY web-client/package.json /var/tmp/package.json
RUN cd /var/tmp && yarn install

COPY web-client web-client

RUN cd web-client && \
    ln -sfv /var/tmp/node_modules .

RUN yarn --cwd ./web-client build

FROM golang:1.20-buster AS compile

RUN apt update && apt install -y libsystemd-dev
RUN curl -sfL https://install.goreleaser.com/github.com/goreleaser/goreleaser.sh | sh

WORKDIR /app
COPY ./go.mod go.mod
COPY ./go.sum go.sum
COPY ./main.go main.go
COPY ./internal internal
COPY ./.goreleaser.yml .goreleaser.yml
RUN mkdir static/
COPY --from=webapp web-client/dist/ static/
RUN goreleaser build --debug --snapshot --rm-dist

FROM debian:buster

RUN mkdir -p /app
WORKDIR /app
COPY --from=compile /app/dist/fury-dashboard-linux_linux_amd64/fury-dashboard /app/fury-dashboard
CMD ["/app/fury-dashboard"]
