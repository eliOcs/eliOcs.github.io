FROM mcr.microsoft.com/playwright:v1.62.1-noble

WORKDIR /site

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "test"]
