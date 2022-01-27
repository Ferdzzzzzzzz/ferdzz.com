package main

import (
	"fmt"

	"github.com/ferdzzzzzzzz/ferdzz/core/encrypt"
)

// func main() {
// 	neoHost := "bolt://localhost:7687"

// 	driver, err := neo.NewDriver(neoHost, "neo4j", "password")
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	session := driver.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
// 	defer session.Close()

// 	result, err := session.WriteTransaction(func(tx neo4j.Transaction) (interface{}, error) {
// 		result, err := tx.Run(`
// 		MERGE (u:User {email: $email})

// 		CREATE (s:Session)
// 		SET s.rememberToken = $token
// 		CREATE (u)-[:HAS_ACTIVE]->(s)

// 		`,

// 			map[string]interface{}{
// 				"token": "asdf",
// 				"email": "steph@gmail",
// 				"age":   23,
// 			},
// 		)

// 		if err != nil {
// 			fmt.Println("TX err")
// 			return nil, err
// 		}

// 		if result.Next() {
// 			return result.Record().Values[0], nil
// 		}

// 		return nil, result.Err()

// 	})

// 	if err != nil {

// 		fmt.Println(err)
// 		return
// 	}

// 	fmt.Println(result)

// }

func main() {
	service, err := encrypt.NewService("monkeypoesmonkeypoesmonkeypoesmo")
	if err != nil {
		fmt.Println(err)
		return
	}

	val, err := service.Encrypt("Hello Poes")
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(val)

	val, err = service.Decrypt("LxbncJe6TZnJpH-oioCDa6c8I0-k6yuC1Iju85Gp1VnZiaSRAsI=")
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(val)

}
