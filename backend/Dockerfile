# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the local source files to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the app
CMD ["npm", "start"]
