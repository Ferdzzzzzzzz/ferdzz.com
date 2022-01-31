import {
  json,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix'
import type {MetaFunction} from 'remix'
import styles from './tailwind.css'
import {Navbar} from './containers/Navbar'
import {Toaster} from 'react-hot-toast'
import {AuthProvider, User} from './containers/Auth'
import {parseRequestCookies} from './core/parseCookieHeader'

export const meta: MetaFunction = () => {
  return {title: 'ferdzz.com'}
}

export function links() {
  return [{rel: 'stylesheet', href: styles}]
}

type LoaderData = {
  user: User
}

export const loader: LoaderFunction = async ({request}) => {
  let cookies = parseRequestCookies(request)
  let rememberToken = cookies.get('remember_token')

  if (!rememberToken) {
    let returnVal: LoaderData = {
      user: {isAuthenticated: false},
    }

    return json(returnVal)
  }

  // fetch some user context from api

  let returnVal: LoaderData = {
    user: {isAuthenticated: true},
  }

  return json(returnVal)
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="selection:bg-yellow-400">
        <Toaster />
        <AuthProvider user={}>
          <Navbar />
          <Outlet />
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
