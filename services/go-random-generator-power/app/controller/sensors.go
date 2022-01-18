package controller

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	cm "main/internal/common"
	ent "main/internal/entities"
	"net/http"
	"os"
	"strconv"
)

type (
	SensorController struct{}
)

var (
	Status int
	warn   ent.ReturnData
)

func NewSensorController() *SensorController {
	return &SensorController{}
}

func (sc SensorController) DataGenerator(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var d ent.SensorRequestData
	req, err := ioutil.ReadAll(r.Body)
	if err != nil {
		println("parser error")
	}

	err = json.Unmarshal(req, &d)
	if err != nil {
		println("Marshall error")
	}
	RangeIndex := fmt.Sprintf("SENSOR%d_RANGE", d.SensorId)
	SensorData := cm.NumGenerator(os.Getenv(RangeIndex))

	warn := cm.ReturnData(1, d.SensorId, strconv.Itoa(SensorData), "")

	json.NewEncoder(w).Encode(warn)
}
