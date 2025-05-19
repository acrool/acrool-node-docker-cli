# Acrool Node Docker CLI


<a href="https://github.com/acrool/acrool-node-docker-cli" title="Acrool Node Docker CLI - docker build/push/remove for Nodejs">
    <img src="https://raw.githubusercontent.com/acrool/acrool-node-docker-cli/main/public/og.png" alt="Acrool Node Docker CLI Logo"/>
</a>

<p align="center">
   docker build/push/remove for Nodejs
</p>

<div align="center">


[![NPM](https://img.shields.io/npm/v/@acrool/node-docker-cli.svg?style=for-the-badge)](https://www.npmjs.com/package/@acrool/node-docker-cli)
[![npm](https://img.shields.io/bundlejs/size/@acrool/node-docker-cli?style=for-the-badge)](https://github.com/acrool/@acrool/node-docker-cli/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/l/@acrool/node-docker-cli?style=for-the-badge)](https://github.com/acrool/node-docker-cli/blob/main/LICENSE)

[![npm downloads](https://img.shields.io/npm/dm/@acrool/node-docker-cli.svg?style=for-the-badge)](https://www.npmjs.com/package/@acrool/node-docker-cli)
[![npm](https://img.shields.io/npm/dt/@acrool/node-docker-cli.svg?style=for-the-badge)](https://www.npmjs.com/package/@acrool/node-docker-cli)

</div>


## Install

```bash
yarn add -D @acrool/node-docker-cli
```

## Setting

```bash
$ cp ./node_modules/bear-node-docker/config/nginx ./deploy/nginx
```

in your package.json
```json
{
   "dockerRegistry": "docker.io/imagine10255",
   "scripts": {
     "docker:build": "acrool-node-docker-cli docker --dockerfile=./node_modules/bear-node-docker/config/dockerfile/react/Dockerfile",
     "docker:push": "acrool-node-docker-cli push"
   }
}
```

imagine10255 is your dockerhub account, your can change your dockerhub account



### [Options] Custom dockerfile in root type command
```bash
# react
$ cp ./node_modules/bear-node-docker/config/dockerfile/react/Dockerfile ./

# nest 
$ cp ./node_modules/bear-node-docker/config/dockerfile/nest/Dockerfile ./ 
```

package.json
```json
{
    "scripts": {
      "docker:build": "bear-node-docker build --dockerfile=./Dockerfile"
    }
}
```




### [Options] Custom use provider docker registry

package.json
```json
{
   "dockerRegistry": "myDockerProvider.bear.com:8443"
}
```


### [Options] Custom publicUrl

package.json

```json
{
  "scripts": {
    "docker:build": "bear-node-docker build --publicUrl=/recommend  --dockerfile=./Dockerfile"
  }
}
```


### Only packaged into docker image

In some old projects, npm build gets stuck when run inside Docker. In such cases, you can build locally and then only put the build path into the Docker image.

Dockerfile
```dockerfile
# And then copy over node_modules, etc from that stage to the smaller base image
FROM nginx:1.19-alpine
COPY build /usr/share/nginx/html
COPY deploy/config-nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

> Be aware that `.dockerignore` should not include the build folder (the default for `create-react-app` is 'build', while for `Vite` it's 'dist').


package.json
```json
{
  "scripts": {
      "build": "react-scripts build",
      "docker:build": "yarn build && bear-node-docker build --publicUrl=/recommend  --dockerfile=./Dockerfile"
  }
}
```

### Test

```bash
ts-node lib/build-docker/node-run.ts
```


## License

MIT © [Acrool](https://github.com/acrool) & [Imagine](https://github.com/imagine10255)

