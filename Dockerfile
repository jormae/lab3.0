FROM node:alpine AS build_image
WORKDIR /app
COPY package.json yarn.lock ./
# install dependencies
RUN yarn install --check-files --frozen-lockfile --network-timeout 100000

ARG NEXT_HOST_NAME
ARG NEXT_DB_USER
ARG NEXT_DB_PASSWORD
ARG NEXT_DB_NAME
ARG NEXT_DB_PORT

ENV NEXT_HOST_NAME=${NEXT_HOST_NAME}
ENV NEXT_DB_USER=${NEXT_DB_USER}
ENV NEXT_DB_PASSWORD=${NEXT_DB_PASSWORD}
ENV NEXT_DB_NAME=${NEXT_DB_NAME}
ENV NEXT_DB_PORT=${NEXT_DB_PORT}

COPY . .
# build
RUN yarn build 
# remove dev dependencies
RUN npm prune --production
FROM node:alpine
WORKDIR /app
# copy from build image
COPY --from=build_image /app/package.json ./package.json
COPY --from=build_image /app/node_modules ./node_modules
COPY --from=build_image /app/.next ./.next
COPY --from=build_image /app/public ./public
EXPOSE 3000

CMD ["npm", "start"]