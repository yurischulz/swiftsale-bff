FROM node:18
WORKDIR /app
COPY . .
RUN npm install -g ts-node-dev && npm install
CMD ["ts-node-dev", "src/server.ts"]