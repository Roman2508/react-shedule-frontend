import * as React from 'react'
import './LoadDistributionControl.scss'
import LoadDistributionControlGroup from '../../component/LoadDistributionControlGroup/LoadDistributionControlGroup'
import Paper from '@mui/material/Paper/Paper'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

const LoadDistributionControl = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const [currentFaculty, setCurrentFaculty] = React.useState('10')
  const [currentGroup, setCurrentGroup] = React.useState('')
  const [groupList, setGroupList] = React.useState<String[]>([])

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleChangeFaculty = (event: SelectChangeEvent) => {
    setCurrentFaculty(event.target.value as string)
  }

  const handleChangeGroup = (event: SelectChangeEvent) => {
    setCurrentGroup(event.target.value as string)
  }

  return (
    <div className="load-distribution-control__wrapper">
      <Paper className="load-distribution-control__top">
        <div className="schedule-page__selects">
          <FormControl sx={{ width: '380px' }} fullWidth>
            <InputLabel>Факультет</InputLabel>
            <Select className="schedule-page__select" value={currentFaculty} label="Age" onChange={handleChangeFaculty}>
              <MenuItem value={30}>Агрономічний факультет</MenuItem>
              <MenuItem value={20}>Факультет ветеринарної медицини</MenuItem>
              <MenuItem value={10}>Факультет інформаційних технологій, обліку та фінансів</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: '180px', marginLeft: '16px' }} fullWidth>
            <InputLabel id="demo-simple-select-label">Група</InputLabel>
            <Select className="schedule-page__select" value={currentGroup} label="Age" onChange={handleChangeGroup}>
              {/* groupList?.map((el) => (
                <MenuItem value={String(el)}>{el}</MenuItem>
              )) */}
              <MenuItem value={'Ф-22-1'}>Ф-22-1</MenuItem>
              <MenuItem value={'Ф-21-1'}>Ф-21-1</MenuItem>
              <MenuItem value={'Ф-20-1'}>Ф-20-1</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Paper>
      <LoadDistributionControlGroup />
    </div>
  )
}

export default LoadDistributionControl
