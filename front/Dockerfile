# Build step with Node
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package configurations
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose Vite's default dev port
EXPOSE 5173

# Run the developer server attached to 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
