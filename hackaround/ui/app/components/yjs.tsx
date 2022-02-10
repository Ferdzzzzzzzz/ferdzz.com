import React, {useEffect} from 'react'
import * as Y from 'yjs'
import {HocuspocusProvider} from '@hocuspocus/provider'
import {ErrorBoundaryComponent} from 'remix'

type User = {
  color: string
  point: number[]
}

let YjsContext = React.createContext<
  | undefined
  | {
      ydoc: Y.Doc
      users: User[]
    }
>(undefined)

export function useCollab() {
  let context = React.useContext(YjsContext)
  if (!context) {
    throw Error(
      'useYjs hook can only be used as a child of the <YjsProvider/> component',
    )
  }

  return context
}

export function YjsProvider({children}: React.PropsWithChildren<{}>) {
  let ydoc = new Y.Doc()

  let [users, setUsers] = React.useState<User[]>([])

  useEffect(() => {
    let provider = new HocuspocusProvider({
      url: 'ws://127.0.0.1:1234',
      name: 'example-document',
      document: ydoc,
    })

    document.addEventListener('mousemove', event => {
      provider.setAwarenessField('user', {
        name: 'Kevin Jahns',
        color: '#ffcc00',
        mouseX: event.clientX,
        mouseY: event.clientY,
      })
    })

    return () => {}
  }, [])

  return (
    <div>
      <YjsContext.Provider value={{ydoc, users}}>
        {children}
      </YjsContext.Provider>
    </div>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
  return <div>{error}</div>
}
