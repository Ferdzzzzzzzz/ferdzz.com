import {
  HamburgerMenuIcon,
  HomeIcon,
  LayersIcon,
  StackIcon,
} from '@radix-ui/react-icons'
import {PropsWithChildren} from 'react'
import {Link, NavLink} from 'remix'

export function MobileNavBar() {
  return (
    <div className="flex justify-between px-10 items-center h-full text-slate-400">
      <NavLink
        to="/"
        className={({isActive}) => (isActive ? 'text-slate-700' : '')}
      >
        <HomeIcon className="h-5 w-5" />
      </NavLink>
      <NavLink
        to="/blog"
        className={({isActive}) => (isActive ? 'text-slate-700' : '')}
      >
        <LayersIcon className="h-5 w-5" />
      </NavLink>
      <HamburgerMenuIcon className="h-5 w-5" />
    </div>
  )
}

function NavBarLink({children, to}: PropsWithChildren<{to: string}>) {
  return (
    <div className="text-slate-500">
      <NavLink
        to={to}
        className={({isActive}) =>
          'flex items-center space-x-2 text-sm ' +
          (isActive ? 'text-slate-800' : '')
        }
      >
        {children}
      </NavLink>
    </div>
  )
}

export function TabletNavBar() {
  return (
    <div className="h-full bg-slate-50 border-b px-10">
      <div className="max-w-4xl mx-auto h-full flex items-center justify-between">
        <Link className="text-slate-700 font-semibold" to={'/'}>
          ferdzz.com
        </Link>

        {
          //Desktop NavLinks
        }
        <div className="space-x-8  hidden lg:flex">
          <NavBarLink to="">
            <HomeIcon />
            <div>home</div>
          </NavBarLink>
          <NavBarLink to="blog">
            <StackIcon />
            <div>blog</div>
          </NavBarLink>
        </div>

        {
          //Tablet Hamburger
        }
        <div className="text-slate-600 lg:hidden">
          <HamburgerMenuIcon />
        </div>
      </div>
    </div>
  )
}
