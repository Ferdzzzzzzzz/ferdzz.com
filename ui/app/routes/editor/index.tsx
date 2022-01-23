import React, {useEffect} from 'react'
import {useCollab, YjsProvider} from '~/components/yjs'
import * as Y from 'yjs'
import {HocuspocusProvider} from '@hocuspocus/provider'

export function Thing() {
  let {ydoc} = useCollab()

  let ytext = React.useMemo(() => ydoc.getText('myval'), [])
  let [val, setVal] = React.useState(ytext.toString())

  useEffect(() => {
    ytext.observe(s => {
      setVal(ytext.toString())
    })
    return () =>
      ytext.unobserve(() => {
        console.log('stopped observing')
      })
  }, [])

  //     let randomPos = useCallback(() => {
  //     let x = Math.floor(Math.random() * 800) + 100
  //     let y = Math.floor(Math.random() * 800) + 100
  //     return [x, y]
  //   }, [])

  //   let [pos, setPos] = React.useState([500, 500])

  //   useEffect(() => {
  //     let id = setInterval(() => {
  //       setPos(randomPos())
  //     }, 100)

  //     return () => clearInterval(id)
  //   })

  return (
    <div>
      {/* <Cursor point={pos} /> */}
      <p>Heyo</p>
      <label>
        Collab Text
        <input
          type="text"
          className="border rounded"
          value={val}
          onChange={() => {}}
          onKeyPress={e => ytext.insert(val.length, e.key)}
        />
      </label>
      Editor
      {/* <button onClick={() => setPos(randomPos())}>Random Position</button> */}
    </div>
  )
}

export default function Index() {
  return (
    <YjsProvider>
      <div>
        <Thing />
        <Thing />
        Getting here
      </div>
    </YjsProvider>
  )
}
