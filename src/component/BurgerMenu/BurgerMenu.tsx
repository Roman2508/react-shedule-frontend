import * as React from 'react'
import './BurgerMenu.scss'
import Box from '@mui/material/Box'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { Typography } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import PlanIcon from '@mui/icons-material/MenuBookOutlined'
import TeachersIcon from '@mui/icons-material/GroupOutlined'
// import BuildingIcon from '@mui/icons-material/HomeWorkOutlined';
import BuildingIcon from '@mui/icons-material/DomainAddOutlined'
import ScheduleIcon from '@mui/icons-material/CalendarMonthOutlined'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import TreeIcon from '@mui/icons-material/AccountTreeOutlined'
import StreamsIcon from '@mui/icons-material/DynamicFeedRounded'
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined'
import ControlIcon from '@mui/icons-material/ContentPasteSearchOutlined'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooksOutlined'
import IconButton from '@mui/material/IconButton'

// all colors list: "inherit" | "disabled" | "action" | "primary" | "secondary" | "error" | "info" | "success" | "warning"

type BurgerMenuPropsType = {
  open: boolean
  setOpen: (value: boolean) => void
}

const menuItems = [
  { _id: 0, name: 'Структурні підрозділи', link: '/', icon: <TreeIcon color="info" /> },
  { _id: 1, name: 'Потоки', link: '/streams', icon: <StreamsIcon color="info" /> },
  { _id: 2, name: 'Навчальні плани', link: '/educational-plans', icon: <PlanIcon color="info" /> },
  { _id: 3, name: 'Викладачі / Кафедри', link: '/teachers-and-departments', icon: <TeachersIcon color="info" /> },
  { _id: 4, name: 'Корпуси / Аудиторії', link: '/buildings-and-auditoriums', icon: <BuildingIcon color="info" /> },
  {
    _id: 5,
    name: 'Остаточне навантаження',
    link: '/load-distribution-control',
    icon: <BallotOutlinedIcon color="disabled" />,
  },
  { _id: 6, name: 'Розподіл навантаження', link: '/load-distribution', icon: <InboxIcon color="info" /> },
]

const BurgerMenu: React.FC<BurgerMenuPropsType> = ({ open, setOpen }) => {
  const location = useLocation()

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <SwipeableDrawer open={open} onClose={toggleDrawer} onOpen={toggleDrawer}>
      <Box role="presentation" onClick={toggleDrawer} sx={{ width: 270 }}>
        <List>
          {menuItems.map((el) => (
            <Link to={el.link} key={el._id} /* className="burger-menu__item" */>
              <ListItem disablePadding selected={el.link === location.pathname}>
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: '45px' }}>{el.icon}</ListItemIcon>
                  <Typography noWrap={true} variant="subtitle1">
                    {el.name}
                  </Typography>
                  {/* <ListItemText primary={text} /> */}
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <List>
          {['Розклад'].map((text, index) => (
            <Link to="/schedule" key={text}>
              <ListItem key={text} disablePadding selected={'/schedule' === location.pathname}>
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: '45px' }}>
                    <ScheduleIcon color="info" />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <List>
          {['Контроль вичитки годин', 'Звіти'].map((el, index) => (
            <Link to={'el.link'} key={el} /* className="burger-menu__item" */>
              <ListItem disablePadding selected={false}>
                {/* <ListItem disablePadding selected={'el.link === location.pathname'}> */}
                <ListItemButton>
                  {/* <ListItemIcon>{el.icon}</ListItemIcon> */}
                  <ListItemIcon sx={{ minWidth: '45px' }}>
                    {index === 0 && <ControlIcon color="disabled" />}
                    {index === 1 && <LibraryBooksIcon color="disabled" />}
                  </ListItemIcon>
                  <Typography noWrap={true} variant="subtitle1">
                    {el}
                  </Typography>
                  {/* <ListItemText primary={text} /> */}
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
      <Box onClick={toggleDrawer} className="burger-menu__controls">
        <Link to="/settings">
          <ListItem selected={'/settings' === location.pathname} disablePadding>
            <ListItemButton>
              <SettingsIcon color="disabled" />
              <Typography variant="subtitle1" sx={{ marginLeft: '32px' }}>
                Налаштування
              </Typography>
            </ListItemButton>
          </ListItem>
        </Link>
      </Box>
    </SwipeableDrawer>
  )
}

export default BurgerMenu
