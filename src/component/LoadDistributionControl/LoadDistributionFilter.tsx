import moment from 'moment'
import './LoadDistributionControl.scss'
import Button from '@mui/material/Button'
import { ukUA } from '@mui/x-date-pickers'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import { useAppDispatch } from '../../redux/store'
import FormControl from '@mui/material/FormControl'
import React, { Dispatch, SetStateAction } from 'react'
import { GroupType } from '../../redux/group/groupTypes'
import { StyledDistributedLoadDatePicker } from '../../theme'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CircularPreloader from '../../component/CircularPreloader'
import { FacultyType } from '../../redux/faculties/facultiesTypes'
import { IDistributedLoadSortParams, IDistributedLoadSortType } from './load-distribution.interface'
import { DepartmentType, TeacherType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'
import {
  getDistributedLoadBySemester,
  getDistributedTeacherLoad,
} from '../../redux/distributedLoad/distributedLoadAsyncAction'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

interface ILoadDistributionFilterProps {
  faculties: FacultyType[]
  groups: GroupType[] | null
  departments: DepartmentType[] | null
  sortType: IDistributedLoadSortType
  sortParams: IDistributedLoadSortParams
  setSortType: Dispatch<SetStateAction<IDistributedLoadSortType>>
  setSortParams: Dispatch<SetStateAction<IDistributedLoadSortParams>>
}

const LoadDistributionFilter: React.FC<ILoadDistributionFilterProps> = ({
  groups,
  faculties,
  sortType,
  sortParams,
  setSortType,
  setSortParams,
  departments,
}) => {
  const dispatch = useAppDispatch()

  const [teachers, setTeachers] = React.useState<TeacherType[]>([])

  React.useEffect(() => {
    if (departments && departments.length && sortType.type === 'teacher') {
      const teachers = departments.find((d) => String(d._id) === sortParams.mainItemId)?.teachers
      if (teachers) setTeachers(teachers)
    }
  }, [departments, sortParams])

  const handleChange = (event: SelectChangeEvent, type: string, sortMode: string) => {
    const value = event.target.value as string
    if (sortMode === 'params') {
      setSortParams((prev) => {
        return { ...prev, [type]: value }
      })
      //
    }

    if (sortMode === 'type') {
      if (value === 'teacher' && departments) {
        setSortType({ value: 'Викладач', type: 'teacher' })

        const teacher = departments[0].teachers[0]
        const teacherName = `${teacher.lastName} ${teacher.lastName[0]}.${teacher.middleName[0]}.`

        setSortParams((prev) => ({
          ...prev,
          mainItemId: String(departments[0]._id),
          mainItemName: departments[0].name,
          secondaryItemId: String(departments[0].teachers[0]._id),
          secondaryItemName: teacherName,
        }))
      }

      if (value === 'department' && departments) {
        setSortType({ value: 'Кафедра', type: 'department' })

        setSortParams((prev) => ({
          ...prev,
          mainItemId: String(departments[0]._id),
          mainItemName: departments[0].name,
          secondaryItemId: '',
          secondaryItemName: '',
        }))
      }

      if (value === 'group' && groups) {
        setSortType({ value: 'Група', type: 'group' })
        setSortParams((prev) => ({
          ...prev,
          mainItemId: String(faculties[0]._id),
          mainItemName: faculties[0].name,
          secondaryItemId: groups[0]._id,
          secondaryItemName: groups[0].name,
        }))
      }
    }
  }

  const handleChangeMainItem = (event: SelectChangeEvent) => {
    handleChange(event, 'mainItemId', 'params')

    let currentMainItem: DepartmentType | FacultyType | undefined
    let secondaryItem: any

    if (sortType.type === 'teacher' && departments) {
      currentMainItem = departments.find((el) => String(el._id) === event.target.value)
      secondaryItem = currentMainItem?.teachers[0]
    }
    if (sortType.type === 'group') {
      currentMainItem = faculties.find((el) => el._id === event.target.value)
    }
    if (currentMainItem) setSortParams((prev) => ({ ...prev, mainItemName: currentMainItem?.name as string }))
    if (secondaryItem) {
      setSortParams((prev) => ({
        ...prev,
        secondaryItemId: secondaryItem?._id,
        secondaryItemName: secondaryItem?.name,
      }))
    }
  }

  const handleChangeSecondaryItem = (event: SelectChangeEvent) => {
    handleChange(event, 'secondaryItemId', 'params')

    if (sortType.type === 'teacher') {
    }

    if (sortType.type === 'group') {
      if (!groups) return

      const currentSecondatyItem = groups.find((el) => el._id === event.target.value)
      if (currentSecondatyItem) setSortParams((prev) => ({ ...prev, secondaryItemName: currentSecondatyItem.name }))
    }
  }

  const onSubmit = () => {
    const currentShowedYear = moment(sortParams.currentYear).format('YYYY')

    if (sortType.type === 'teacher') {
      dispatch(getDistributedTeacherLoad({ teacher: sortParams.secondaryItemId, currentShowedYear }))
    }

    if (sortType.type === 'group') {
      dispatch(
        getDistributedLoadBySemester({
          sortType: sortType.type,
          selectedSemester: sortParams.currentSemester,
          id: sortParams.secondaryItemId,
        })
      )
    }

    if (sortType.type === 'department') {
      console.log({ currentShowedYear, department: sortParams.mainItemId })
    }
  }

  return (
    <div className="schedule-page__selects">
      <FormControl sx={{ width: '120px', marginRight: '16px' }} fullWidth>
        <InputLabel>Тип</InputLabel>
        <Select
          className="schedule-page__select"
          value={sortType.type}
          label="Sort type"
          onChange={(e) => handleChange(e, '', 'type')}
        >
          <MenuItem value={'group'}>Група</MenuItem>
          <MenuItem value={'teacher'}>Викладач</MenuItem>
          <MenuItem value={'department'}>Кафедра (ЦК)</MenuItem>
        </Select>
      </FormControl>

      {sortType.type === 'teacher' && (
        <>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            localeText={ukUA.components.MuiLocalizationProvider.defaultProps.localeText}
            adapterLocale="de"
          >
            <StyledDistributedLoadDatePicker
              label={'Виберіть рік'}
              sx={{ marginRight: '16px' }}
              value={sortParams.currentYear}
              onChange={(value: any) => setSortParams((prev) => ({ ...prev, currentYear: value }))}
              minDate={moment('2018', 'YYYY')}
              maxDate={moment('2041', 'YYYY')}
              format="YYYY"
              views={['year']}
            />
          </LocalizationProvider>

          <FormControl sx={{ width: '380px', marginRight: '16px' }} fullWidth>
            <InputLabel>Кафедра</InputLabel>
            <Select
              className="schedule-page__select"
              label="Main Item"
              value={sortParams.mainItemId}
              onChange={handleChangeMainItem}
            >
              {departments?.map((department) => (
                <MenuItem key={department._id} value={department._id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: '180px', marginRight: '16px' }} fullWidth>
            <InputLabel>Викладач</InputLabel>
            <Select
              className="schedule-page__select"
              label="Secondary Item"
              value={sortParams.secondaryItemId}
              onChange={handleChangeSecondaryItem}
            >
              {teachers && teachers.length ? (
                teachers.map((teacher) => {
                  const teacherName = `${teacher.lastName} ${teacher.lastName[0]}.${teacher.middleName[0]}.`

                  return (
                    <MenuItem key={teacher._id} value={teacher._id}>
                      {teacherName}
                    </MenuItem>
                  )
                })
              ) : (
                <CircularPreloader />
              )}
            </Select>
          </FormControl>
        </>
      )}

      {sortType.type === 'group' && (
        <>
          <FormControl sx={{ width: '120px', marginRight: '16px' }} fullWidth>
            <InputLabel>Семестр</InputLabel>
            <Select
              className="schedule-page__select"
              value={sortParams.currentSemester}
              label="semester"
              onChange={(e) => handleChange(e, 'currentSemester', 'params')}
            >
              {['1', '2', '3', '4', '5', '6', '7', '8'].map((el) => (
                <MenuItem key={el} value={String(el)}>
                  {el}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: '380px', marginRight: '16px' }} fullWidth>
            <InputLabel>Факультет</InputLabel>
            <Select
              className="schedule-page__select"
              label="Main Item"
              value={sortParams.mainItemId}
              onChange={handleChangeMainItem}
            >
              {faculties?.map((f) => (
                <MenuItem key={f._id} value={f._id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: '180px', marginRight: '16px' }} fullWidth>
            <InputLabel>Група</InputLabel>
            <Select
              className="schedule-page__select"
              label="Secondary Item"
              value={sortParams.secondaryItemId}
              onChange={handleChangeSecondaryItem}
            >
              {groups ? (
                groups.map((group) => (
                  <MenuItem key={group._id} value={group._id}>
                    {group.name}
                  </MenuItem>
                ))
              ) : (
                <CircularPreloader />
              )}
            </Select>
          </FormControl>
        </>
      )}

      {sortType.type === 'department' && (
        <>
          <LocalizationProvider
            dateAdapter={AdapterMoment}
            localeText={ukUA.components.MuiLocalizationProvider.defaultProps.localeText}
            adapterLocale="de"
          >
            <StyledDistributedLoadDatePicker
              label={'Виберіть рік'}
              sx={{ marginRight: '16px' }}
              value={sortParams.currentYear}
              onChange={(value: any) => setSortParams((prev) => ({ ...prev, currentYear: value }))}
              minDate={moment('2018', 'YYYY')}
              maxDate={moment('2041', 'YYYY')}
              format="YYYY"
              views={['year']}
            />
          </LocalizationProvider>

          <FormControl sx={{ width: '380px', marginRight: '16px' }} fullWidth>
            <InputLabel>Кафедра</InputLabel>
            <Select
              className="schedule-page__select"
              label="Main Item"
              value={sortParams.mainItemId}
              onChange={handleChangeMainItem}
            >
              {departments?.map((department) => (
                <MenuItem key={department._id} value={department._id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      <Button variant="outlined" onClick={onSubmit}>
        Пошук
      </Button>
    </div>
  )
}

export default LoadDistributionFilter
