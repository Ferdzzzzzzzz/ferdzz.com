//go:build mage

package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"

	"github.com/magefile/mage/sh"
)

// Runs go mod download and then installs the binary.
func Build() error {
	if err := sh.Run("go", "mod", "download"); err != nil {
		return err
	}
	return sh.Run("go", "install", "./...")
}

// Deploys our application to fly.io
func Deploy(semver string) error {

	v := validator.New()

	x := struct {
		Semver string `validate:"semver"`
	}{
		Semver: semver,
	}

	err := v.Struct(x)

	if err != nil {
		return err
	}

	fmt.Printf("deploying %s\n", semver)

	const buildArg = "--build-arg"

	// git rev parse
	commitSha, err := sh.Output("git", "rev-parse", "--short", "HEAD")
	if err != nil {
		return err
	}

	now := time.Now()

	commitShaArg := fmt.Sprintf("VCS_REF=%s", commitSha)
	semVerArg := fmt.Sprintf("SEMVER=%s", semver)

	utcDate := now.UTC().Format("2006-Jan-01/15:04:05/MST")
	saDate := now.Local().Format("2006-Jan-01/15:04:05/MST")

	buildDateUtcArg := fmt.Sprintf("BUILD_DATE_UTC=%s", utcDate)
	buildDateSaArg := fmt.Sprintf("BUILD_DATE_SA=%s", saDate)

	err = sh.RunV("fly", "deploy", buildArg, commitShaArg, buildArg, semVerArg, buildArg, buildDateUtcArg, buildArg, buildDateSaArg)
	if err != nil {
		fmt.Println(err)
	}

	deployed := struct {
		Build        string
		BuildDateSA  string
		BuildDateUTC string
		Version      string
	}{
		Build:        commitSha,
		BuildDateSA:  saDate,
		BuildDateUTC: utcDate,
		Version:      semver,
	}

	jsonDeployed, _ := json.MarshalIndent(deployed, "", " ")

	fmt.Println("========================================")
	fmt.Println("deploy success:")
	fmt.Print(jsonDeployed)
	fmt.Println()
	fmt.Println("========================================")

	return nil
}

// Just playing with date formatting
func Date() {
	now := time.Now()
	buildDateUtcArg := fmt.Sprintf("BUILD_DATE_UTC=%s", now.UTC().Format("2006-Jan-01/15:04:05/MST"))
	buildDateSaArg := fmt.Sprintf("BUILD_DATE_SA=%s", now.Local().Format("2006-Jan-01/15:04:05/MST"))
	fmt.Println(buildDateSaArg)
	fmt.Println(buildDateUtcArg)
}
