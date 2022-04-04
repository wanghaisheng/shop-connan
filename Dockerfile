FROM mcr.microsoft.com/playwright:v1.20.0-focal


COPY . /app
WORKDIR /app
RUN npm install
RUN  npm run build
ENTRYPOINT [ "/bin/bash" ]