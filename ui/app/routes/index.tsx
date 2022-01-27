import {LoaderFunction} from 'remix'
import {DefaultLayout} from '~/components/DefaultLayout'

export const loader: LoaderFunction = async ({request}) => {
  console.log('========================')
  const cookieHeader = request.headers.get('Cookie')

  console.log(cookieHeader)
  console.log('========================')
  return null
}

export default function Index() {
  return (
    <DefaultLayout>
      <div className="selection:bg-yellow-400">
        <h1>Welcome to Remix</h1>
      </div>
    </DefaultLayout>
  )
}
