# Backend Dockerfile
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose backend port (adjust if your backend runs on another port)
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]
