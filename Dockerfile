FROM node:20-slim

WORKDIR /app

# Debug: List current directory
RUN ls -la

# Copy package files
COPY package.json ./

# Debug: List files after copy
RUN ls -la

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]