import {css, styled} from '~/utils/stitches.config'
import {Link, NavLink} from 'remix'
import {purple, slate, slateDark, whiteA} from '@radix-ui/colors'
import * as Popover from '@radix-ui/react-popover'
import {HamburgerMenuIcon} from '@radix-ui/react-icons'
import React, {useState} from 'react'

const DropdownContent = styled(Popover.Content, {
  backgroundColor: whiteA.whiteA12,
  transform: 'translate(0, -2px)',
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  borderBottomWidth: 1,
  height: '60vh',
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

const link = css({
  color: slate.slate12,
  paddingLeft: '1rem',
  paddingRight: '1rem',
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem',
  variants: {
    isActive: {
      true: {
        backgroundColor: slate.slate2,
      },
    },
  },
})

const PopoverTrigger = styled(Popover.Trigger, {
  color: slateDark.slate6,
})

const TitleStyle = styled(Link, {
  fontWeight: 600,
})

function Title() {
  return <TitleStyle to={'/'}>ferdzz.com</TitleStyle>
}

const Nav = React.forwardRef<
  React.ElementRef<typeof NavLink>,
  React.ComponentProps<typeof NavLink>
>(({children, ...props}, forwardedRef) => (
  <NavLink
    {...props}
    className={({isActive}) => link({isActive})}
    end
    onClick={props.onClick}
    ref={forwardedRef}
  >
    {children}
  </NavLink>
))

export function MobileNavBar() {
  let [open, setOpen] = useState(false)

  const closeNavMenu = () => {
    setOpen(false)
  }

  return (
    <Popover.Root open={open} onOpenChange={b => setOpen(b)}>
      <Popover.Anchor>
        <MobileNavBarLayout>
          <Title />
          <PopoverTrigger>
            <HamburgerMenuIcon />
          </PopoverTrigger>
          <DropdownContent>
            <Nav
              onClick={closeNavMenu}
              className={({isActive}) => link({isActive})}
              to="/"
            >
              home
            </Nav>
            <Nav onClick={closeNavMenu} to="/about">
              about
            </Nav>
            <Nav onClick={closeNavMenu} to="/blog">
              blog
            </Nav>
          </DropdownContent>
        </MobileNavBarLayout>
      </Popover.Anchor>
    </Popover.Root>
  )
}
