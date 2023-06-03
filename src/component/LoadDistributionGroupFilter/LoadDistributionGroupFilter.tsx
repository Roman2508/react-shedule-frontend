import React from 'react'
import Slide from '@mui/material/Slide'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { TransitionProps } from '@mui/material/transitions'
import CircularProgress from '@mui/material/CircularProgress'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { StyledClosedButton } from '../../theme'
import { useAppDispatch } from '../../redux/store'
import { GroupType } from '../../redux/group/groupTypes'
import '../../Pages/LoadDistribution/LoadDistribution.scss'
import { selectGroups } from '../../redux/group/groupSelector'
import createAlertMessage from '../../utils/createAlertMessage'
import { getGroupById } from '../../redux/group/groupAsyncAction'
import { FacultyType } from '../../redux/faculties/facultiesTypes'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { clearDistributedLoad } from '../../redux/distributedLoad/distributedLoadSlise'
import { updateDistributedLoad } from '../../redux/distributedLoad/distributedLoadAsyncAction'
import { DistributedLoadSubjectsType, DistributedSubjectsType } from '../../redux/distributedLoad/distributedLoadTypes'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type LoadDistributionGroupFilterPropsType = {
  setSelected: (value: DistributedLoadSubjectsType | null) => void
  setSubjectTypes: (value: DistributedSubjectsType[] | []) => void
  openFilterModal: boolean
  handleClose: () => void
  faculties: FacultyType[] | []
  setCurrentFaculty: (value: string) => void
  currentFaculty: string
  setCurrentSpecialty: (value: string) => void
  currentSpecialty: string
  setCurrentGroupName: (value: string) => void
  setCurrentGroup: (value: string) => void
  currentGroup: string
}

const LoadDistributionGroupFilter: React.FC<LoadDistributionGroupFilterPropsType> = ({
  setSelected,
  setSubjectTypes,
  openFilterModal,
  handleClose,
  faculties,
  currentFaculty,
  setCurrentFaculty,
  currentSpecialty,
  setCurrentSpecialty,
  currentGroup,
  setCurrentGroup,
  setCurrentGroupName,
}) => {
  const dispatch = useAppDispatch()

  const { institution } = useSelector(selectAuthData)

  const { fullTimeGroups, partTimeGroups, selectedGroup } = useSelector(selectGroups)

  const specialtiesList = faculties.filter((f) => f._id === currentFaculty)[0]?.specialties

  React.useEffect(() => {
    const fetchUpdateDistributedLoad = async () => {
      if (selectedGroup && institution) {
        const streamId = selectedGroup.streams.map((el) => el._id)

        const updateDistributedLoadPayload = {
          streamId: streamId,
          groupId: selectedGroup._id,
          institutionId: institution._id,
          groupLoadId: selectedGroup.groupLoad._id,
          currentShowedYear: institution.settings.currentShowedYear,
        }

        const { payload } = await dispatch(updateDistributedLoad(updateDistributedLoadPayload))
        createAlertMessage(dispatch, payload, 'Навантаження групи оновлено', 'Помилка при оновленні навантаження групи')
      }
    }

    fetchUpdateDistributedLoad()
  }, [selectedGroup])

  const handleChangeFaculty = (event: SelectChangeEvent) => {
    setCurrentFaculty(event.target.value as string)
    setCurrentSpecialty('')
    setCurrentGroup('')
  }

  const handleChangeSpecialty = (event: SelectChangeEvent) => {
    setCurrentSpecialty(event.target.value as string)
    setCurrentGroup('')
  }

  const handleChangeGroup = (event: SelectChangeEvent) => {
    setCurrentGroup(event.target.value as string)
  }

  const onSelectLoad = async () => {
    dispatch(clearDistributedLoad())
    setSelected(null)
    setSubjectTypes([])
    await dispatch(getGroupById(currentGroup))
    handleClose()

    let groupName

    groupName = fullTimeGroups?.find((el) => el._id === currentGroup)

    if (!groupName) {
      groupName = partTimeGroups?.find((el) => el._id === currentGroup)
    }

    if (groupName) {
      setCurrentGroupName(groupName.name)
    }
  }

  return (
    <div>
      <Dialog open={openFilterModal} TransitionComponent={Transition} keepMounted onClose={handleClose}>
        <DialogTitle>{`Виберіть групу`}</DialogTitle>
        <DialogContent>
          <div className="load-distribution__select-box">
            <FormControl sx={{ width: '380px' }} fullWidth>
              <InputLabel sx={{ background: '#fff !important' }}>Факультет</InputLabel>
              <Select
                className="load-distribution__select"
                value={currentFaculty}
                label="Age"
                onChange={handleChangeFaculty}>
                {faculties.map((el) => (
                  <MenuItem key={el._id} value={el._id}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="load-distribution__select" fullWidth>
              <InputLabel sx={{ background: '#fff !important' }}>Спеціальність</InputLabel>
              <Select value={currentSpecialty} label="Age" onChange={handleChangeSpecialty}>
                {specialtiesList &&
                  specialtiesList.map((el) => (
                    <MenuItem key={el._id} value={el._id}>
                      {el.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl className="load-distribution__select" fullWidth>
              {fullTimeGroups === null || partTimeGroups === null ? (
                <>
                  <InputLabel sx={{ background: '#fff !important' }}>Група</InputLabel>
                  <Select value={currentGroup} label="Age" onChange={handleChangeGroup}>
                    <div style={{ textAlign: 'center' }}>
                      <CircularProgress size={38} />
                    </div>
                  </Select>
                </>
              ) : (
                <>
                  <InputLabel sx={{ background: '#fff !important' }}>Група</InputLabel>
                  <Select value={currentGroup} label="Age" onChange={handleChangeGroup}>
                    {fullTimeGroups?.map((el: GroupType) => (
                      <MenuItem key={el._id} value={el._id}>
                        {el.name}
                      </MenuItem>
                    ))}
                    {partTimeGroups?.map((el: GroupType) => (
                      <MenuItem key={el._id} value={el._id}>
                        {el.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <StyledClosedButton onClick={handleClose}>Закрити</StyledClosedButton>
          <Button onClick={onSelectLoad}>Зберегти</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default LoadDistributionGroupFilter
