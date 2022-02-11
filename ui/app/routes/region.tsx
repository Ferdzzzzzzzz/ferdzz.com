import {json, LoaderFunction} from 'remix'

export const loader: LoaderFunction = () => {
  return json(`region: ${process.env.USER_ID}`)
}
