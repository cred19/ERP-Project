FROM node:20-slim AS build

WORKDIR /app
COPY package_v8.json package.json
RUN npm install
COPY ./public ./public
COPY ./src ./src
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80