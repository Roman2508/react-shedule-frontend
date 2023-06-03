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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
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
}

const EducationalPlanAddSubject: React.FC<EducationalPlanAddSubjectType> = ({
  planId,
  modalRole,
  disciplineName,
  activeSubjectId,
  openAddSubjectModal,
  setOpenAddSubjectModal,
}) => {
  const dispatch = useAppDispatch()

  const { institution } = useSelector(selectAuthData)

  const [subjectName, setSubjectName] = React.useState('')

  React.useEffect(() => {
    if (modalRole === 'add') {
      setSubjectName('')
    } else if (modalRole === 'update') {
      setSubjectName(disciplineName)
    }
  }, [modalRole, disciplineName])

  const handleClose = () => {
    setOpenAddSubjectModal(false)
  }

  const onAddNewSubject = async () => {
    if (institution) {
      const data = {
        planId,
        institutionId: institution._id,
        name: subjectName,
      }
      const { payload } = await dispatch(createNewSubject(data))
      createAlertMessage(dispatch, payload, 'Дисципліну додано', 'Помилка при додаванні дисципліни :(')
      handleClose()
      setSubjectName('')
    }
  }

  const onChangeSubjectName = async () => {
    const updateSubjectNamePayload = {
      id: activeSubjectId,
      name: subjectName,
    }
    const { payload } = await dispatch(updateSubjectName(updateSubjectNamePayload))
    createAlertMessage(dispatch, payload, 'Назву дисципліни оновлено', 'Помилка при оноленні назви дисципліни :(')
    handleClose()
    setSubjectName('')
  }

  return (
    <Dialog
      open={openAddSubjectModal}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle>{modalRole === 'add' ? 'Додати нову дисципліну' : 'Назва дисципліни'}</DialogTitle>
      <DialogContent>
        <FormControl sx={{ width: '100%', minWidth: '400px' }} variant="standard">
          <TextField
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            label="Назва дисципліни"
            variant="standard"
          />
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
