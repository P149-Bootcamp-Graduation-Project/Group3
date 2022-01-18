package config

import (
	env "github.com/joho/godotenv"
	"os"
)

var (
	ENV_MODE string
)

func init() {
	errLoadEnv := env.Load(".env")
	if errLoadEnv != nil {
		println("Error on loading env file")
	}

	ENV_MODE = os.Getenv("GENERATOR_MODE")
}
