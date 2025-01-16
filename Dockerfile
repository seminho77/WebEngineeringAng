# Stage 1: Development
FROM node:20 AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon for development
RUN npm install -g nodemon

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Use nodemon for development mode
CMD ["npm", "run", "dev"]

# Stage 2: Production
FROM node:20 AS production

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Run production server
CMD ["npm", "start"]
