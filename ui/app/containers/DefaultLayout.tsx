import {PropsWithChildren} from 'react'
import {MobileNavBar, TabletNavBar} from './Navbar'

export function DefaultLayout({children}: PropsWithChildren<{}>) {
  return (
    <div className="h-screen">
      <div className="hidden sm:block h-[5%]">
        <TabletNavBar />
      </div>

      <div className="h-[90%]">{children}</div>
      <div className="h-[10%] border-t bg-slate-50 sm:hidden">
        <MobileNavBar />
      </div>
    </div>
  )
}
