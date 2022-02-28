import {Paragraph, Section, Container, Panel} from '~/components'
import {styled} from '~/utils/stitches.config'

const StyledPanel = styled(Panel, {
  p: '$4',
})

export default function About() {
  return (
    <Section>
      <Container size="1">
        <StyledPanel>
          <Paragraph>Learn some things about me 🤙 coming soon...</Paragraph>
        </StyledPanel>
      </Container>
    </Section>
  )
}
