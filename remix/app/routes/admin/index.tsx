import {LoaderFunction, redirect, useLoaderData} from 'remix'

export const loader: LoaderFunction = async () => {
  let res = await fetch('http://localhost:3000/user/123')
  let data = await res.json()

  console.log('in here')
  if (true) {
    return redirect('/signin')
  }

  return data
}

export default function Admin() {
  let data = useLoaderData()
  return (
    <div className="w-40 h-40 bg-sky-400">
      <h1>Admin Route</h1>
      <p>{data}</p>
    </div>
  )
}

export const ErrorBoundary = () => {
  return (
    <div className="p-20">
      <div className="bg-red-100 text-red-800 border border-red-800 w-40 p-4 rounded">
        Hey we caught an error for you!
      </div>
    </div>
  )
}
