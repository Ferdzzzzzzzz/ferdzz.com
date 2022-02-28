import {json, LoaderFunction} from 'remix'

export const loader: LoaderFunction = () => {
  return json({
    env: process.env.NODE_ENV,
    rndm: 'THIS IS ANOTHERrrr A RANDOM STRING',
  })
}
