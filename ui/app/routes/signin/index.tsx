import {ArrowRightIcon, InfoCircledIcon} from '@radix-ui/react-icons'
import {useState} from 'react'
import {ActionFunction, Form, json, redirect} from 'remix'
import {TextInput} from '~/components/TextInput'

export const action: ActionFunction = async ({request}) => {
  await new Promise(res => setTimeout(res, 1000))
  const formData = await request.formData()
  const email = formData.get('email')
  console.log('==============================')
  console.log(email)

  return redirect('/')
}

function Info() {
  return (
    <div className="cursor-pointer">
      <InfoCircledIcon />
    </div>
  )
}

export default function SignIn() {
  let [isValid, setIsValid] = useState(false)

  return (
    <div className="bg-white w-full h-screen">
      <div className="bg-white container max-w-sm items-center shadow-lg border py-8 px-12 rounded-lg fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
        <div className="text-center">
          <div className="flex items-center space-x-2 justify-center">
            <h1 className="text-xl font-bold">Sign In</h1>
            <Info />
          </div>
          <h2 className="text-sm font-normal text-gray-600 mt-2">
            Give me your email to get the good stuff 🤙.{' '}
            <span className="underline decoration-sky-500 decoration-2">
              Zero
            </span>{' '}
            spam.{' '}
            <span className="underline decoration-rose-500 decoration-2">
              Zero
            </span>{' '}
            tracking. Delete{' '}
            <span className="underline decoration-yellow-400 decoration-2">
              ALL
            </span>{' '}
            personal information any time.
          </h2>
        </div>
        <Form
          className="mt-10"
          replace
          method="post"
          onChange={e => {
            let isValid = e.currentTarget.checkValidity()
            setIsValid(isValid)
          }}
        >
          <fieldset className="space-y-5">
            <div>
              <TextInput
                type="email"
                placeholder="email"
                name="email"
                autoComplete="email"
                required
              />
            </div>

            <button
              type="submit"
              className="disabled:bg-gray-200 disabled:border-none disabled:text-gray-700 rounded w-full py-2 transition-colors duration-500 border bg-gray-800 text-white flex items-center justify-center space-x-2"
              disabled={!isValid}
            >
              <p>Continue</p>
              <ArrowRightIcon />
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  )
}
