import {
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from 'remix'
import type {MetaFunction} from 'remix'
import styles from './tailwind.css'

export function links() {
  return [{rel: 'stylesheet', href: styles}]
}

export const meta: MetaFunction = () => {
  return {title: 'ferdzz.com'}
}

export const loader: LoaderFunction = ({request}) => {
  if (request.headers.get('X-Forwarded-Proto') == 'http') {
    let url = new URL(request.url)
    url.pathname
    return redirect('https://' + url.host + url.pathname)
  }

  return null
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
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
