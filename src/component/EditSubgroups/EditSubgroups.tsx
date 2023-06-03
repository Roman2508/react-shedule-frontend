import * as React from 'react'
import './EditSubgroups.scss'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import EditSubgroupsTable from './SpecializationTable/EditSubgroupsTable'
import { Stack } from '@mui/system'
import { StyledClosedButton } from '../../theme'
import { GroupType } from '../../redux/group/groupTypes'

type EditSubgroupsPropsType = {
  openEditSubgroups: boolean
  setOpenEditSubgroups: (value: boolean) => void
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

const EditSpecializations: React.FC<EditSubgroupsPropsType> = ({
  openEditSubgroups,
  setOpenEditSubgroups,
  selectedGroup,
}) => {
  const handleClose = () => {
    setOpenEditSubgroups(false)
  }

  if (selectedGroup === null) {
    return <div></div>
  }

  return (
    <Dialog open={openEditSubgroups} TransitionComponent={Transition} keepMounted onClose={handleClose} maxWidth={'lg'}>
      <DialogTitle>Підгрупи</DialogTitle>
      <DialogContent>
        {/* table */}
        <EditSubgroupsTable
          groupLoad={selectedGroup.groupLoad ? selectedGroup.groupLoad.load : []}
          subgroups={selectedGroup.subgroups}
          groupId={selectedGroup._id}
          streams={selectedGroup.streams}
        />
        {/* table */}
      </DialogContent>
      <DialogActions>
        <Stack spacing={2} direction="row" sx={{ margin: '0 15px 10px 0' }}>
          <StyledClosedButton variant="outlined" onClick={handleClose}>
            Закрити
          </StyledClosedButton>
          {/* <Button variant="contained" onClick={handleClose}>
            Зберегти
          </Button> */}
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default EditSpecializations
