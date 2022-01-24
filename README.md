
# Inavitas NodeJS Bootcamp Graduation Project Group 2

## School Energy Tracking System

With this project, we will be able to monitor temperature, air quality and average electricity consumption of the classrooms. 3 different sensors will be generate and simulated data in seconds. This data will be retrieved from PostgreSql and Redis with Reader API. This data will first be added to the queue by the Producer API. Consumer API will receive this data and save it in databases. It also logs all errors to MongoDB with another API.

<p  align="center">
<img src="img/proje_2022-01-05_14-40-33.png" alt="pelus" width="100%" height="50%" align="center" style="margin:10px">
</p>

### Microservices
#### Random Data Generator   
    Air Data Generator  
    Temperature Data Generator  
    Electricity Data Generator  
#### Producers
    Air Producer
    Temperature Producer
    Electricity Producer
#### Consumers
    Air Consumer
    Temperature Consumer
    Electricity Consumer
#### Error Log API
#### Reader API


## Installation
Clone First
```bash
 git clone https://github.com/P149-Bootcamp-Graduation-Project/Group3
```

To run each API

```bash
  npm i
  node app.js
```

To run data generators

```bash
  go run main.go
```

## Authors

- [@İlyas Yağcıoğlu](https://github.com/ilyas9461) 
    - (Air Producer, Temperature Producer, Electricity Producer, Reader API)
- [@Oğuzhan Eyerci](https://github.com/oguzeyerci) 
    - (Air Consumer, Temperature Consumer, Electricity Consumer, Error Log API )
- [@Atakan Dönmez](https://github.com/atakandnmz) 
    - (Air Consumer, Temperature Consumer, Electricity Consumer)

## Acknowledgements

 - [Kafka-Node](https://www.npmjs.com/package/kafka-node)
 - [Redis](https://redis.io/documentation)
 - [MongoDb](https://docs.mongodb.com/drivers/node/current/)
 - [PostgreSql](https://node-postgres.com/)
 - [Swagger](https://www.npmjs.com/package/express-swagger-generator)
 - [Sercan Reyhanlı](https://github.com/IvanBarayev)

 ## Tech Stack

**Server:** Node, Express   
**Databases:** PostgreSql (for main database), MongoDb (for error logs), Redis (for cache)  
**Other:** Docker, Kafka (for queue), Swagger (for Documentation), jwt (for user auth)



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

    PGHOST=88.198.26.82
    PGPORT=5432
    PGUSER=group2
    PGPASSWORD=Password1
    PGDATABASE=patika

    REDIS_HOST=88.198.26.82
    REDIS_PORT=6379
    REDIS_INDEX=2
    REDIS_PASS=dd3j5sKmUHVD6xpG

    MONGODBNAME = test
    MONGOURI = mongodb+srv://ivanbarayev:tDVRDyxJbdjF7k9G@docdb.xmg8e.mongodb.net/?ssl=true&authSource=admin

    producer-temp-api APP_PORT=9461
    producer-power-api APP_PORT=9462
    producer-air-api APP_PORT=9463

    consumer-temp-api APP_PORT=9464
    consumer-power-api APP_PORT=9465
    consumer-air-api APP_PORT=9466

    error-logger-api APP_PORT=9467

    APP_HOST=127.0.0.1  


###  Producer & fake data generator working video:

<a href="https://youtu.be/lW16hMUe1_I" target="_blank">
     <img src="https://camo.githubusercontent.com/241d4106ff5edca2ee25e04dcf4546fad9d20b626f7a10990307e8f83e95459f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f796f75747562652d2532334646303030302e7376673f267374796c653d666f722d7468652d6261646765266c6f676f3d796f7574756265266c6f676f436f6c6f723d7768697465253232" alt="youtube">
</a>

###  Producer is send error to error-logger-api :

<a href="https://youtu.be/vaKyr5OrAA0" target="_blank">
     <img src="https://camo.githubusercontent.com/241d4106ff5edca2ee25e04dcf4546fad9d20b626f7a10990307e8f83e95459f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f796f75747562652d2532334646303030302e7376673f267374796c653d666f722d7468652d6261646765266c6f676f3d796f7574756265266c6f676f436f6c6f723d7768697465253232" alt="youtube">
</a>