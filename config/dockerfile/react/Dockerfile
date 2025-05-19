FROM node:18.3.0-alpine AS builder
ARG REACT_APP_CDN_ASSETS_PATH
ARG PUBLIC_URL
WORKDIR /opt/app/
COPY package.json yarn.lock ./
RUN awk '/},/ { p = 0 } { if (!p) { print $0 } } /"devDependencies":/ { p = 1 }' package.json > package.json.tmp && mv package.json.tmp package.json && yarn install --prod --frozen-lockfile
COPY ../.. .
ENV REACT_APP_CDN_ASSETS_PATH=$REACT_APP_CDN_ASSETS_PATH
ENV PUBLIC_URL=$PUBLIC_URL
RUN yarn build

# And then copy over node_modules, etc from that stage to the smaller base image
FROM nginx:1.21-alpine
COPY --from=builder /opt/app/build /usr/share/nginx/html
COPY deploy/config/nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
