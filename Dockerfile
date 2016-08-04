FROM node:latest

# Ruby dependencies
RUN apt-get update -qq
RUN apt-get install ruby-dev rubygems -yq
RUN gem install bundler

# Make directory
RUN mkdir -p /mnt/app
WORKDIR /mnt/app

# Instal dependencies
COPY package.json typings.json Gemfile* /mnt/app/
RUN npm install -s --unsafe-perm

# Copy rest of application
COPY . /mnt/app
# Default start command
CMD [ "npm", "start" ]
