import * as Y from 'yjs'
import {IndexeddbPersistence} from 'y-indexeddb'
import {useEffect, useState} from 'react'

export function useYDoc() {
  let [state, setState] = useState<undefined | Y.Doc>(undefined)

  useEffect(() => {
    const ydoc = new Y.Doc()
    new IndexeddbPersistence('example-document', ydoc)

    setState(ydoc)

    return () => {}
  }, [])

  return state
}
