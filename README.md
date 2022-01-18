
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
- Derya ÜNVER

### ENV :
```bash
- producer-temp-api port=9461
- producer-power-api port=9462
- producer-air-api port=9463

- consumer-temp-api port=9464
- consumer-power-api port=9465
- consumer-air-api port=9466

- error-logger-api port=9467

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



