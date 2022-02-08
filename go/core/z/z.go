package z

import (
	"encoding/json"
	"fmt"
	"io"
	"reflect"
)

func StrictJSONParse(src io.Reader, dest interface{}) error {
	var x map[string]interface{}

	decoder := json.NewDecoder(src)

	err := decoder.Decode(&x)
	if err != nil {
		return err
	}

	e := reflect.ValueOf(&dest).Elem()

	for i := 0; i < e.NumField(); i++ {
		fieldName := e.Type().Field(i).Name
		fieldType := e.Type().Field(i).Type

		field, ok := x[fieldName]
		if !ok {
			return fmt.Errorf("missing key '%s' on JSON object", fieldName)
		}

		wantType := reflect.TypeOf(field)

		if fieldType != wantType {
			return fmt.Errorf("invalid key '%s' on JSON object, expected type %s, but got %s", fieldName, fieldType, wantType)
		}

		e.Field(i).Set(reflect.ValueOf(field))
	}

	return nil
}
