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
import {JsonToUser, User} from './containers/Auth'
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

  let authToken = cookies.get('auth_token')

  let notAuthenticated = json<LoaderData>({
    user: {
      IsAuthenticated: false,
    },
  })

  if (!authToken) {
    return notAuthenticated
  }

  let resp = await fetch('http://localhost:3000/userContext', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: `auth_token=${authToken}`,
    },
  })

  if (resp.status === 401) {
    return notAuthenticated
  }

  if (!resp.ok) {
    throw Error('Could not authenticate')
  }

  let userJson = await resp.json()
  let userParse = JsonToUser.safeParse(userJson)

  if (!userParse.success) {
    console.log(userParse.error)
    throw Error('Failed to get user information')
  }

  return json<{
    user: User
  }>({user: userParse.data})
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
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
