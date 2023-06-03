import * as React from 'react'
import Stack from '@mui/system/Stack'
import Slide from '@mui/material/Slide'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { useAppDispatch } from '../../redux/store'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { TransitionProps } from '@mui/material/transitions'

import './EditSpecializations.scss'
import { StyledClosedButton } from '../../theme'
import { GroupType } from '../../redux/group/groupTypes'
import EditSpecializationsModal from './EditSpecializationsModal'
import EditSpecializationsTable from './SpecializationTable/EditSpecializationsTable'
import { fetchEducationalPlansById } from '../../redux/educationalPlan/educationalPlanAsyncAction'

type EditSpecializationsPropsType = {
  openSpecializations: boolean
  setOpenSpecializations: (value: boolean) => void
  selectedGroup: GroupType | null
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const EditSpecializations: React.FC<EditSpecializationsPropsType> = ({
  openSpecializations,
  setOpenSpecializations,
  selectedGroup,
}) => {
  const dispatch = useAppDispatch()

  const [openSpecializationsModal, setOpenSpecializationsModal] = React.useState(false)

  React.useEffect(() => {
    if (selectedGroup && typeof selectedGroup.EducationPlanId === 'object') {
      // @ts-ignore
      dispatch(fetchEducationalPlansById(selectedGroup.EducationPlanId._id)) // xz?????????????
    }
  }, [selectedGroup])

  const handleClose = () => {
    setOpenSpecializations(false)
    setOpenSpecializationsModal(false)
  }

  if (selectedGroup === null) {
    return <div></div>
  }

  return (
    <Dialog
      open={openSpecializations}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      maxWidth={'lg'}>
      {/* modal */}
      <EditSpecializationsModal
        openSpecializationsModal={openSpecializationsModal}
        setOpenSpecializationsModal={setOpenSpecializationsModal}
        groupId={selectedGroup._id}
        specializationList={selectedGroup.specializationsList}
      />
      {/* /modal */}

      {/* <DialogTitle>Спеціалізовані підгрупи</DialogTitle> */}
      <DialogContent>
        {/* table */}
        <EditSpecializationsTable
          groupLoad={selectedGroup.groupLoad ? selectedGroup.groupLoad.load : []}
          specializationsList={selectedGroup.specializationsList}
          specializationsSubjects={selectedGroup.specializationsSubjects}
        />
        {/* //table */}
      </DialogContent>
      <DialogActions className="edit-specializations__button-group">
        <Button onClick={() => setOpenSpecializationsModal(true)}>Редагувати спеціалізовані підгрупи</Button>

        <Stack spacing={2} direction="row">
          <StyledClosedButton variant="outlined" onClick={handleClose}>
            Закрити
          </StyledClosedButton>
          {/* <Button variant="contained" onClick={handleClose}>
            Закрити
          </Button> */}
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default EditSpecializations
