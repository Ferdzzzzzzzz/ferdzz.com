package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/mitchellh/mapstructure"
)

func main() {
	validate := validator.New()

	jsonStr := `
	{
		"Name": "ferdz",
		"Age": 25,
		"Email": "ferdz.steenkamp@gmail.com",
		"ID": 1,
		"Activated": "yasss"
	}
	`

	var x interface{}
	err := json.Unmarshal([]byte(jsonStr), &x)
	panicIfErr(err)

	y := struct {
		Name      string
		Age       int
		Email     string `validate:"required,email"`
		ID        int    `validate:"required"`
		Activated string `validate:"eq=yass"`
	}{}

	err = mapstructure.Decode(x, &y)
	panicIfErr(err)

	err = validate.Struct(y)

	fmt.Println(y)
	fmt.Println(err)

}

func panicIfErr(err error) {
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
