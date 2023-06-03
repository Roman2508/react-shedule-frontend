import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { AuditoriumsType } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'
import { DepartmentType, TeacherType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'
import AddTeacherFrom from '../TeacherAndDepartmentsModals/AddTeacherFrom'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type EditTeacherModalPropsType = {
  open: boolean
  setOpen: (value: boolean) => void
  departments?: DepartmentType[] // departments is required
  currentTeacher?: TeacherType // departments is required ??????????
  institutionId: string
}

const EditTeacherModal: React.FC<EditTeacherModalPropsType> = ({
  open,
  setOpen,
  departments,
  currentTeacher,
  institutionId,
}) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
      <DialogTitle>Редагувати викладача</DialogTitle>
      <DialogContent sx={{ minWidth: '500px' }}>
        {/* <AddAuditoriumsForm buildings={buildings} handleClose={handleClose} currentTeacher={currentTeacher} /> */}
        <AddTeacherFrom
          departments={departments}
          currentTeacher={currentTeacher}
          handleClose={handleClose}
          institutionId={institutionId}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditTeacherModal
