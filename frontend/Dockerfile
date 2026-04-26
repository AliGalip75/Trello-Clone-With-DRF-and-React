FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Vite kullanıyorsan dışarıya açmak için --host şart
CMD ["npm", "run", "dev", "--", "--host"]