import { AccordionDetails, AppBar, PaletteMode } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import { styled, alpha } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import InputBase from '@mui/material/InputBase'
import Button from '@mui/material/Button'
import SunIcon from '@mui/icons-material/Brightness5Outlined'
import Accordion from '@mui/material/Accordion'
import TableSortLabel from '@mui/material/TableSortLabel'
import Dialog from '@mui/material/Dialog/Dialog'
import TextField from '@mui/material/TextField/TextField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Select from '@mui/material/Select'

export const getDesignTokens: any = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: '#2196f3',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          height: 'auto',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          height: 'auto',
        },
      },
    },
    // MuiSvgIcon: {
    //   styleOverrides: {
    //     root: {
    //       '& path': {
    //         fill: 'rgba(255, 255, 255, 0.7)',
    //       },
    //     },
    //   },
    // },
  },
  // .css-mnn31
  // shadows: {
  //   0: 'rgba(0, 0, 0, .1)',
  // },
})

// export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
//   width: 62,
//   height: 34,
//   padding: 7,
//   '& .MuiSwitch-switchBase': {
//     margin: 1,
//     padding: 0,
//     transform: 'translateX(6px)',
//     '&.Mui-checked': {
//       color: '#fff',
//       transform: 'translateX(22px)',
//       '& .MuiSwitch-thumb:before': {
//         backgroundImage: `url('data:image/svg+xmlutf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//           '#fff',
//         )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
//       },
//       '& + .MuiSwitch-track': {
//         opacity: 1,
//         backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//       },
//     },
//   },
//   '& .MuiSwitch-thumb': {
//     backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
//     width: 32,
//     height: 32,
//     '&:before': {
//       content: "''",
//       position: 'absolute',
//       width: '100%',
//       height: '100%',
//       left: 0,
//       top: 0,
//       backgroundRepeat: 'no-repeat',
//       backgroundPosition: 'center',
//       backgroundImage: `url('data:image/svg+xmlutf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//         '#fff',
//       )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
//     },
//   },
//   '& .MuiSwitch-track': {
//     opacity: 1,
//     backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//     borderRadius: 20 / 2,
//   },
// }))

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}))

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))

export const StyledButton = styled(Button)(({ theme }) => {
  return {
    color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.67)' : '#ffffff',
  }
})

export const StyledClosedButton = styled(Button)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.67)' : '#ffffff',
  backgroundColor: 'inherit',
  boxShadow: 'none',
  border: 0,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    boxShadow: 'none',
    border: 0,
  },
}))

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#121212',
  color: theme.palette.mode === 'light' ? '#424242' : '#ffffff',
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
  '& .css-hyum1k-MuiToolbar-root': {
    '& .css-6b3s0t-MuiTypography-root': {
      fontWeight: '400',
    },
  },
}))

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '6px',
  whiteSpace: 'nowrap',
}))

export const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  fontSize: '13px',
  svg: {
    display: 'none',
  },
}))

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: '8px 0 16px',
}))

export const StyledAccordioDetailsWithoutPaddings = styled(AccordionDetails)(({ theme }) => ({
  padding: '0 !important',
}))

export const StyledGrayButton = styled(Button)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.67)' : '#fff',
  backgroundColor: 'inherit',
  boxShadow: 'none',
  border: theme.palette.mode === 'light' ? '1px solid rgba(0, 0, 0, .17)' : '1px solid #fff',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    boxShadow: 'none',
    border: theme.palette.mode === 'light' ? '1px solid rgba(0, 0, 0, .17)' : '1px solid #fff',
  },
}))

export const StyledTableCellBorder = styled(TableCell)(({ theme }) => ({
  borderLeft: '1px solid rgba(224, 224, 224, 1)',
  borderRight: '1px solid rgba(224, 224, 224, 1)',
}))
export const StyledTableForDistributedLoad = styled(TableCell)(({ theme }) => ({
  borderLeft: '1px solid rgba(224, 224, 224, 1)',
  borderRight: '1px solid rgba(224, 224, 224, 1)',
  padding: '6px',
}))

export const StyledAuthDialog = styled(Dialog)(({ theme }) => ({
  '.css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
    borderRadius: '20px !important',
  },
}))

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': {
    padding: '25px 14px',
  },
  '.css-14usnb2-MuiFormLabel-root-MuiInputLabel-root': {
    top: '-3px !important',
  },
}))

export const StyledPasswordTextField = styled(TextField)(({ theme }) => ({
  '.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': {
    padding: '25px 50px 25px 14px',
  },

  '.css-14usnb2-MuiFormLabel-root-MuiInputLabel-root': {
    top: '-3px !important',
  },
}))

export const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input': {
    padding: '24px 20px',
  },
  '.css-14usnb2-MuiFormLabel-root-MuiInputLabel-root': {
    top: '-3px !important',
  },
}))

export const StyledDistributedLoadDatePicker = styled(DatePicker)(({ theme }) => ({
  '.css-co0kx7-MuiInputBase-root-MuiOutlinedInput-root': {
    marginRight: '16px',
    maxWidth: '150px',
  },
  '.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input': {
    padding: '21px 20px',
  },
  '.css-14usnb2-MuiFormLabel-root-MuiInputLabel-root': {
    top: '-6px !important',
  },
}))

export const StyledGroupAdmissionDatePicker = styled(DatePicker)(({ theme }) => ({
  width: '48%',
  marginBottom: '20px !important',
  borderBottom: '1px solid rgba(0, 0, 0, 0.42)',

  '.css-nxo287-MuiInputBase-input-MuiOutlinedInput-input': {
    padding: '19.5px 0px',
  },
  '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
    border: '0 !important',
  },
  '.css-14usnb2-MuiFormLabel-root-MuiInputLabel-root': {
    top: '-3px !important',
    left: '-13px !important',
  },
  '.css-co0kx7-MuiInputBase-root-MuiOutlinedInput-root': {
    borderRadius: '0 !important',
  },
  '&:after': {
    borderBottom: '2px solid #2196f3',
    left: 0,
    bottom: 0,
    content: '""',
    position: 'absolute',
    right: 0,
    transform: 'scaleX(0)',
    transition: 'transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    pointerEvents: 'none',
  },
  '& label': {
    left: '-14px',
  },
}))

export const StyledSelectWeek = styled(Select)(({ theme }) => ({
  margin: '0 10px',
  '.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':
    {
      position: 'relative',
      padding: '10px 30px 10px 8px !important',
      width: '100px',
      zIndex: '1',
    },
  '.css-v3zyv7-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-v3zyv7-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-v3zyv7-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':
    {
      width: '100px !important',
      height: '43px !important',
      '& span': {
        top: '-6px !important',
      },
    },

  '.css-yjsfm1, .css-14lo706': {
    position: 'relative',
    top: '-6px',
    left: '-3px',
    visibility: 'visible',
    opacity: 1,
    overflow: 'visible',
  },
  '.css-yjsfm1>span, .css-14lo706>span': {
    color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : '#ffffffb3',
    backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
    opacity: 1,
  },
}))

export const StyledCopyLessonsButton = styled(Button)(({ theme }) => ({
  height: '56px !important',
  minWidth: '56px !important',
  borderRadius: '50% !important',
  boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
}))

// #424242
