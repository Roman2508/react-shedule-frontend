import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { StyledClosedButton } from '../../theme'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { useAppDispatch } from '../../redux/store'
import { createNewSubject, updateSubjectName } from '../../redux/educationalPlan/educationalPlanAsyncAction'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { useSelector } from 'react-redux'
import createAlertMessage from '../../utils/createAlertMessage'
import { Select, MenuItem, InputLabel } from '@mui/material'
import { DepartmentType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'
import { selectTeachersAndDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentSelector'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type EducationalPlanAddSubjectType = {
  planId: string
  modalRole: string
  disciplineName: string
  activeSubjectId: string
  openAddSubjectModal: boolean
  setOpenAddSubjectModal: (value: boolean) => void
  selectedDepartmentId: string | null
  setSelectedDepartmentId: React.Dispatch<React.SetStateAction<string | null>>
}

const EducationalPlanAddSubject: React.FC<EducationalPlanAddSubjectType> = ({
  planId,
  modalRole,
  disciplineName,
  activeSubjectId,
  openAddSubjectModal,
  setOpenAddSubjectModal,
  selectedDepartmentId,
  setSelectedDepartmentId,
}) => {
  const dispatch = useAppDispatch()

  const { institution } = useSelector(selectAuthData)
  const { departments } = useSelector(selectTeachersAndDepartments)

  const [subjectName, setSubjectName] = React.useState('')

  React.useEffect(() => {
    if (modalRole === 'add') {
      setSubjectName('')
      setSelectedDepartmentId('')
    } else if (modalRole === 'update') {
      setSubjectName(disciplineName)
    }
  }, [modalRole, disciplineName])

  const handleClose = () => {
    setOpenAddSubjectModal(false)
  }

  const onAddNewSubject = async () => {
    if (institution && selectedDepartmentId) {
      const data = {
        planId,
        institutionId: institution._id,
        name: subjectName,
        departmentId: selectedDepartmentId,
      }
      const { payload } = await dispatch(createNewSubject(data))
      createAlertMessage(dispatch, payload, 'Дисципліну додано', 'Помилка при додаванні дисципліни :(')
      handleClose()
      setSubjectName('')
    }
  }

  const onChangeSubjectName = async () => {
    if (selectedDepartmentId) {
      const updateSubjectNamePayload = {
        id: activeSubjectId,
        name: subjectName,
        departmentId: selectedDepartmentId,
      }
      const { payload } = await dispatch(updateSubjectName(updateSubjectNamePayload))
      createAlertMessage(dispatch, payload, 'Дисципліну оновлено', 'Помилка при оноленні дисципліни :(')
      handleClose()
      setSubjectName('')
    }
  }

  return (
    <Dialog open={openAddSubjectModal} TransitionComponent={Transition} keepMounted onClose={handleClose}>
      <DialogTitle>{modalRole === 'add' ? 'Додати нову дисципліну' : 'Оновити дисципліну'}</DialogTitle>
      <DialogContent sx={{ maxWidth: '450px', margin: '0 auto' }}>
        <FormControl sx={{ width: '400px' }} variant="standard">
          <TextField
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            sx={{ marginBottom: '32px' }}
            label="Назва дисципліни"
            variant="standard"
          />
        </FormControl>

        <FormControl sx={{ width: '400px' }} variant="standard">
          <InputLabel>Кафедра (ЦК)</InputLabel>
          <Select
            size="small"
            placeholder="Кафедра (ЦК)"
            value={selectedDepartmentId || ''}
            onChange={(e) => setSelectedDepartmentId(e.target.value as string)}
          >
            {(departments || []).map((el) => (
              <MenuItem value={el._id} key={el._id}>
                {el.departmentNumber} {el.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <StyledClosedButton onClick={handleClose}>Закрити</StyledClosedButton>
        {/* <Button onClick={onChangeSubjectName} variant="contained">
          Додати
        </Button> */}
        <Button onClick={modalRole === 'add' ? onAddNewSubject : onChangeSubjectName} variant="contained">
          {modalRole === 'add' ? 'Додати' : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default EducationalPlanAddSubject
