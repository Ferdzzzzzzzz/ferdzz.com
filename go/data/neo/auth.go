package neo

import (
	"errors"

	"github.com/ferdzzzzzzzz/ferdzz/business/auth"
	"github.com/mitchellh/mapstructure"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
)

func MergeUserAndSession(
	dbSession neo4j.Session,
	email string,
	userSession auth.Session,
) (struct {
	UserID    int64
	SessionID int64
}, error) {

	result, err := dbSession.WriteTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		result, err := tx.Run(`
	MERGE (u:User {Email: $Email})

	CREATE (s:Session)
	SET s.HashedRememberToken 	= $Token
	SET s.Start 				= $Start
	SET s.Exp 					= $Exp
	SET s.Activated 			= false

	CREATE (u)-[:HAS]->(s)
	RETURN {
		UserID: id(u), 
		SessionID: id(s)
	}
	`,

			map[string]interface{}{
				"Email": email,
				"Token": userSession.HashedRememberToken,
				"Start": userSession.Start,
				"Exp":   userSession.Exp,
			},
		)

		if err != nil {
			return nil, err
		}

		if !result.Next() {
			return nil, result.Err()
		}

		return result.Record().Values[0], nil

	})

	if err != nil {
		return struct {
			UserID    int64
			SessionID int64
		}{}, err
	}

	unmarshal := struct {
		UserID    int64
		SessionID int64
	}{}

	err = mapstructure.Decode(result, &unmarshal)
	if err != nil {
		return struct {
			UserID    int64
			SessionID int64
		}{}, err
	}

	return unmarshal, nil
}

// See Map Projections for query explanation
// https://neo4j.com/docs/cypher-manual/4.4/syntax/maps/
func GetAuthSession(
	dbSession neo4j.Session,
	magicLink auth.MagicLink,
) (auth.Session, error) {

	result, err := dbSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		result, err := tx.Run(`
	MATCH (u:User)-[:HAS]->(s:Session)
	WHERE 
		id(u) = $UserID 		AND
		id(s) = $SessionID
	
	WITH properties(s) AS session, id(s) AS ID

	RETURN session{.*, ID}
	`,
			map[string]interface{}{
				"UserID":    magicLink.UserID,
				"SessionID": magicLink.SessionID,
			},
		)

		if err != nil {
			return nil, err
		}

		if !result.Next() {
			return nil, result.Err()
		}

		return result.Record().Values[0], nil

	})

	if err != nil {
		return auth.Session{}, err
	}

	authSession := auth.Session{}

	err = mapstructure.Decode(result, &authSession)
	if err != nil {
		return auth.Session{}, errors.New("error reading from the database")
	}

	return authSession, nil
}

func CreateAuthSession(
	dbSession neo4j.Session,
	magicLink auth.MagicLink,
) error {
	_, err := dbSession.WriteTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		_, err := tx.Run(`
	MATCH (s:Session)
	WHERE 
		s.id = $sessionID
	
	SET s.activated = true
	`,
			map[string]interface{}{
				"sessionID": magicLink.SessionID,
			},
		)

		if err != nil {
			return nil, err
		}

		return nil, nil

	})

	if err != nil {
		return err
	}

	return nil
}

func GetUserContext(
	dbSession neo4j.Session,
	userID int64,
	sessionID int64,
) (auth.User, auth.Session, error) {

	result, err := dbSession.ReadTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		result, err := tx.Run(`
	MATCH (u:User)-[:HAS]->(s:Session)
	
	WHERE 
		id(u) = $UserID 		AND
		id(s) = $SessionID

	WITH 
		properties(s)   AS session,
		id(s)           AS sessionID,
		properties(u)   AS user,
		id(u)           AS userID
	
	RETURN {
		Session: 		session{.*, ID: sessionID},
		User:			user{.*, ID: userID}
	}
	`,
			map[string]interface{}{
				"UserID":    userID,
				"SessionID": sessionID,
			},
		)

		if err != nil {
			return nil, err
		}

		if !result.Next() {
			return nil, result.Err()
		}

		return result.Record().Values[0], nil
	})

	if err != nil {
		return auth.User{}, auth.Session{}, err
	}

	unmarshal := struct {
		User    auth.User
		Session auth.Session
	}{}

	err = mapstructure.Decode(result, &unmarshal)
	if err != nil {
		return auth.User{}, auth.Session{}, err
	}

	user := unmarshal.User
	session := unmarshal.Session

	return user, session, nil
}
