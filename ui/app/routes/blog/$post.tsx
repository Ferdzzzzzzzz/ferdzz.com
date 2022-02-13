import {DevRoute} from '~/components/Dev'
import {styled} from '~/utils/stitches.config'

const StyledPost = styled('div', {
  padding: '2.5rem',
})

export default function Post() {
  return (
    <DevRoute>
      <StyledPost>This is a blog post</StyledPost>
    </DevRoute>
  )
}
