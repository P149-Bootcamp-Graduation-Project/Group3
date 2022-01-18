package entities

import (
	"time"
)

type SensorRequestData struct {
	SensorId int64 `json:"sensor_id"`
}

type SensorData struct {
	Id         int64     `json:"id"`
	SensorData string    `json:"sensor_data"`
	TimeStamp  time.Time `json:"time_stamp"`
}

type ReturnData struct {
	Status     int    `json:"status,omitempty"`
	Id         int64  `json:"id,omitempty"`
	SensorData string `json:"sensor_data,omitempty"`
	TimeStamp  int64  `json:"time_stamp,omitempty"`
	Message    string `json:"message,omitempty"`
}
