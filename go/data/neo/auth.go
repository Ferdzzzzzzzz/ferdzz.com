package neo

import (
	"errors"

	"github.com/ferdzzzzzzzz/ferdzz/business/auth"
	"github.com/mitchellh/mapstructure"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
)

func UnmarshalAuthSession(queryResult interface{}) (auth.Session, error) {
	unmarshal := struct {
		Id    int64
		Props struct {
			Start               int64
			Exp                 int64
			HashedRememberToken string
			Activated           bool
		}
	}{}

	err := mapstructure.Decode(queryResult, &unmarshal)
	if err != nil {
		return auth.Session{}, err
	}

	return auth.Session{
		ID:                  unmarshal.Id,
		Start:               unmarshal.Props.Start,
		Exp:                 unmarshal.Props.Exp,
		HashedRememberToken: unmarshal.Props.HashedRememberToken,
		Activated:           unmarshal.Props.Activated,
	}, nil
}

func UnmarshalIDSlice(queryResult interface{}) ([]int64, error) {
	unmarshal := struct {
		IDs []int64
	}{}

	err := mapstructure.Decode(struct{ IDs interface{} }{IDs: queryResult}, &unmarshal)
	if err != nil {
		return nil, err
	}

	return unmarshal.IDs, nil
}

func MergeUserAndSession(
	dbSession neo4j.Session,
	email string,
	userSession auth.Session,
) ([]int64, error) {

	result, err := dbSession.WriteTransaction(func(tx neo4j.Transaction) (interface{}, error) {
		result, err := tx.Run(`
	MERGE (u:User {Email: $Email})

	CREATE (s:Session)
	SET s.HashedRememberToken 	= $Token
	SET s.Start 				= $Start
	SET s.Exp 					= $Exp
	SET s.Activated 			= false

	CREATE (u)-[:HAS]->(s)
	RETURN id(u), id(s)
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

		return result.Record().Values, nil

	})

	if err != nil {
		return nil, err
	}

	IDs, err := UnmarshalIDSlice(result)
	if err != nil || len(IDs) < 2 {
		return nil, errors.New("invalid read from DB")
	}

	return IDs, nil
}

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
	
	RETURN s
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

	userSession, err := UnmarshalAuthSession(result)
	if err != nil {
		return auth.Session{}, errors.New("error reading from the database")
	}

	return userSession, nil
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
	
	RETURN {
		sessionID: id(s),
		session: properties(s),
		userID: id(u),
		user: properties(u)
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
		UserID    int64
		User      auth.User
		SessionID int64
		Session   auth.Session
	}{}

	err = mapstructure.Decode(result, &unmarshal)
	if err != nil {
		return auth.User{}, auth.Session{}, err
	}

	user := unmarshal.User
	user.ID = unmarshal.UserID

	session := unmarshal.Session
	session.ID = unmarshal.SessionID

	return user, session, nil
}
