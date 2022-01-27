package neo

import (
	"github.com/ferdzzzzzzzz/ferdzz/business/auth"
	"github.com/mitchellh/mapstructure"
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

// "$2a$10$dX60rB9TrBstQ7hCQVKLYOsZ0LJrqga9Q4oRfGAlpvl.HT.P0yfHq"
// "D2HwuRiCqXWlT8_qdonIrCxqka8RjnY5RZIi2GJLfTY="
