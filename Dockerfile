# Base image
FROM node:18 As development

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# ENV NODE_ENV production
ENV NODE_ENV development

# Start the server
CMD [ "node", "dist/apps/sdvv-backend-nest/main.js" ]
