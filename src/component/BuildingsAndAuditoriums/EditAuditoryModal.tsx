import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import AddAuditoriumsForm from './AddAuditoriumsForm'
import { AuditoriumsType, BuildingsType } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type EditAuditoryModalPropsType = {
  open: boolean
  setOpen: (value: boolean) => void
  buildings: BuildingsType[]
  editedAuditory?: AuditoriumsType
  institutionId: string
}

const EditAuditoryModal: React.FC<EditAuditoryModalPropsType> = ({
  open,
  setOpen,
  buildings,
  editedAuditory,
  institutionId,
}) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle>Редагувати аудиторію</DialogTitle>
      <DialogContent sx={{ minWidth: '500px' }}>
        <AddAuditoriumsForm
          buildings={buildings}
          handleClose={handleClose}
          editedAuditory={editedAuditory}
          institutionId={institutionId}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditAuditoryModal
