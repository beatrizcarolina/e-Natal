# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that NestJS will run on (adjust as needed)
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Migrate prisma database
RUN npx prisma migrate dev
RUN npx prisma migrate deploy

# Start the NestJS application
CMD ["npm", "run", "start:dev"]
