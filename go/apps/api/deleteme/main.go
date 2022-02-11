package main

import (
	"fmt"
	"net/http"
	"time"
)

func main() {
	runCount := 100
	timeCount := time.Duration(0)

	timeChan := make(chan time.Duration)

	for i := 1; i <= runCount; i++ {
		go func(timeChan chan time.Duration, i int) {

			start := time.Now()

			// _, err := http.Get("http://revise.revise.workers.dev")
			_, err := http.Get("http://ferdzz.fly.dev")
			panicIfErr(err)

			diff := time.Since(start)
			timeChan <- diff
			fmt.Println(diff)
			fmt.Println(i)

		}(timeChan, i)
	}

	for i := 1; i <= runCount; i++ {
		timeCount += <-timeChan
	}

	fmt.Printf("average: %s", timeCount/time.Duration(runCount))

}

func panicIfErr(err error) {
	if err != nil {
		panic(err.Error())
	}
}
