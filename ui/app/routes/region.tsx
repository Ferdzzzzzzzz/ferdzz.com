import {json, LoaderFunction} from 'remix'

export const loader: LoaderFunction = () => {
  return json(`region: ${process.env.FLY_REGION}`)
}
