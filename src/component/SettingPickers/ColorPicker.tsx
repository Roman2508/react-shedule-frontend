import React from 'react'
import '../../Pages/Settings/SettingsPage.scss'
import Typography from '@mui/material/Typography'
import { MuiColorInput } from 'mui-color-input'

type ColorPickerPropsType = {
  name: string
  value: string
}

const ColorPicker: React.FC<ColorPickerPropsType> = ({ name, value }) => {
  const [color, setColor] = React.useState(value)

  const handleChange = (color: string) => {
    setColor(color)
  }

  return (
    <div className="settings-page__select-colors">
      <Typography sx={{ width: '100px' }}>{name}: </Typography>
      <MuiColorInput value={color} onChange={handleChange} />
    </div>
  )
}

export default ColorPicker
