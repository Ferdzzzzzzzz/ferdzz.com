import {json, LoaderFunction} from 'remix'

export const loader: LoaderFunction = () => {
  return json({
    env: process.env.NODE_ENV,
  })
}
