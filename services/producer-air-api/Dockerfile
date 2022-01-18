# FROM node:16
FROM node:17-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
 
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 9463
CMD [ "node", "app.js" ]

#RUN npm install
#COPY . .
#EXPOSE 3000
#CMD ["supervisor", "app.js"]
