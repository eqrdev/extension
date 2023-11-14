FROM node:21.1.0

MAINTAINER hello@equalizer.dev

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium
ENV PUPPETEER_RUN_IN_DOCKER true

WORKDIR /app

COPY package.json yarn.lock .pnp.cjs .pnp.loader.mjs .yarnrc.yml ./
COPY .yarn ./.yarn
COPY modules ./modules/
COPY /modules/auto-connect/crontab /etc/cron.d/equalizer
COPY .env ./

RUN apt-get update && apt-get install -y chromium --no-install-recommends cron
RUN yarn install
RUN yarn build
RUN chmod +x /etc/cron.d/equalizer
RUN touch /var/log/cron.log

CMD printenv > /etc/environment && cron && tail -f /var/log/cron.log
