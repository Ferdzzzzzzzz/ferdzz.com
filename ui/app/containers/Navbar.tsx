import {slate} from '@radix-ui/colors'
import {HamburgerMenuIcon} from '@radix-ui/react-icons'
import React, {PropsWithChildren} from 'react'
import {Link, NavLink} from 'remix'
import {
  AppBar,
  Button,
  Container,
  Flex,
  Heading,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '~/components'
import {css, styled} from '~/utils/stitches.config'

const activeLink = css({
  color: slate.slate11,
})

const Nav = React.forwardRef<
  React.ElementRef<typeof NavLink>,
  React.ComponentProps<typeof NavLink>
>(({children, ...props}, forwardedRef) => (
  <NavLink
    {...props}
    className={({isActive}) => (isActive ? activeLink() : '')}
    end
    ref={forwardedRef}
  >
    <Button ghost size="2" variant="blue">
      {children}
    </Button>
  </NavLink>
))

const SheetNav = React.forwardRef<
  React.ElementRef<typeof NavLink>,
  React.ComponentProps<typeof NavLink>
>(({children, ...props}, forwardedRef) => (
  <NavLink
    {...props}
    className={({isActive}) => (isActive ? activeLink() : '')}
    end
    ref={forwardedRef}
  >
    <Button size="2" variant="blue">
      {children}
    </Button>
  </NavLink>
))

const NavbarNavs = styled(Flex, {
  display: 'none',
  '@bp1': {
    display: 'flex',
  },
})

const MobileOnly = styled('div', {
  display: 'block',
  '@bp1': {
    display: 'none',
  },
})

function SheetNavs({children}: PropsWithChildren<{}>) {
  return (
    <MobileOnly>
      <Sheet>
        <SheetTrigger>
          <HamburgerMenuIcon />
        </SheetTrigger>
        <SheetContent>
          <Flex direction="column" gap="4">
            {children}
          </Flex>
        </SheetContent>
      </Sheet>
    </MobileOnly>
  )
}

export function Navbar() {
  return (
    <AppBar size="3" border glass sticky>
      <Container size="2">
        <Flex justify="between" align="center">
          <Link to="/">
            <Heading>ferdzz.com</Heading>
          </Link>
          <SheetNavs>
            <SheetNav to="">home</SheetNav>
            <SheetNav to="about">about</SheetNav>
            <SheetNav to="blog">blog</SheetNav>
          </SheetNavs>
          <NavbarNavs gap="2">
            <Nav to="">home</Nav>
            <Nav to="about">about</Nav>
            <Nav to="blog">blog</Nav>
          </NavbarNavs>
        </Flex>
      </Container>
    </AppBar>
  )
}
