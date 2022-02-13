import {pink, whiteA} from '@radix-ui/colors'
import {Link} from 'remix'
import {styled} from '~/utils/stitches.config'

const BlogPost = styled(Link, {
  boxShadow:
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);',
  borderWidth: '1px',
  backgroundColor: whiteA.whiteA3,
  borderRadius: '0.25rem',
  textDecorationColor: pink.pink8,
})

const BlogLayout = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  marginTop: '2.5rem',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  columnGap: '1rem',
  rowGap: '1rem',
})

const PageTitle = styled('h1', {
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  justifyItems: 'center',
  fontWeight: 600,
})

export default function Index() {
  return (
    <div>
      <PageTitle>Blog Admin</PageTitle>
      <BlogLayout>
        <BlogPost to="post1">Post 1</BlogPost>
        <BlogPost to="post2">Post 2</BlogPost>
        <BlogPost to="post3">Post 3</BlogPost>
        <BlogPost to="post4">Post 4</BlogPost>
      </BlogLayout>
    </div>
  )
}
