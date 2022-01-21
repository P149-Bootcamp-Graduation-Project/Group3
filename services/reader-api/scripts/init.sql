SELECT 'CREATE DATABASE patika_nodejs_bootcamp'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'patika_nodejs_bootcamp')
\gexec

DROP TABLE If EXISTS users CASCADE;
CREATE TABLE users (
  	id INT8 GENERATED ALWAYS AS IDENTITY,  /*INT8 => BIGINT*/
    user_title VARCHAR(255)  NOT NULL,      /* AD-soyad ünvan, şirket ismi vb.*/
    user_name VARCHAR(255)  NOT NULL, /*unique olmalı girişte*/
    user_pass VARCHAR(255)  NOT NULL,
    email VARCHAR(255)  NOT NULL,
    phone VARCHAR(255)  NOT NULL,
    last_login timestamp(0) DEFAULT CURRENT_TIMESTAMP,
    create_at timestamp(0) DEFAULT CURRENT_TIMESTAMP,
    is_active INT2 DEFAULT 0

);

DROP TABLE If EXISTS schools CASCADE; /*CASCADE Auto increment id resetleyerek devam ettirir. PosrgreSQl ait bir özellik*/
CREATE TABLE schools (
    id INT8 GENERATED ALWAYS AS IDENTITY,  /*INT8 => BIGINT  her ikisi de olur.*/
    school_name VARCHAR(255) NOT NULL, /* boş olamaz gereklidir.*/
    detail VARCHAR(255) DEFAULT NULL,
    city_id INT8 DEFAULT 0, /*INT8 => BIGINT*/
    total_class INT8 DEFAULT 0,
    create_at timestamp(0) DEFAULT CURRENT_TIMESTAMP, /*UDF: User Defined Function, FUNC.: Native Funct. */
    created_by INT8 NOT NULL, /* User talosundaki kullanıcı id si*/
    is_active BOOLEAN DEFAULT true /* Okul devre dışı bırakılabilir. */

);
COMMENT ON COLUMN schools.total_class IS 'Toplam sınıf sayısı';  /*Database de görünmesi için yorum satırı tablo ismi olmalı.*/

DROP TABLE If EXISTS classes CASCADE;/*CASCADE Auto increment id resetleyerek devam ettirir. PosrgreSQl ait bir özellik*/
CREATE TABLE classes (
    id INT8 GENERATED ALWAYS AS IDENTITY,  /*INT8 => BIGINT  her ikisi de olur.*/
    school_id INT8,
    floor_num INT4 DEFAULT 0,
    class_name VARCHAR(255) NOT NULL, /* boş olamaz gereklidir.*/
    detail VARCHAR(255) DEFAULT NULL,
    city_id INT8 DEFAULT 0, /*INT8 => BIGINT*/
    create_at timestamp(0) DEFAULT CURRENT_TIMESTAMP, /*UDF: User Defined Function, FUNC.: Native Funct. */
    created_by INT8 NOT NULL, /* User talosundaki kullanıcı id si*/
    is_active BOOLEAN DEFAULT true /* Sınıf devre dışı bırakılabilir.*/

);
COMMENT ON COLUMN classes.floor_num IS 'Kat sayısı';  /*Database de görünmesi için yorum satırı tablo ismi olmalı.*/

DROP TABLE If EXISTS sensors CASCADE; /*CASCADE Auto increment id resetleyerek devam ettirir. PosrgreSQl ait bir özellik*/
CREATE TABLE sensors (
    id INT8 GENERATED ALWAYS AS IDENTITY,  /*INT8 => BIGINT  her ikisi de olur.*/
    school_id INT8,
    class_id INT8,
    sensor_name VARCHAR(255) NOT NULL, /* boş olamaz gereklidir.*/
    detail VARCHAR(255) DEFAULT NULL,
    default_protocol VARCHAR(255) DEFAULT NULL,
    default_ip VARCHAR(64) DEFAULT NULL NOT NULL,
    default_port VARCHAR(6) DEFAULT NULL NOT NULL,
    defafult_channel VARCHAR(6) DEFAULT NULL NOT NULL,
    create_at timestamp(0) DEFAULT CURRENT_TIMESTAMP, /*UDF: User Defined Function, FUNC.: Native Funct. */
    connected_at timestamp(0) DEFAULT NULL, /*UDF: User Defined Function, FUNC.: Native Funct. */
    created_by INT8 NOT NULL, /* User talosundaki kullanıcı id si*/
    is_online BOOLEAN DEFAULT true, /* Sınıf devre dışı bırakılabilir.*/
    is_active BOOLEAN DEFAULT true /* Sınıf devre dışı bırakılabilir.*/

);
/*Dupicate records */
COMMENT ON COLUMN sensors.is_online IS 'ON OFF';  /*Database de görünmesi için yorum satırı tablo ismi olmalı.*/
COMMENT ON COLUMN sensors.default_protocol IS 'MODBUS, 104';  /*Database de görünmesi için yorum satırı tablo ismi olmalı.*/

DROP TABLE If EXISTS log_temperature CASCADE;
CREATE TABLE log_temperature(
    id INT8 GENERATED ALWAYS AS IDENTITY, 
    school_id INT8,
    class_id INT8,
    sensor_id INT8,
    sensor_data VARCHAR(10),
    read_at timestamp(0) ,  /* data read date time*/
    create_at timestamp(0) DEFAULT CURRENT_TIMESTAMP /*row insert date time*/

);
COMMENT ON COLUMN log_temperature.read_at IS 'Read sensor data date time';

DROP TABLE If EXISTS log_air_quality CASCADE;
CREATE TABLE log_air_quality(
    id INT8 GENERATED ALWAYS AS IDENTITY, 
    school_id INT8,
    class_id INT8,
    sensor_id INT8,
    sensor_data VARCHAR(10),
    read_at timestamp(0) ,  /* data read date time*/
    create_at timestamp(0) DEFAULT CURRENT_TIMESTAMP /*row insert date time*/

);
COMMENT ON COLUMN log_air_quality.read_at IS 'Read sensor data date time';

DROP TABLE If EXISTS log_electricity_consumption CASCADE;
CREATE TABLE log_electricity_consumption(
    id INT8 GENERATED ALWAYS AS IDENTITY, 
    school_id INT8,
    class_id INT8,
    sensor_id INT8,
    sensor_data VARCHAR(10),
    read_at timestamp(0) ,  /* data read date time*/
    create_at timestamp(0) DEFAULT CURRENT_TIMESTAMP/*row insert date time*/

);
COMMENT ON COLUMN log_electricity_consumption.read_at IS 'Read sensor data date time';

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA group2 TO patika;




