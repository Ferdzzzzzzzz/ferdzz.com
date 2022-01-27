function parseCookieHeader(header: string): Map<string, string> {
  let response = new Map<string, string>()

  if (header === '') {
    return response
  }

  let pairs = header.split(';')
  let splittedPairs = pairs.map(cookie => cookie.split('='))

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
