import {PropsWithChildren} from 'react'
import {Link} from 'remix'
import {isDev} from '~/utils/isDev'

export function DevRoute({children}: PropsWithChildren<{}>) {
  if (isDev()) return <div>{children}</div>

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-4">
      <h1 className="text-center font-semibold text-2xl">
        page under construction
      </h1>
      <div className="mt-10">
        <div className="">
          <p>
            Hey, you got here a bit early, I'm still working on this page 🔨. In
            the mean time, check out one of these:
          </p>
          <div className="mt-4">
            <ul className="list-disc list-inside text-link text-blue-600 visited:text-purple-600">
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
