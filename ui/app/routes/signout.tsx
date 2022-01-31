import {LoaderFunction} from 'remix'
import {parseRequestCookies} from '~/core/parseCookieHeader'
import {forwardRespCookiesToRedirect} from '~/utils/forward-cookie'

export const loader: LoaderFunction = async ({request}) => {
  let cookies = parseRequestCookies(request)
  let authToken = cookies.get('auth_token')

  let serverRequest = new Request(`http://localhost:3000/signout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: `auth_token=${authToken}`,
    },
  })

  let resp = await fetch(serverRequest)

  if (!resp.ok) {
    throw Error('error signing out')
  }

  return forwardRespCookiesToRedirect(resp, '/')
}
