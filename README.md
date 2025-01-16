# Web Engineering Project

This repository contains the frontend and backend of the Web Engineering project. The frontend is built with Angular, and the backend is built with Node.js and Express.js. The project is structured across multiple branches for development, deployment, and Docker integration.

---

## Branch Overview

### 1. **Development Branch**
This branch contains the fully integrated Angular app for development purposes.  

### 2. **Deployment Branch**
This branch contains the fully integrated Angular app for production purposes. 

### 3. **Frontend-Worktree**
This branch contains the Angular frontend.

### 4. **Backend-Worktree**
This branch contains the backend built with Node.js and Express.js.

### 5. **Docker-Configs**
This branch contains the Docker configuration files (`docker-compose.yml` and `docker-compose.prod.yml`) for running the application using Docker.

---

## Instructions for Each Branch

### 1. **Development Branch**
1. npm install
2. npm start

### 2. **Deployment Branch**
1. npm install
2. npm start

### 3. **Frontend-Worktree**
1. npm install
2. npm start

### 4. **Backend-Worktree**
1. npm install
2. npm run dev

### 5. **Docker-Configs**
1. 
From branch "docker-configs" run following commands beforehand before being able to execute docker-compose yamls:
git worktree add ../WebEngineeringAng-frontend frontend-worktree
git worktree add ../WebEngineeringAng-backend backend-worktree
2. 
Now the commands for docker can be executed:
For development: docker-compose -f docker-compose.yml up --build
For production: docker-compose -f docker-compose.prod.yml up --build
