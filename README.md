
# Energy Monitoring System for Schools

<p  align="center">
<img src="img/proje_2022-01-05_14-40-33.png" alt="pelus" width="100%" height="50%" align="center" style="margin:10px">
</p>

### Project Group Members
- İlyas YAĞCIOĞLU   (producer)
- Emre DEMİR 
- Oğuzhan EYERCİ (consumer)
- Emre SOLMAZ   (Error Logger)
- Atakan DÖNMEZ (consumer)
- Muhammed Fatih CEYLAN 
- Derya ÜNVER (-)

### ENV :
```bash
- producer-temp-api port=9461
- producer-power-api port=9462
- producer-air-api port=9463

- consumer-temp-api port=9464
- consumer-power-api port=9465
- consumer-air-api port=9466

- error-logger-api port=9467
- error-logger-api path=/errlogs


- reader-api port=9468

- Kafka Topics :
    - Group2-Temp-Logs
    - Group2-Air-Logs
    - Group2-Power-Logs
- Kafka Consumer  groupId:
    -Patika-Inavitas-Group2
- Kafka  clientId: 
    - group2-kafka_logs


```
###  Producer & fake data generator working video:

<a href="https://youtu.be/lW16hMUe1_I" target="_blank">
     <img src="https://camo.githubusercontent.com/241d4106ff5edca2ee25e04dcf4546fad9d20b626f7a10990307e8f83e95459f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f796f75747562652d2532334646303030302e7376673f267374796c653d666f722d7468652d6261646765266c6f676f3d796f7574756265266c6f676f436f6c6f723d7768697465253232" alt="youtube">
</a>

###  Producer is send error to error-logger-api :

<a href="https://youtu.be/vaKyr5OrAA0" target="_blank">
     <img src="https://camo.githubusercontent.com/241d4106ff5edca2ee25e04dcf4546fad9d20b626f7a10990307e8f83e95459f/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f796f75747562652d2532334646303030302e7376673f267374796c653d666f722d7468652d6261646765266c6f676f3d796f7574756265266c6f676f436f6c6f723d7768697465253232" alt="youtube">
</a>