import React, {PropsWithChildren} from 'react'

const NotImplementedBtn = ({children}: PropsWithChildren<{}>) => {
  return (
    <div>
      <button className="w-40 py-2 border rounded bg-gray-100 text-gray-800 border-gray-800">
        {children}
      </button>
    </div>
  )
}

const SignInWithEmailButton = ({children}: PropsWithChildren<{}>) => {
  return (
    <div>
      <button className="w-40 py-2 border rounded bg-gray-100 text-gray-800 border-gray-800">
        {children}
      </button>
    </div>
  )
}

export default function SignIn() {
  return (
    <div>
      <div className="max-w-md shadow bg-white mx-auto my-auto">
        <div className="flex justify-center py-10">
          <div className="space-y-10">
            <p>Sign In</p>
            <SignInWithEmailButton>Email</SignInWithEmailButton>
            <NotImplementedBtn>Whatsapp</NotImplementedBtn>
            <NotImplementedBtn>Message</NotImplementedBtn>
          </div>
        </div>
      </div>
    </div>
  )
}
