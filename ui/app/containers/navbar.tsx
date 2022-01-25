import {Link} from 'remix'

export function Navbar() {
  return (
    <div className="shadow-md text-gray-800 fixed w-full bg-white">
      <div className="flex justify-between items-center h-12 container max-w-5xl mx-auto">
        <Link to="/" className="font-black cursor-pointer">
          ferdzz.com
        </Link>

        <div>
          <ul className="flex space-x-10 font-bold">
            <li>
              <Link
                to="/canvas"
                className="hover:text-yellow-500 transition-colors duration-100"
              >
                canvas
              </Link>
            </li>
            <li>
              <Link
                to="/editor"
                className="hover:text-purple-600 transition-colors duration-100"
              >
                editor
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-emerald-500 transition-colors duration-100"
              >
                about
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="hover:text-rose-600 transition-colors duration-100"
              >
                blog
              </Link>
            </li>
            <li>
              <Link
                to="/signin"
                className="transition-colors duration-100 border rounded px-4 py-2 text-gray-800 border-gray-800 hover:border-blue-500 hover:text-blue-500"
              >
                sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
