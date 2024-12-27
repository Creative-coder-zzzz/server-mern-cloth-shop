FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
