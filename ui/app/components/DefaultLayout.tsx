import {PropsWithChildren} from 'react'
import {Navbar} from '~/containers/Navbar'

export function DefaultLayout({children}: PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col h-screen">
      <div className="h-[5%] bg-red-200">
        <Navbar />
      </div>
      <div className="h-[95%]">{children}</div>
    </div>
  )
}
