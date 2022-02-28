import {PropsWithChildren} from 'react'
import {styled} from '~/utils/stitches.config'
import {Navbar} from './Navbar'

const Screen = styled('div', {
  height: '100vh',
})

const Content = styled('div', {
  height: '90vh',
})

export function DefaultLayout({children}: PropsWithChildren<{}>) {
  return (
    <Screen>
      <Navbar />
      <Content>{children}</Content>
    </Screen>
  )
}
