import * as React from 'react'
import {styled} from '~/components/canvasCopy/styles'

export const Divider = styled('hr', {
  height: 1,
  marginTop: '$1',
  marginRight: '-$2',
  marginBottom: '$1',
  marginLeft: '-$2',
  border: 'none',
  borderBottom: '1px solid $hover',
})
