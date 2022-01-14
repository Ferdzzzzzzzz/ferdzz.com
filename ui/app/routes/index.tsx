import {Link, LoaderFunction, useFetcher} from 'remix'

export const loader: LoaderFunction = async ({request}) => {
  console.log(request.headers)
  return {}
}

export default function Index() {
  let fetcher = useFetcher()

  return (
    <div>
      <div className="flex justify-between align-middle px-4 py-4 border-b">
        <h1 className="font-black text-4xl">Ferdzz</h1>
        <div className="flex flex-col justify-center">
          <div className="flex space-x-4">
            <Link
              to={'admin'}
              className="bg-sky-100 border text-sky-800 border-sky-800 rounded px-4 py-2 hover:shadow-lg"
            >
              Admin
            </Link>
            <button
              className="bg-sky-100 border text-sky-800 border-sky-800 rounded px-4 py-2 hover:shadow-lg"
              onClick={async () => {
                let x = await fetch('http://localhost:5001', {mode: 'no-cors'})

                console.log(x.body)
              }}
            >
              Random Button
            </button>
          </div>
        </div>
      </div>
      <p>Heyo</p>
    </div>
  )
}
