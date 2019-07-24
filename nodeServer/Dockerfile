#This file creates a docker image that contains all the dependencies the Node.js application
#requires

#Build image with latest Node image version
FROM node:latest

#Add all the files in the current directory into the app directory of this image
ADD . /app

#Move to the directory
WORKDIR /app

#Crete directory to store files (inside app folder, at same level as queryLibraries.js y server.js)
RUN mkdir uploads
RUN mkdir public

#Mover archivos a servidor web express
ADD ./cliente /app/public

#Install npm
RUN npm install

#Generar el paquete de json requerido por express
RUN npm init -y

#Install Express and save flag to update dependencies inside package.json
RUN npm install express@4.16.0 --save

#Instalar cors library requerida por node
RUN npm install cors

#Instalar FileSystem library
RUN npm install fs

#Instalar postgres library
RUN npm install pg

#Instalar bodyparser library
RUN npm install body-parser --save

#Epose port 80
EXPOSE 80

#Set the default comand for the container as. 'node server.js'
CMD ["node", "server.js"]