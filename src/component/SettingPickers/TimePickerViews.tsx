import React from 'react'
import moment from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'

type TimePickerViewsPropsTypes = {
  label: string
  defaultValue: string
}

const TimePickerViews: React.FC<TimePickerViewsPropsTypes> = ({ label, defaultValue }) => {
  const [value, setValue] = React.useState(moment(defaultValue, 'HH:mm'))

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <MobileTimePicker
        value={value}
        onChange={(newValue: any) => setValue(newValue)}
        ampm={false}
        label={label}
        views={['hours', 'minutes']}
        sx={{ width: '100px' }}
      />
    </LocalizationProvider>
  )
}

export default TimePickerViews
