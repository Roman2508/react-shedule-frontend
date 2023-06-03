import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { StyledClosedButton } from '../../theme'
import { FormControl } from '@mui/material'
import TextField from '@mui/material/TextField'
import {
  changeEducationPlanGroupName,
  changeEducationPlanName,
  createNewEducationPlan,
  createNewEducationPlanGroup,
} from '../../redux/educationalPlan/educationalPlanAsyncAction'
import { useAppDispatch } from '../../redux/store'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { useSelector } from 'react-redux'

type AddEducationalPlanModalPropsType = {
  openEducationalPlanModal: boolean
  setEducationalPlanModal: (value: boolean) => void
  modalRole: string
  activeCategoryId: string
  activeUnitName: string
  activeId: string
}

const AddEducationalPlanModal: React.FC<AddEducationalPlanModalPropsType> = ({
  modalRole,
  activeId,
  activeUnitName,
  activeCategoryId,
  setEducationalPlanModal,
  openEducationalPlanModal,
}) => {
  const dispatch = useAppDispatch()

  const { institution } = useSelector(selectAuthData)

  const [name, setName] = React.useState('')

  const handleClose = () => {
    setEducationalPlanModal(false)
  }

  const onAddEducationPlanGroup = () => {
    if (institution) {
      dispatch(createNewEducationPlanGroup({ name, institutionId: institution._id }))
      handleClose()
      setName('')
    }
  }

  const onAddEducationPlan = () => {
    if (institution) {
      const payload = { name, categoryId: activeCategoryId, institutionId: institution._id }
      dispatch(createNewEducationPlan(payload))
      handleClose()
      setName('')
    }
  }
  const onChangeEducationPlanName = () => {
    const payload = { name, id: activeId, categoryId: activeCategoryId }
    dispatch(changeEducationPlanName(payload))
    handleClose()
    setName('')
  }

  const onChangeEducationPlanGroupName = () => {
    const payload = { id: activeId, name }
    dispatch(changeEducationPlanGroupName(payload))
    handleClose()
    setName('')
  }

  React.useEffect(() => {
    if (modalRole === 'ed-plan-name' || modalRole === 'change-unit-name') {
      setName(activeUnitName)
    }
    return () => {
      setName('')
    }
  }, [activeUnitName])

  return (
    <Dialog
      open={openEducationalPlanModal}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {modalRole === 'plan' && 'Новий навчальний план'}
        {modalRole === 'unit' && 'Новий структурний підрозділ'}
        {modalRole === 'ed-plan-name' && 'Назва навчального плану'}
        {modalRole === 'change-unit-name' && 'Назва структурного підрозділу'}
      </DialogTitle>
      <DialogContent>
        <FormControl sx={{ width: '100%', minWidth: '400px' }} variant="standard">
          {modalRole === 'plan' && (
            <TextField
              label="Назва навчального плану"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {modalRole === 'unit' && (
            <TextField
              label="Назва структурного підрозділу"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {modalRole === 'ed-plan-name' && (
            <TextField
              label="Назва навчального плану"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {modalRole === 'change-unit-name' && (
            <TextField
              label="Назва структурного підрозділу"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <StyledClosedButton variant="outlined" onClick={handleClose}>
          Закрити
        </StyledClosedButton>
        {/* <Button
          variant="contained"
          onClick={
            modalRole === 'plan'
              ? onAddEducationPlan
              : modalRole === 'unit'
              ? onAddEducationPlanGroup
              : modalRole === 'change-unit-name'
              ? onChangeEducationPlanGroupName
              : onChangeEducationPlanName
          }
          autoFocus>
          Зберегти
        </Button> */}
        {modalRole === 'plan' && (
          <Button variant="contained" onClick={onAddEducationPlan} autoFocus>
            Зберегти
          </Button>
        )}
        {modalRole === 'ed-plan-name' && (
          <Button variant="contained" onClick={onChangeEducationPlanName} autoFocus>
            Зберегти
          </Button>
        )}

        {modalRole === 'unit' && (
          <Button variant="contained" onClick={onAddEducationPlanGroup} autoFocus>
            Зберегти
          </Button>
        )}
        {modalRole === 'change-unit-name' && (
          <Button variant="contained" onClick={onChangeEducationPlanGroupName} autoFocus>
            Зберегти
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default AddEducationalPlanModal
