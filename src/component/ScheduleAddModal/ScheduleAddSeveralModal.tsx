import React from 'react'
import './ScheduleAddModal.scss'
import { TransitionProps } from '@mui/material/transitions'
import { StyledClosedButton } from '../../theme'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type ScheduleAddSeveralModalPropsType = {
  openModal: boolean
  handleOpenModal: () => void
  handleCloseModal: () => void
  setTypeOfEdition: (value: number) => void
}

const weeks = [
  '1 (01.08 - 06.08)',
  '2 (08.08 - 13.08)',
  '3 (15.08 - 20.08)',
  '4 (22.08 - 27.08)',
  '5 (29.08 - 03.09)',
  '6 (05.09 - 10.09)',
  '7 (12.09 - 17.09)',
  '8 (19.09 - 24.09)',
  '9 (26.09 - 01.10)',
  '10 (19.10 - 24.10)',
]

const ScheduleAddSeveralModal: React.FC<ScheduleAddSeveralModalPropsType> = ({
  openModal,
  handleOpenModal,
  handleCloseModal,
  setTypeOfEdition,
}) => {
  const [state, setState] = React.useState([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    })
  }

  const onCloseModal = () => {
    setTypeOfEdition(0)
    handleCloseModal()
  }

  return (
    <Dialog
      open={openModal}
      // TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseModal}
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle>{'Середа 2 пара'}</DialogTitle>
      <Divider />
      <DialogContent sx={{ padding: '0 !important' }} className="schedule-add-modal__audience-box">
        <div className="schedule-add-modal__main-grid">
          <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <FormLabel component="legend">Навчальні тижні</FormLabel>
              <FormGroup>
                {weeks.map((w: any) => (
                  <FormControlLabel
                    key={w}
                    control={<Checkbox checked={state[w]} onChange={handleChange} name={w} />}
                    label={w}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <StyledClosedButton onClick={onCloseModal}>Закрити</StyledClosedButton>
        <Button onClick={handleCloseModal}>Зберегти</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ScheduleAddSeveralModal
