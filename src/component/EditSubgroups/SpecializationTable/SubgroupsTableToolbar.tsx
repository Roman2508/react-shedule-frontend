import * as React from 'react'
import '../EditSubgroups.scss'
import { alpha } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FilterListIcon from '@mui/icons-material/FilterList'
import Button from '@mui/material/Button'

interface SubgroupsTableToolbarProps {
  numSelected: number
  setOpenSubgroupsModal: (value: boolean) => void
}

const SubgroupsTableToolbar = ({ numSelected, setOpenSubgroupsModal }: SubgroupsTableToolbarProps) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}>
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          Вибрано: {numSelected}
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          Види занять:
        </Typography>
      )}
      {numSelected > 0 ? (
        <Button sx={{ width: '570px' }} onClick={() => setOpenSubgroupsModal(true)}>
          Розбити на підгрупи вибрані елементи
        </Button>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

export default SubgroupsTableToolbar
