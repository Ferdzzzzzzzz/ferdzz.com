import * as ScrollAreaPrim from '@radix-ui/react-scroll-area'
import {PropsWithChildren} from 'react'

export const ScrollArea = ({
  children,
  className,
}: PropsWithChildren<{
  className?: string
}>) => (
  <ScrollAreaPrim.Root className={className ? className : ''}>
    <ScrollAreaPrim.Viewport className="bg-amber-100 w-full h-full border border-red-400 rounded shadow">
      {children}
    </ScrollAreaPrim.Viewport>
    <ScrollAreaPrim.Scrollbar
      orientation="vertical"
      className="w-1 bg-pink-200"
    >
      <ScrollAreaPrim.Thumb className="w-1 bg-sky-400 rounded" />
    </ScrollAreaPrim.Scrollbar>
  </ScrollAreaPrim.Root>
)
