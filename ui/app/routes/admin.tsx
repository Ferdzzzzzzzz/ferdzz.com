import {LoaderFunction, redirect} from 'remix'
import {isProd} from '~/utils/isDev'

export const loader: LoaderFunction = () => {
  if (isProd) {
    return redirect('/')
  }

  return null
}
