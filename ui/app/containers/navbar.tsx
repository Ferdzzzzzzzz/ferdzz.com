import {ExitIcon} from '@radix-ui/react-icons'
import {Link, NavLink} from 'remix'
import {useUser} from './Auth'

export function Navbar() {
  let user = useUser()

  return (
    <div className="text-gray-800 h-full bg-white border-b flex items-center">
      <div className="flex justify-between items-center container max-w-5xl mx-auto">
        <Link to="/" className="font-semibold cursor-pointer">
          ferdzz.com
        </Link>

        <div>
          <ul className="flex space-x-10 font-normal items-center">
            <li>
              <NavLink
                to="/canvas"
                className="hover:text-yellow-500 transition-colors duration-100"
              >
                canvas
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/editor"
                className={({isActive}) =>
                  'hover:text-purple-600 transition-colors duration-100 ' +
                  (isActive ? 'text-purple-600' : '')
                }
              >
                editor
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({isActive}) =>
                  'hover:text-emerald-500 transition-colors duration-100 ' +
                  (isActive ? 'text-emerald-500' : '')
                }
              >
                about
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className={({isActive}) =>
                  'hover:text-rose-600 transition-colors duration-100 ' +
                  (isActive ? 'text-rose-600' : '')
                }
              >
                blog
              </NavLink>
            </li>

            <li>
              {user.IsAuthenticated ? (
                <NavLink
                  to="/signout"
                  className="transition-colors duration-100 border rounded px-4 py-2 text-gray-800 border-gray-800 hover:border-blue-500 hover:text-blue-500 flex items-center space-x-2"
                >
                  <p>sign out</p>
                  <ExitIcon />
                </NavLink>
              ) : (
                <NavLink
                  to="/signin"
                  className="transition-colors duration-100 border rounded px-4 py-2 text-gray-800 border-gray-800 hover:border-blue-500 hover:text-blue-500"
                >
                  sign in
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
