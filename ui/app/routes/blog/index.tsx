import {styled} from '~/utils/stitches.config'

const StyledBlogPage = styled('div', {
  padding: '2.5rem',
})

export default function Blog() {
  return (
    <StyledBlogPage>
      I've got a couple of drafts in the pipeline...stay tuned ✍🏻
    </StyledBlogPage>
  )
}
