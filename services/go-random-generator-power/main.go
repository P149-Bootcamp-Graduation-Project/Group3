package main

import (
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"log"
	cnf "main/adapters/config"
	controllers "main/app/controller"
	cm "main/internal/common"
	"net/http"
	"os"
	"strconv"
)

type App struct {
	Router *mux.Router
	err    error
}

func main() {
	cntrl := controllers.NewSensorController()
	router := mux.NewRouter()

	sensors := router.PathPrefix("/sensor").Subrouter()
	sensors.HandleFunc("/generate", cntrl.DataGenerator).Methods("POST")

	if cnf.ENV_MODE == "on" {
		val, err := strconv.Atoi(os.Getenv("SENSOR_TOTAL"))
		if err != nil {
			panic(err)
		}
		for i := 1; i <= val; i++ {
			go cm.BGGenerator(i)
		}
	}

	log.Fatal(http.ListenAndServe("0.0.0.0:3005", handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}), handlers.AllowedOrigins([]string{"*"}))(router)))

}
