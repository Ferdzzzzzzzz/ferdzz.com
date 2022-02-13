import {styled} from '~/utils/stitches.config'

const Layout = styled('div', {
  display: 'absolute',
  left: '50%',
  top: '50%',
  transform: '-translateX(50%) -translateY(50%)',
})

export default function Index() {
  return (
    <Layout>Welcome to my new site! I'm working on some cool things 🔥 </Layout>
  )
}
