import React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const CircularPreloader = () => {
  return (
    <Box className="building-and-auditorium-preloader">
      <CircularProgress size={45} />
    </Box>
  )
}

export default CircularPreloader
