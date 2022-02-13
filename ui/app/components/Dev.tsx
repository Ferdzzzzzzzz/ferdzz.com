import {PropsWithChildren} from 'react'
import {Link} from 'remix'
import {isDev} from '~/utils/isDev'

export function DevRoute({children}: PropsWithChildren<{}>) {
  if (isDev()) return <div>{children}</div>

  return (
    <div>
      <h1>page under construction</h1>
      <div>
        <div>
          <p>
            Hey, you got here a bit early, I'm still working on this page 🔨. In
            the mean time, check out one of these:
          </p>
          <div>
            <ul>
              <li>
                <Link to="/">home</Link>
              </li>
              <li>
                <Link to="/blog">blog</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DevComponent({children}: PropsWithChildren<{}>) {
  if (isDev()) return <div>{children}</div>

  return null
}
