package auth

/*
package auth

this package manages a couple of concerns around user authentication and
authorization.

It starts with a couple of general types, the following are core types for our
business logic:
	*	Session
	*	User
	*	MagicLink
	*	(auth)Token

Where Service is, of course, the main action driver for our logic. Methods on
service are:
	* 	NewToken
	* 	UnencryptAuthToken
	* 	GetMagicLink
	* 	UnencryptMagicLink

Other methods on package auth:
	*	ReadSecretsFromJson
	*	NewSession


================================================================================
The rest of this doc describes the internals of auth so as to get an
understanding of the requirements and make debugging easier.

To create an auth.Service, you should call the auth.NewService(...) method. This
method has two parameters:
	*	secretMap 	map[uint]string
		This is a map of uint->string secrets that should have been parsed from
		a JSON file using the `auth.ReadSecretsFromJson` method. The uint key
		should be thought of as a counter of secrets. The idea with the secret
		map is that we enable a smooth transition of secrets over time, without
		disrupting user sessions.

	* 	authURL		string
		The authURL is simply the baseURL used for generating magic sign-in
		links. In this case: "https://ferdzz.com"

Auth Flow
---------
* 	User clicks sign in button
* 	We create a remember token
* 	We hash said remember token
* 	If they have a user, we just create a session for them (with the
	rememberToken), otherwise we create the user and the session.
*	Then we generate a magic link containing an exp date, their userID and the
	sessionID. We the JSON stringify the struct and encrypt it with the latest
	secret (latest being determined by the size of the keyID).
*	Then we prepend the secret's key to the encrypted value as such:
		[key]$[encryptedValue]
*	Then we base64 URL-encode the string, attach it to the baseURL and email it
	off to the user
*	Finally we respond to the user with a remember_token cookie which we use to
	limit where the link can be used (incase it gets intercepted).


* 	Once the user clicks on the link, we validate that they have the
	remember_token cookie in their browser.
* 	We send that off to our server, where we base64 unencode the string
*	Get the secret's key
*	Unencrypt the link
* 	Ensure that the link isn't expired
*	Check that the link's userID and sessionID are valid
*	Deactivate any unactivated sessions
*	Activate the session
* 	Create an authToken
*	Set the authToken on the cookie
*	Respond to the user with noContent (or possibly userContext)

*/
