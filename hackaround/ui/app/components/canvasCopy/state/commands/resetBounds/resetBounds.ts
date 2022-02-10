import type {TldrawCommand} from '~/components/canvasCopy/types'
import {TLDR} from '~/components/canvasCopy/state/TLDR'
import type {TldrawApp} from '../../internal'

export function resetBounds(
  app: TldrawApp,
  ids: string[],
  pageId: string,
): TldrawCommand {
  const {currentPageId} = app

  const {before, after} = TLDR.mutateShapes(
    app.state,
    ids,
    shape => app.getShapeUtil(shape).onDoubleClickBoundsHandle?.(shape),
    pageId,
  )

  return {
    id: 'reset_bounds',
    before: {
      document: {
        pages: {
          [currentPageId]: {shapes: before},
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: ids,
          },
        },
      },
    },
    after: {
      document: {
        pages: {
          [currentPageId]: {shapes: after},
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: ids,
          },
        },
      },
    },
  }
}
