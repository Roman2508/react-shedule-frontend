import * as React from 'react'
import Box from '@mui/material/Box'
import SpeedDial from '@mui/material/SpeedDial'
import MenuIcon from '@mui/icons-material/Menu'

type HeaderBurgerType = {
  setOpen: (value: boolean) => void
}

const HeaderBurger: React.FC<HeaderBurgerType> = ({ setOpen }) => {
  const [open, set] = React.useState(false)

  return (
    <Box>
      <SpeedDial
        ariaLabel="SpeedDial controlled open"
        icon={<MenuIcon />}
        sx={{ position: 'fixed', bottom: '20px', left: '20px' }}
        open={open}
        onClick={() => setOpen(!open)}></SpeedDial>
    </Box>
  )
}

export default HeaderBurger
