# build app
# ==============================================================================
FROM node:16 as build

RUN mkdir /app
WORKDIR /app

COPY package.json remix.config.js /app/

RUN npm install

COPY public ./public
COPY app ./app
COPY tsconfig.json ./tsconfig.json

RUN npm run build
RUN npm prune --production


# production container
# ==============================================================================
# FROM node:16-bullseye-slim

# ENV NODE_ENV=production

# RUN mkdir /app
# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm install --production
# COPY --from=build /app/build /app/build
# COPY --from=build /app/public /app/public

# EXPOSE 3000

# CMD ["npm", "run", "start"]
