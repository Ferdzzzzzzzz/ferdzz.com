import React from 'react'
import {Tldraw} from '~/components/canvasCopy'

export default function Index() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full">
      <Tldraw showPages={false} showSponsorLink={false} />
    </div>
  )
}
