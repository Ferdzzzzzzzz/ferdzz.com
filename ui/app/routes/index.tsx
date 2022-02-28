import {Container, Panel, Paragraph, Section} from '~/components'
import {styled} from '~/utils/stitches.config'

const StyledPanel = styled(Panel, {
  p: '$4',
})

export default function Index() {
  return (
    <Section>
      <Container size="1">
        <StyledPanel>
          <Paragraph>
            Welcome to my new site! I'm working on some cool things 🔥
          </Paragraph>
        </StyledPanel>
      </Container>
    </Section>
  )
}
