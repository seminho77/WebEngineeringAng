# Stage 1: Development
FROM node:20 AS development

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Angular development server port
EXPOSE 4200

# Start Angular app in development mode
CMD ["npm", "start"]

# Stage 2: Production
FROM node:20 AS build

WORKDIR /usr/src/app

# Install dependencies and build the app
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Run the Angular production build
RUN npm run build -- --configuration production

# Stage 3: Serve with Nginx
FROM nginx:alpine AS production

# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy build artifacts to Nginx's default web root
COPY --from=build /usr/src/app/dist/browser /usr/share/nginx/html

# Expose the HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
