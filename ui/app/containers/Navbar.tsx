import {
  Cross1Icon,
  HamburgerMenuIcon,
  HomeIcon,
  InfoCircledIcon,
  StackIcon,
} from '@radix-ui/react-icons'
import {PropsWithChildren} from 'react'
import {Link, NavLink} from 'remix'
import * as Dialog from '@radix-ui/react-dialog'
import {keyframes} from '@stitches/react'
import {css, styled} from '~/utils/stitches.config'
import {blackA, blue, pink} from '@radix-ui/colors'
import {SrOnly} from '~/components/SrOnly'

const TitleStyle = styled(Link, {
  fontWeight: 600,
})

function Title() {
  return <TitleStyle to={'/'}>ferdzz.com</TitleStyle>
}

const overlayShow = keyframes({
  '0%': {opacity: 0},
  '100%': {opacity: 1},
})

const contentShow = keyframes({
  '0%': {opacity: 0, transform: 'translate(-50%, -48%) scale(.96)'},
  '100%': {opacity: 1, transform: 'translate(-50%, -50%) scale(1)'},
})

const StyledOverlay = styled(Dialog.Overlay, {
  backgroundColor: blackA.blackA9,
  display: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
})

const DialogContent = styled(Dialog.Content, {
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '2%',
  left: '50%',
  transform: 'translate(-50%, 0%)',
  width: '95vw',
  maxWidth: '450px',
  height: '80vh',
  maxHeight: '85vh',
  padding: 25,
  // '@media (prefers-reduced-motion: no-preference)': {
  //   animation: `${contentShow} 300ms cubic-bezier(0.16, 1, 0.3, 1)`,
  // },
  '&:focus': {outline: 'none'},
})

const MobileNavBarLayout = styled('div', {
  height: '10vh',
  borderBottomWidth: '1px',
  justifyContent: 'space-between',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  alignItems: 'center',
  display: 'flex',
  '@sm': {
    display: 'none',
  },
})

const DialogTrigger = styled(HamburgerMenuIcon, {
  height: '1.25rem',
  width: '1.25rem',
})

const DialogHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export function MobileNavBar() {
  return (
    <MobileNavBarLayout>
      <Title />
      <Dialog.Root>
        <Dialog.Trigger>
          <DialogTrigger />
        </Dialog.Trigger>
        <Dialog.Portal>
          <StyledOverlay />

          <DialogContent>
            <DialogHeader>
              <Title />
              <Dialog.Close>
                <Cross1Icon />
              </Dialog.Close>
            </DialogHeader>

            <div>Some Links</div>

            <SrOnly>
              <Dialog.Title>navbar</Dialog.Title>
            </SrOnly>

            <SrOnly>
              <Dialog.Description>
                Navigate to different pages on the website.
              </Dialog.Description>
            </SrOnly>
          </DialogContent>
        </Dialog.Portal>
      </Dialog.Root>
    </MobileNavBarLayout>
  )
}

const link = css({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '2rem',
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
})

const activeLink = css({
  marginLeft: '2rem',
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  color: blue.blue10,
})

const NavBarLink = function NavBarLink({
  children,
  to,
}: PropsWithChildren<{to: string}>) {
  return (
    <NavLink
      to={to}
      className={({isActive}) => (isActive ? activeLink() : link())}
    >
      {children}
    </NavLink>
  )
}

const DesktopNavLinksLayout = styled('div', {
  display: 'none',
  '@lg': {
    display: 'flex',
  },
})

function DesktopNavLinks() {
  return (
    <DesktopNavLinksLayout>
      <NavBarLink to="">
        <HomeIcon />
        <div>home</div>
      </NavBarLink>
      <NavBarLink to="about">
        <InfoCircledIcon />
        <div>about</div>
      </NavBarLink>
      <NavBarLink to="blog">
        <StackIcon />
        <div>blog</div>
      </NavBarLink>
    </DesktopNavLinksLayout>
  )
}

const TabletNavBarLayout = styled('div', {
  height: '5vh',
  display: 'none',
  borderBottomWidth: '1px',
  paddingLeft: '2.5rem',
  paddingRight: '2.5rem',
  '@sm': {
    display: 'block',
  },
})

const TabletNavBarContent = styled('div', {
  maxWidth: '56rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const TabletNavMenu = styled(HamburgerMenuIcon, {
  '@lg': {
    display: 'none',
  },
})

export function TabletNavBar() {
  return (
    <TabletNavBarLayout>
      <TabletNavBarContent>
        <Title />
        <DesktopNavLinks />
        <TabletNavMenu />
      </TabletNavBarContent>
    </TabletNavBarLayout>
  )
}
