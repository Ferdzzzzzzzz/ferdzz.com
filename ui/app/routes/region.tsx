import {json, LoaderFunction} from 'remix'

export const loader: LoaderFunction = ({request}) => {
  return json(`region: ${process.env.FLY_REGION}`)
}
