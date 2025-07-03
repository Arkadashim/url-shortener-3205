FROM node:18

   WORKDIR /app

   COPY package.json package-lock.json ./
   COPY nx.json ./
   COPY tsconfig.base.json ./
   COPY apps/frontend ./apps/frontend
   COPY libs/shared ./libs/shared

   RUN npm install
   RUN npm install -g nx@latest
   RUN npx nx reset

   EXPOSE 4200

   CMD ["npx", "nx", "serve", "frontend"]