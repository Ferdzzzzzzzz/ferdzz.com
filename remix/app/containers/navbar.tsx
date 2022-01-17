import {PropsWithChildren} from 'react'
import {NavLink} from 'remix'

function NavbarButton({
  children,
  to,
}: PropsWithChildren<{
  to: string
}>) {
  return (
    <NavLink
      to={to}
      className={x => {
        let className = x.isActive ? 'text-yellow-500' : 'text-sky-800'

        return (
          className +
          ' bg-sky-100 border  border-sky-800 rounded px-4 py-2 hover:shadow-lg'
        )
      }}
    >
      {children}
    </NavLink>
  )
}

export function Navbar() {
  return (
    <div className="flex justify-between align-middle px-4 py-4 border-b">
      <NavLink to="/">
        <h1 className="font-black text-4xl">Ferdzz</h1>
      </NavLink>
      <div className="flex flex-col justify-center">
        <div className="flex space-x-4">
          <NavbarButton to="/">Home</NavbarButton>
          <NavbarButton to="/admin">Admin</NavbarButton>
        </div>
      </div>
    </div>
  )
}
