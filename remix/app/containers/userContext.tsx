import React, {PropsWithChildren, useContext} from 'react'

type User = {
  name: string
  email: string
  authStatus: boolean
}

let UserContext = React.createContext<undefined | User>(undefined)

export function UserProvider({
  children,
  user,
}: PropsWithChildren<{user: User}>) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser() {
  let context = useContext(UserContext)
  if (!context) {
    throw Error('useUser can only be called in a child of the UserProvider')
  }

  return context
}
