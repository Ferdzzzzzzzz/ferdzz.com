import React, {PropsWithChildren, useContext} from 'react'

type Authenticated = {
  isAuthenticated: true
  email: string
}

type NotAuthenticated = {
  isAuthenticated: false
}

export type User = Authenticated | NotAuthenticated

const AuthContext = React.createContext<User | undefined>(undefined)

export function AuthProvider({
  children,
  user,
}: PropsWithChildren<{user: User}>) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export function useAuth() {
  let context = useContext(AuthContext)

  if (!context) {
    throw Error('useAuth can only be used in a child of AuthProvider')
  }

  return context
}
