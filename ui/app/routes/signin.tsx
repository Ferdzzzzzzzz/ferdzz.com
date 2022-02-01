import {ArrowRightIcon, Half2Icon, InfoCircledIcon} from '@radix-ui/react-icons'
import {PropsWithChildren, ReactNode, useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import {
  ActionFunction,
  ErrorBoundaryComponent,
  Form,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from 'remix'
import {TextInput} from '~/components/TextInput'
import {parseRequestCookies} from '~/core/parseCookieHeader'
import {
  forwardRespCookiesToJSON,
  forwardRespCookiesToRedirect,
} from '~/utils/forward-cookie'

type LoaderData = {
  magicLink?: string | null
}

export const loader: LoaderFunction = async ({request}) => {
  let cookies = parseRequestCookies(request)

  let authToken = cookies.get('auth_token')
  if (authToken) {
    return redirect('/')
  }

  let rememberToken = cookies.get('remember_token')

  let url = new URL(request.url)
  let magicLink = url.searchParams.get('token')

  // =====================================================================
  // If we don't have the magic link, we just want to be on the sign in page

  if (!magicLink) {
    return json<LoaderData>({})
  }

  // If we have a sign in link but no remember_token cookie, we redirect

  if (!rememberToken) {
    return redirect('/signin')
  }

  // =====================================================================
  // If we have the sign in link and remember_token, we need to trade it
  // for an auth token

  let serverRequest = new Request(
    `http://localhost:3000/magicSignIn?token=${magicLink}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: `remember_token=${rememberToken}`,
      },
    },
  )

  let resp = await fetch(serverRequest)

  if (!resp.ok) {
    throw Error('auth failed')
  }

  console.log('2')
  return forwardRespCookiesToRedirect(resp, '/')
}

type ActionData = {
  serverError?: string
  signedIn?: boolean
}

export const action: ActionFunction = async ({request}) => {
  await new Promise(res => setTimeout(res, 1000))
  const formData = await request.formData()
  const email = formData.get('email')

  let serverResponse = await fetch('http://localhost:3000/magicsignin', {
    method: 'POST',
    body: JSON.stringify({email: email}),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (!serverResponse.ok) {
    return json<ActionData>({
      serverError: await serverResponse.json(),
    })
  }

  return forwardRespCookiesToJSON<ActionData>(serverResponse, {
    signedIn: true,
  })
}

function Info() {
  return (
    <div className="cursor-pointer">
      <InfoCircledIcon />
    </div>
  )
}

function SignInForm() {
  let [isValid, setIsValid] = useState(false)
  let transition = useTransition()

  return (
    <>
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
        method="post"
        replace
        onChange={e => {
          let isValid = e.currentTarget.checkValidity()
          setIsValid(isValid)
        }}
      >
        <fieldset
          className="space-y-5"
          disabled={transition.state === 'submitting'}
        >
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
            {transition.state === 'submitting' ? (
              <Half2Icon className="animate-spin transition duration-500" />
            ) : (
              <ArrowRightIcon />
            )}
          </button>
        </fieldset>
      </Form>
    </>
  )
}

function HasToken({magicLink}: {magicLink: string}) {
  return (
    <div className="overflow-clip">
      <p>{magicLink}</p>
    </div>
  )
}

function LinkSent() {
  return <div>You Sign In link has been emailed to you.</div>
}

function SignInWrapper({children}: PropsWithChildren<{}>) {
  return (
    <div className="bg-white w-full h-screen">
      <div className="bg-white container max-w-sm items-center shadow-lg border py-8 px-12 rounded-lg fixed top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  )
}

export default function SignIn() {
  let loaderData = useLoaderData<LoaderData>()
  let actionData = useActionData<ActionData>()

  useEffect(() => {
    if (actionData?.serverError) {
      toast.error(actionData.serverError)
    }
  }, [actionData])

  let component: ReactNode

  if (loaderData.magicLink) {
    component = <HasToken magicLink={loaderData.magicLink} />
  } else if (actionData?.signedIn) {
    component = <LinkSent />
  } else {
    component = <SignInForm />
  }

  return <SignInWrapper>{component}</SignInWrapper>
}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
  return <SignInWrapper>{error.message}</SignInWrapper>
}
