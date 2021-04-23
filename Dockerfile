# Step 1
FROM node:10-alpine as build-step
RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm config set '@bit:registry' https://node.bit.dev
RUN npm i @bit/nexxtway.react-rainbow.date-picker
RUN npm install

ENTRYPOINT [ "npm", "start" ]
#RUN npm run build

# Stage 2
#FROM nginx:1.17.1-alpine
#COPY --from=build-step /app/build /usr/share/nginx/html