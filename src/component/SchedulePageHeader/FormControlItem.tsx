import React from 'react'
import '../../Pages/SchedulePage/SchedulePage.scss'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import CircularProgress from '@mui/material/CircularProgress'
import Select, { SelectChangeEvent } from '@mui/material/Select'

interface FormControlItemProps {
  mainLabel: string
  mainItems: any[]
  secondaryItems: any[]
  secondaryLabel: string
  selectedMainItemId: string
  onChangeMainHandler: (event: SelectChangeEvent) => void
  selectedSecondaryItemName: string
  onChangeSecondaryHandler: (event: SelectChangeEvent) => void
}

const FormControlItem: React.FC<FormControlItemProps> = ({
  mainLabel,
  mainItems,
  secondaryItems,
  secondaryLabel,
  onChangeMainHandler,
  selectedMainItemId,
  onChangeSecondaryHandler,
  selectedSecondaryItemName,
}) => {
  return (
    <>
      <FormControl sx={{ width: '380px' }} fullWidth>
        {mainItems.length ? (
          <>
            <InputLabel>{mainLabel}</InputLabel>
            <Select
              className="schedule-page__select"
              value={selectedMainItemId}
              // defaultValue={'faculties[0].name'}
              label="building"
              onChange={onChangeMainHandler}>
              {mainItems.map((el) => (
                <MenuItem key={el._id} value={el._id}>
                  {el.name}
                </MenuItem>
              ))}
            </Select>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress size={38} />
          </div>
        )}
      </FormControl>

      <FormControl sx={{ width: '180px', marginLeft: '16px' }} fullWidth>
        {secondaryItems.length ? (
          <>
            <InputLabel>{secondaryLabel}</InputLabel>
            <Select
              className="schedule-page__select"
              value={selectedSecondaryItemName}
              label="auditory"
              onChange={onChangeSecondaryHandler}>
              {secondaryItems.map((el: string, index: number) => (
                <MenuItem value={String(el)} key={index}>
                  {el}
                </MenuItem>
              ))}
            </Select>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress size={38} />
          </div>
        )}
      </FormControl>
    </>
  )
}

export default FormControlItem
