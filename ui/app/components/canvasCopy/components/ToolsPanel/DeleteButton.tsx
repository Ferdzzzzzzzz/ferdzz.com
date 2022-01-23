import * as React from 'react'
import {Tooltip} from '~/components/canvasCopy/components/Primitives/Tooltip'
import {useTldrawApp} from '~/components/canvasCopy/hooks'
import {ToolButton} from '~/components/canvasCopy/components/Primitives/ToolButton'
import {TrashIcon} from '~/components/canvasCopy/components/Primitives/icons'

export function DeleteButton(): JSX.Element {
  const app = useTldrawApp()

  const handleDelete = React.useCallback(() => {
    app.delete()
  }, [app])

  const hasSelection = app.useStore(
    s =>
      s.appState.status === 'idle' &&
      s.document.pageStates[s.appState.currentPageId].selectedIds.length > 0,
  )

  return (
    <Tooltip label="Delete" kbd="⌫">
      <ToolButton
        variant="circle"
        disabled={!hasSelection}
        onSelect={handleDelete}
      >
        <TrashIcon />
      </ToolButton>
    </Tooltip>
  )
}
