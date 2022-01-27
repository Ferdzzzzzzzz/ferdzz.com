import {DefaultLayout} from '~/components/DefaultLayout'

export default function Index() {
  return (
    <DefaultLayout>
      <div className="selection:bg-yellow-400">
        <h1>Welcome to Remix</h1>
      </div>
    </DefaultLayout>
  )
}
