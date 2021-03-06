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
import styles from './tailwindPreflight.css'
import styles2 from './modulzStyles.css'
import {isDev} from '~/utils/isDev'
import {DefaultLayout} from './containers/DefaultLayout'

export function links() {
  return [
    {rel: 'stylesheet', href: styles},
    {rel: 'stylesheet', href: styles2},
  ]
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
        <DefaultLayout>
          <Outlet />
        </DefaultLayout>

        <ScrollRestoration />
        <Scripts />
        {isDev && <LiveReload />}
      </body>
    </html>
  )
}
