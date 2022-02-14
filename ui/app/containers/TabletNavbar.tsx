import {
  HamburgerMenuIcon,
  HomeIcon,
  InfoCircledIcon,
  StackIcon,
} from '@radix-ui/react-icons'
import {PropsWithChildren} from 'react'
import {Link, NavLink} from 'remix'
import {css, styled} from '~/utils/stitches.config'
import {blue} from '@radix-ui/colors'

const TitleStyle = styled(Link, {
  fontWeight: 600,
})

function Title() {
  return <TitleStyle to={'/'}>ferdzz.com</TitleStyle>
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
