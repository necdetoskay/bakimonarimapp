# Base image using Node.js 18 runtime
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install OpenSSL and other dependencies
RUN apk add --no-cache openssl postgresql-client

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Install Prisma CLI and generate client
RUN npm install prisma --save-dev
RUN npx prisma generate

# Make the start script executable
COPY docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh
RUN chmod +x /usr/src/app/docker-entrypoint.sh

# Expose the port your app runs on
EXPOSE 3000

# Start the application using the custom entrypoint script
CMD ["/usr/src/app/docker-entrypoint.sh"]
