import {Link, NavLink} from 'remix'
import {css, styled} from '~/utils/stitches.config'
import {slateDark} from '@radix-ui/colors'
import React from 'react'

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
  color: slateDark.slate11,
  '&:hover': {
    borderBottomWidth: 1,
    borderColor: slateDark.slate11,
  },
  variants: {
    isActive: {
      true: {
        color: slateDark.slate8,
      },
    },
  },
})

const Nav = React.forwardRef<
  React.ElementRef<typeof NavLink>,
  React.ComponentProps<typeof NavLink>
>(({children, ...props}, forwardedRef) => (
  <NavLink
    {...props}
    className={({isActive}) => link({isActive})}
    end
    ref={forwardedRef}
  >
    {children}
  </NavLink>
))

const DesktopNavLinksLayout = styled('div', {
  display: 'none',
  '@sm': {
    display: 'flex',
  },
})

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

function DesktopNavLinks() {
  return (
    <DesktopNavLinksLayout>
      <Nav to="">home</Nav>
      <Nav to="about">about</Nav>
      <Nav to="blog">blog</Nav>
    </DesktopNavLinksLayout>
  )
}

export function TabletNavBar() {
  return (
    <TabletNavBarLayout>
      <TabletNavBarContent>
        <Title />
        <DesktopNavLinks />
      </TabletNavBarContent>
    </TabletNavBarLayout>
  )
}
