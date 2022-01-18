package common

import (
	"fmt"
	"io/ioutil"
	ent "main/internal/entities"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

var (
	SensorData int
)

func ReturnData(status int, id int64, sensor_data string, message string) ent.ReturnData {
	data := ent.ReturnData{
		Status:     status,
		Id:         id,
		SensorData: sensor_data,
		TimeStamp:  time.Now().UnixMilli(),
		Message:    message,
	}
	return data
}

func NumGenerator(values string) int {
	ranges := Explode("-", values)
	min, _ := strconv.Atoi(ranges[0])
	max, _ := strconv.Atoi(ranges[1])

	rand.Seed(time.Now().UnixNano())
	data := rand.Intn(max-min+1) + min
	return data
}

func Explode(delimiter, text string) []string {
	if len(delimiter) > len(text) {
		return strings.Split(delimiter, text)
	} else {
		return strings.Split(text, delimiter)
	}
}

func BGGenerator(index int) {
	IntervalIndex := fmt.Sprintf("SENSOR%d_INTERVAL", index)
	val, err := strconv.Atoi(os.Getenv(IntervalIndex))
	if err != nil {
		panic(err)
	}

	ticker := time.NewTicker(time.Duration(val) * time.Second)
	RangeIndex := fmt.Sprintf("SENSOR%d_RANGE", index)
	for _ = range ticker.C {
		SensorData = NumGenerator(os.Getenv(RangeIndex))
		PostToAPI(index, SensorData)
		fmt.Printf("Sensor %d Data : %d \n", index, SensorData)
	}
}

func PostToAPI(index int, sensor_data int) int {
	PathIndex := fmt.Sprintf("SENSOR%d_PATH", index)
	URL := fmt.Sprintf("http://%s:%s/%s", os.Getenv("MAIN_API_URI"), os.Getenv("MAIN_API_PORT"), os.Getenv(PathIndex))
	println(URL)
	MethodIndex := fmt.Sprintf("SENSOR%d_METHOD", index)
	Method := os.Getenv(MethodIndex)
	Data := fmt.Sprintf(`{"status": 1,"id": %d,"sensor_data": %d,"time_stamp": %d}`, index, sensor_data, time.Now().UnixMilli())
	fmt.Printf("DATAAAAA : %s", Data)
	payload := strings.NewReader(Data)

	client := &http.Client{}
	req, err := http.NewRequest(Method, URL, payload)

	if err != nil {
		fmt.Println(err)
		return 0
	}
	req.Header.Add("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return 0
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return 0
	}
	fmt.Println(string(body))
	return 1
}
