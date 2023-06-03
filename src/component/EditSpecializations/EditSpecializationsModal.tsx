import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ModalTable from './ModalTable'
import { StyledClosedButton } from '../../theme'
import { SpecializationListType } from '../../redux/group/groupTypes'

type EditSpecializationsModalPropsType = {
  openSpecializationsModal: boolean
  setOpenSpecializationsModal: (value: boolean) => void
  specializationList: SpecializationListType[]
  groupId: string
}

const EditSpecializationsModal: React.FC<EditSpecializationsModalPropsType> = ({
  openSpecializationsModal,
  setOpenSpecializationsModal,
  specializationList,
  groupId,
}) => {
  const handleClose = () => {
    setOpenSpecializationsModal(false)
  }

  return (
    <Dialog
      open={openSpecializationsModal}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">Редагування спеціалізованих підгруп</DialogTitle>
      <DialogContent>
        {/* specialization list table */}
        <ModalTable groupId={groupId} specializationList={specializationList} />
        {/* // specialization list table */}
      </DialogContent>
      <DialogActions>
        <StyledClosedButton variant="outlined" onClick={handleClose}>
          Закрити
        </StyledClosedButton>
        <Button variant="contained" onClick={handleClose} autoFocus>
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSpecializationsModal
