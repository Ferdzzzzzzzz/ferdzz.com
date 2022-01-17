import {Link, LoaderFunction, NavLink} from 'remix'

export const loader: LoaderFunction = async ({request}) => {
  console.log(request.headers)
  return {}
}

export default function Index() {
  return <p>Heyo</p>
}
