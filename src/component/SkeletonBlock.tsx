import * as React from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'

const SkeletonBlock = () => {
  return (
    <Paper sx={{ paddingBottom: '8px' }}>
      <Stack spacing={1} sx={{ margin: '0 8px !important' }}>
        <Skeleton variant="rounded" width={'100%'} height={46} />
        <Skeleton variant="rounded" width={'100%'} height={46} />
        <Skeleton variant="rounded" width={'100%'} height={46} />
      </Stack>
    </Paper>
  )
}

export default SkeletonBlock
