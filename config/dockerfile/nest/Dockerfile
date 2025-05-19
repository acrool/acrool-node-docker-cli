FROM node:18.3.0-alpine AS builder
ARG MAX_OLD_SPACE_SIZE=2048
WORKDIR /opt/app/
COPY package.json yarn.lock ./
RUN awk '/},/ { p = 0 } { if (!p) { print $0 } } /"devDependencies":/ { p = 1 }' package.json > package.json.tmp && mv package.json.tmp package.json && yarn install --prod --frozen-lockfile
COPY . .
RUN yarn build
RUN mkdir ./copy-tmp && \
    mv asset ./copy-tmp && \
    mv node_modules ./copy-tmp && \
    mv dist ./copy-tmp


# And then copy over node_modules, etc from that stage to the smaller base image
FROM node:18.3.0-alpine
WORKDIR /opt/app/
COPY --from=builder /opt/app/copy-tmp .
RUN mkdir /tmp/bearests

EXPOSE 8080
CMD ["node", "--max_old_space_size=$MAX_OLD_SPACE_SIZE", "dist/main.js"]
