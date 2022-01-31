// Package neo provides neo4j implementations
package neo

import "github.com/neo4j/neo4j-go-driver/v4/neo4j"

// https://github.com/neo4j-examples/movies-golang-bolt/blob/main/server.go

func NewDriver(uri, uname, password string) (neo4j.Driver, error) {
	driver, err := neo4j.NewDriver(uri, neo4j.BasicAuth(uname, password, ""))
	if err != nil {
		return nil, err
	}

	return driver, nil
}
