import {json, redirect} from 'remix'

export function forwardRespCookiesToJSON<Data>(
  source: Response,
  data: Data,
  init: ResponseInit = {},
): Response {
  let cookie = source.headers.get('set-cookie')

  if (!cookie) {
    throw Error('expected token cookie in headers')
  }

  return json<Data>(data, {
    ...init,
    headers: {
      ...init.headers,
      'set-cookie': cookie,
    },
  })
}

export function forwardRespCookiesToRedirect(
  source: Response,
  url: string,
  init: ResponseInit = {},
): Response {
  let cookie = source.headers.get('set-cookie')

  if (!cookie) {
    throw Error('expected token cookie in headers')
  }

  return redirect(url, {
    ...init,
    headers: {
      ...init.headers,
      'set-cookie': cookie,
    },
  })
}
