FROM node:current-alpine3.18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

EXPOSE 3001

CMD ["node", "./server.js"]
