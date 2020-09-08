FROM alpine:3.4

# Update and install required packages
RUN apk add --update nodejs bash git

RUN mkdir /app

# Install app dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN cd /app; npm install

# Copy application source
COPY . /app

WORKDIR /app

# Start application
CMD ["npm", "start"]