import * as React from 'react'
import {
  ExitIcon,
  HamburgerMenuIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {useTldrawApp} from '~/components/canvasCopy/hooks'
import {PreferencesMenu} from '../PreferencesMenu'
import {
  DMItem,
  DMContent,
  DMDivider,
  DMSubMenu,
  DMTriggerIcon,
} from '~/components/canvasCopy/components/Primitives/DropdownMenu'
import {SmallIcon} from '~/components/canvasCopy/components/Primitives/SmallIcon'
import {useFileSystemHandlers} from '~/components/canvasCopy/hooks'
import {HeartIcon} from '~/components/canvasCopy/components/Primitives/icons/HeartIcon'
import {preventEvent} from '~/components/canvasCopy/components/preventEvent'
import {DiscordIcon} from '~/components/canvasCopy/components/Primitives/icons'
import {TDExportTypes, TDSnapshot} from '~/components/canvasCopy/types'
import {Divider} from '~/components/canvasCopy/components/Primitives/Divider'

interface MenuProps {
  showSponsorLink: boolean
  readOnly: boolean
}

const numberOfSelectedIdsSelector = (s: TDSnapshot) => {
  return s.document.pageStates[s.appState.currentPageId].selectedIds.length
}

const disableAssetsSelector = (s: TDSnapshot) => {
  return s.appState.disableAssets
}

export const Menu = React.memo(function Menu({
  showSponsorLink,
  readOnly,
}: MenuProps) {
  const app = useTldrawApp()

  const numberOfSelectedIds = app.useStore(numberOfSelectedIdsSelector)

  const disableAssets = app.useStore(disableAssetsSelector)

  const [_, setForce] = React.useState(0)

  React.useEffect(() => setForce(1), [])

  const {onNewProject, onOpenProject, onSaveProject, onSaveProjectAs} =
    useFileSystemHandlers()

  const handleExportPNG = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.PNG)
  }, [app])

  const handleExportJPG = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.JPG)
  }, [app])

  const handleExportWEBP = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.WEBP)
  }, [app])

  const handleExportPDF = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.PDF)
  }, [app])

  const handleExportSVG = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.SVG)
  }, [app])

  const handleExportJSON = React.useCallback(async () => {
    await app.exportAllShapesAs(TDExportTypes.JSON)
  }, [app])

  const handleSignIn = React.useCallback(() => {
    app.callbacks.onSignIn?.(app)
  }, [app])

  const handleSignOut = React.useCallback(() => {
    app.callbacks.onSignOut?.(app)
  }, [app])

  const handleCut = React.useCallback(() => {
    app.cut()
  }, [app])

  const handleCopy = React.useCallback(() => {
    app.copy()
  }, [app])

  const handlePaste = React.useCallback(() => {
    app.paste()
  }, [app])

  const handleCopySvg = React.useCallback(() => {
    app.copySvg()
  }, [app])

  const handleCopyJson = React.useCallback(() => {
    app.copyJson()
  }, [app])

  const handleSelectAll = React.useCallback(() => {
    app.selectAll()
  }, [app])

  const handleSelectNone = React.useCallback(() => {
    app.selectNone()
  }, [app])

  const handleUploadMedia = React.useCallback(() => {
    app.openAsset()
  }, [app])

  const showFileMenu =
    app.callbacks.onNewProject ||
    app.callbacks.onOpenProject ||
    app.callbacks.onSaveProject ||
    app.callbacks.onSaveProjectAs ||
    app.callbacks.onExport

  const showSignInOutMenu =
    app.callbacks.onSignIn || app.callbacks.onSignOut || showSponsorLink

  const hasSelection = numberOfSelectedIds > 0

  return (
    <DropdownMenu.Root dir="ltr">
      <DMTriggerIcon isSponsor={showSponsorLink}>
        <HamburgerMenuIcon />
      </DMTriggerIcon>
      <DMContent variant="menu">
        Ferdzz
        {showFileMenu && (
          <DMSubMenu label="File...">
            {app.callbacks.onNewProject && (
              <DMItem onClick={onNewProject} kbd="#N">
                New Project
              </DMItem>
            )}
            {app.callbacks.onOpenProject && (
              <DMItem onClick={onOpenProject} kbd="#O">
                Open...
              </DMItem>
            )}
            {app.callbacks.onSaveProject && (
              <DMItem onClick={onSaveProject} kbd="#S">
                Save
              </DMItem>
            )}
            {app.callbacks.onSaveProjectAs && (
              <DMItem onClick={onSaveProjectAs} kbd="#⇧S">
                Save As...
              </DMItem>
            )}
            {app.callbacks.onExport && (
              <>
                <Divider />
                <DMSubMenu label="Export" size="small">
                  <DMItem onClick={handleExportPNG}>PNG</DMItem>
                  <DMItem onClick={handleExportJPG}>JPG</DMItem>
                  <DMItem onClick={handleExportWEBP}>WEBP</DMItem>
                  <DMItem onClick={handleExportSVG}>SVG</DMItem>
                  <DMItem onClick={handleExportJSON}>JSON</DMItem>
                </DMSubMenu>
              </>
            )}
            {!disableAssets && (
              <>
                <Divider />
                <DMItem onClick={handleUploadMedia} kbd="#U">
                  Upload Media
                </DMItem>
              </>
            )}
          </DMSubMenu>
        )}
      </DMContent>
    </DropdownMenu.Root>
  )
})
