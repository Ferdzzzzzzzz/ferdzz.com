import ReactDOMServer, {renderToString} from 'react-dom/server'
import type {EntryContext} from 'remix'
import {getCssText} from './utils/stitches.config'
import * as Remix from 'remix'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = ReactDOMServer.renderToString(
    <Remix.RemixServer context={remixContext} url={request.url} />,
  ).replace(/<\/head>/, `<style id="stitches">${getCssText()}</style></head>`)

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
