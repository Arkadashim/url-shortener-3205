FROM node:20

   WORKDIR /app

   COPY package.json package-lock.json ./
   COPY nx.json ./
   COPY tsconfig.base.json ./
   COPY apps/backend ./apps/backend
   COPY libs/shared ./libs/shared

   RUN npm install
   RUN npm install -g nx@latest
   RUN npx nx reset

   EXPOSE 3000

   CMD ["npx", "nx", "serve", "backend"]