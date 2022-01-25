package main

import (
	"fmt"

	"github.com/ferdzzzzzzzz/ferdzz/core/rand"
)

func main() {
	token, err := rand.RememberToken()
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(token)
}
