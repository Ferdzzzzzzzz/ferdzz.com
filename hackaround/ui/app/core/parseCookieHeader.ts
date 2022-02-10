function parseCookieHeader(header: string): Map<string, string> {
  let response = new Map<string, string>()

  if (header === '') {
    return response
  }

  let pairs = header.split(';')

  pairs = pairs.map(s => s.trim())

  let splittedPairs = pairs.map(cookie => {
    cookie.split('=')

    let splitIndex = cookie.indexOf('=')
    return [
      cookie.slice(0, splitIndex),
      cookie.slice(splitIndex + 1, cookie.length),
    ]
  })

  splittedPairs.map(cookie => {
    let [key, value] = cookie
    response.set(key, value)
  })

  return response
}

export function parseRequestCookies(req: Request): Map<string, string> {
  const cookieHeader = req.headers.get('Cookie')
  if (!cookieHeader) {
    return new Map<string, string>()
  }

  return parseCookieHeader(cookieHeader)
}
