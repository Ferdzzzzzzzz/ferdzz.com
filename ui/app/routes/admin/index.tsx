import {LoaderFunction, redirect} from 'remix'

export const loader: LoaderFunction = async () => {
  return redirect('/signin')
}

export default function Admin() {
  return <div className="w-40 h-40 bg-sky-400">Admin Route</div>
}
