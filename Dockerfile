FROM mcr.microsoft.com/playwright:v1.20.0-focal

ENV NODE_ENV=production
COPY . /app
WORKDIR /app
RUN npm install & npm install typescript -g
RUN  npm run build
ENTRYPOINT [ "/bin/bash" ]