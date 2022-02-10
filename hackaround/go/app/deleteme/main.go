package main

import (
	"fmt"
	"reflect"
)

type User struct {
	Name string
	Age  int
	ID   int64
}

type Book struct {
	Id      int
	Owner   User
	Title   string
	Price   float32
	Authors []string
}

func main() {
	book := Book{
		Id: 1,
		Owner: User{
			Name: "asdf",
			Age:  3,
			ID:   13,
		},
		Title:   "asdfasdf",
		Price:   13,
		Authors: []string{},
	}
	e := reflect.ValueOf(&book).Elem()

	for i := 0; i < e.NumField(); i++ {
		varName := e.Type().Field(i).Name
		varType := e.Type().Field(i).Type
		varValue := e.Field(i).Interface()
		fmt.Printf("%v %v %v\n", varName, varType, varValue)
	}
}

// func panicIfErr(err error) {
// 	if err != nil {
// 		fmt.Println(err)
// 		os.Exit(1)
// 	}
// }
