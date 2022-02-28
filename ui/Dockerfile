# base node image
FROM node:16-bullseye-slim as base

# build app
# ==============================================================================
FROM base as build

RUN mkdir /ferdzz
WORKDIR /ferdzz

COPY package.json .
COPY package-lock.json .
COPY app ./app
COPY public ./public
COPY remix.config.js .
COPY stitches.config.ts .
COPY tsconfig.json .
COPY remix.env.d.ts .

RUN npm install

RUN npm install --production=false

ENV NODE_ENV=production

RUN npm run build
RUN npm prune --production


# production container
# ==============================================================================
FROM base

ENV NODE_ENV=production

RUN mkdir /ferdzz
WORKDIR /ferdzz

COPY --from=build /ferdzz/node_modules /ferdzz/node_modules
COPY --from=build /ferdzz/build /ferdzz/build
COPY --from=build /ferdzz/public /ferdzz/public

COPY remix.config.js .
COPY package.json .

CMD ["npm", "run", "start"]%