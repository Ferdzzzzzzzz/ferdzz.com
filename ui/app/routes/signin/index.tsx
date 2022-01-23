import {ActionFunction, redirect} from 'remix'

export const action: ActionFunction = async () => {
  console.log('running this')
  return redirect('/')
}

export default function SignIn() {
  return (
    <div className="bg-slate-50 w-full h-screen">
      <div className="bg-white h-1/3 w-1/4 items-center shadow-lg border py-8 px-12 rounded-lg fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 container max-w-sm">
        <div className="text-center">
          <h1 className="text-xl font-bold">Sign In</h1>
          <h2 className="text-md font-normal text-gray-600">
            Choose a sign in method
          </h2>
        </div>
        <form className="mt-20">
          <fieldset className="space-y-10">
            <div>
              <input
                type="email"
                autoFocus
                placeholder="email"
                className="border rounded w-full p-2 outline-none focus:ring focus:ring-yellow-400"
              />
            </div>
            <div>
              <input
                type="password"
                autoFocus
                placeholder="password"
                minLength={6}
                className="border rounded w-full p-2 outline-none focus:ring focus:ring-yellow-400"
              />
            </div>
            <button className="bg-gray-200 text-gray-700 rounded font-bold w-full py-2 transition-colors duration-100 hover:border-blue-500 hover:text-blue-500">
              Continue
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}
