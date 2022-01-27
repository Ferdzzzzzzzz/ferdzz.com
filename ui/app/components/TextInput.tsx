import {useState} from 'react'

export function TextInput({
  required,
  name,
  label,
  placeholder,
  type,
  autoComplete,
}: {
  required?: boolean
  name: string
  type: string
  label?: string
  autoComplete?: string
  placeholder?: string
}) {
  let [blurred, setBlurred] = useState(false)

  let className =
    'block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 autofill:bg-yellow-200 ' +
    (blurred
      ? 'peer invalid:border-rose-600 invalid:text-rose-600 invalid:placeholder-rose-600 focus:invalid:border-rose-600 focus:invalid:outline-none'
      : '')

  return (
    <div>
      {label ? (
        <label className="block text-sm font-medium text-gray-700">
          {label + (required ? ' *' : '')}
        </label>
      ) : null}

      <div className="mt-1">
        <input
          type={type}
          required={required}
          name={name}
          autoComplete={autoComplete}
          onBlur={() => setBlurred(true)}
          className={className}
          placeholder={placeholder}
        />

        <p className="invisible peer-invalid:visible text-rose-500 text-xs mt-1">
          Please use a valid email
        </p>
      </div>
    </div>
  )
}
