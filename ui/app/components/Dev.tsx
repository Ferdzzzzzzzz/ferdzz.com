import {PropsWithChildren} from 'react'
import {isProd} from '~/utils/isDev'

export function Dev({children}: PropsWithChildren<{}>) {
  if (isProd) return <div />
  return <div>{children}</div>
}

export function Prod({children}: PropsWithChildren<{}>) {
  if (isProd) return <div>{children}</div>
  return <div />
}
