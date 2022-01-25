import React, {useEffect, useState} from 'react'
import {useCollab, YjsProvider} from '~/components/yjs'
import * as Y from 'yjs'
import {HocuspocusProvider} from '@hocuspocus/provider'
import {DefaultLayout} from '~/components/DefaultLayout'

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
  let [ws, setWs] = useState<undefined | WebSocket>(undefined)

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:4001')

    webSocket.addEventListener('message', event => {
      console.log('Message received from server')
      console.log(event.data)
    })

    webSocket.onopen = () => {
      setWs(webSocket)
    }

    return () => webSocket.close()
  }, [])

  if (!ws) {
    return <div>Loading...</div>
  }

  return (
    <YjsProvider>
      <DefaultLayout>
        <div>
          <div>
            <Thing />
            <Thing />
            Getting here
          </div>
          <button
            onClick={() => {
              ws?.send('42069')
            }}
          >
            Click to send message
          </button>
        </div>
      </DefaultLayout>
    </YjsProvider>
  )
}
