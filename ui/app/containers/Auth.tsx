import React, {PropsWithChildren, useContext} from 'react'
import {useMatches} from 'remix'
import * as z from 'zod'

type Authenticated = {
  IsAuthenticated: true
  ID: number
  Email: string
  AccountIsSetup: boolean
}

type NotAuthenticated = {
  IsAuthenticated: false
}

export const JsonToUser = z
  .object({
    ID: z.number(),
    Email: z.string(),
    AccountIsSetup: z.boolean(),
  })
  .transform(x => {
    let y: Authenticated = {...x, IsAuthenticated: true}
    return y
  })

export type User = Authenticated | NotAuthenticated

export function useUser() {
  let rootLoaderData = useMatches()[0].data as {user: User}

  if (!rootLoaderData) {
    throw Error(
      'useAuth can only be used as child of / [root] path...so this should work everwhere',
    )
  }

  return rootLoaderData.user
}
