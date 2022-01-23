import {PropsWithChildren} from 'react'

export function DefaultLayout({children}: PropsWithChildren<{}>) {
  return <div className="pt-20">{children}</div>
}
