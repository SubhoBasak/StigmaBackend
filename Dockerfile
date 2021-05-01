FROM node
COPY . /app
WORKDIR /app
EXPOSE 5000
RUN apt-get update
RUN npm i
RUN npm i pm2 -g
CMD pm2-runtime index.js