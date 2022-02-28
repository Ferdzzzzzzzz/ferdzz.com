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
            I've got a couple of drafts in the pipeline...stay tuned ✍🏻
          </Paragraph>
        </StyledPanel>
      </Container>
    </Section>
  )
}
