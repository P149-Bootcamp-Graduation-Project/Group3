# go-random-generator


````dotenv
ENV FILE
MAIN_API_URI=127.0.0.1
MAIN_API_PORT=3002

SENSOR_TOTAL=3
SENSOR1_RANGE=1-98 //for temperature
SENSOR2_RANGE=100-498 //for air quality
SENSOR3_RANGE=1-500 //for electricity

SENSOR1_PATH=/temp
SENSOR1_METHOD=GET
SENSOR2_PATH=/air  
SENSOR2_METHOD=GET  
SENSOR3_PATH=/electrcity  
SENSOR3_METHOD=GET  

SENSOR1_INTERVAL=1  
SENSOR2_INTERVAL=1  
SENSOR3_INTERVAL=2  

GENERATOR_MODE=on
````

````
if GENERATOR_MODE=on the system up with value generator
if GENERATOR_MODE=off the system up as a REST API
DEFAULT is on
````

````
ROUTES (all methods are POST)
FOR ALL Data > ip:port/sensor/generator

POST DATA
{
   "sensor_id": 1
}
````