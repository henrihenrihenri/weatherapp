FROM node:10

#who did this
MAINTAINER henri <job.henri.kekkonen@gmail.com>

#Where to put
WORKDIR /usr/src/app

#what we need
COPY package*.json ./

#what to do
RUN npm install

COPY . .

#where to host
EXPOSE 8080

#lets host
CMD [ "node", "src/index.js" ]
