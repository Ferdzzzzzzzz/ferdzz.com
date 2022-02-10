import {Hocuspocus, Server} from '@hocuspocus/server'
import * as Y from 'yjs'
let hocusServer: Hocuspocus | undefined

export async function handleRequest(request: Request) {
  if (!hocusServer) {
    console.log('creating YDoc instance')
    hocusServer = Server.configure({
      onConnect: async () => {
        console.log('user connected')
      },
    })
  }

  const upgradeHeader = request.headers.get('Upgrade')
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', {status: 426})
  }

  let url = new URL(request.url)
  let docName = url.pathname
  if (docName.split('/').length > 1) {
    console.log(url)
    return new Response('Bad Request: path must be url/[:documentName]', {
      status: 400,
    })
  }

  // let someText = ydoc.getText('fuck yes')

  const webSocketPair = new WebSocketPair()
  const client = webSocketPair[0]
  const server = webSocketPair[1]

  // @ts-ignore
  // hocusServer.handleConnection(server, request, docName)

  return new Response(null, {
    status: 101,
    webSocket: client,
  })
}

const worker: ExportedHandler<Bindings> = {fetch: handleRequest}

export default worker
