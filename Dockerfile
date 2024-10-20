FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --ignore-scripts

COPY src/ ./src/
COPY public/ ./public/

RUN yarn build

RUN mkdir -p node_modules/.cache && chmod -R 754 node_modules/.cache

USER node
EXPOSE 3000
CMD ["yarn", "start"]
