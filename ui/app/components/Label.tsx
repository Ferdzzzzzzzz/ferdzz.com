import {styled} from '~/utils/stitches.config'
import * as LabelPrimitive from '@radix-ui/react-label'
import {Text} from './Text'

export const Label = styled(LabelPrimitive.Root, Text, {
  display: 'inline-block',
  verticalAlign: 'middle',
  cursor: 'default',
})
