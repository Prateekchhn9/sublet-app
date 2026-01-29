FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Use npm install instead of npm ci (more reliable for Docker)
RUN npm install --only=production --no-package-lock

# Copy source code
COPY src/ ./src/

EXPOSE 4000

CMD ["npm", "start"]

