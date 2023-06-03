import * as React from 'react'
import './ScheduleAddModal.scss'
import { TransitionProps } from '@mui/material/transitions'
import { StyledClosedButton } from '../../theme'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import { Typography } from '@mui/material'
import { selectedSubjectType } from '../../redux/lessons/lessonsTypes'
import { useForm } from 'react-hook-form'
import CircularPreloader from '../CircularPreloader'
import { AuditoriumsType, BuildingsType } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'
import EmptyIcon from '@mui/icons-material/NotInterested'

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>
//   },
//   ref: React.Ref<unknown>,
// ) {
//   return <Slide direction="up" ref={ref} {...props} />
// })

type ScheduleSelectAuditoryModalPropsType = {
  auditories: AuditoriumsType[] | []
  buildings: BuildingsType[] | null
  selected: selectedSubjectType
  openModal: boolean
  handleOpenModal: () => void
  handleCloseModal: () => void
  selectedDate: {
    date: string
    number: number
  }
  selectedAudience: AuditoriumsType | null
  setSelectedAudience: (value: AuditoriumsType) => void
  selectedCorps: string
  setSelectedCorps: (value: string) => void
}

const ScheduleSelectAuditoryModal: React.FC<ScheduleSelectAuditoryModalPropsType> = ({
  buildings,
  auditories,
  openModal,
  handleCloseModal,
  setSelectedAudience,
  selectedAudience,
  selectedCorps,
  setSelectedCorps,
}) => {
  //
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleSelectCorps = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCorps((event.target as HTMLInputElement).value)
  }

  const handleSelectAudience = (event: React.ChangeEvent<HTMLInputElement>) => {
    const auditory = auditories.find((el) => el.name === (event.target as HTMLInputElement).value)
    if (auditory) {
      setSelectedAudience(auditory)
    }
  }

  const onSubmit = () => {
    handleCloseModal()
  }

  return (
    <Dialog
      open={openModal}
      // TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseModal}
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle>{'Аудиторія:'}</DialogTitle>
      <Divider />
      <DialogContent sx={{ padding: '0 !important' }} className="schedule-add-modal__audience-box">
        <div>
          <Typography className="schedule-add-modal__title" noWrap={true} variant="subtitle1">
            Корпуси
          </Typography>
          <Divider />
          {buildings === null ? (
            <div style={{ width: '200px', textAlign: 'center', paddingTop: '150px' }}>Загрузка...</div>
          ) : (
            <RadioGroup
              name="corps"
              value={selectedCorps}
              onChange={handleSelectCorps}
              className="schedule-add-modal__audience-box-item">
              {buildings.map((building) => (
                <FormControlLabel
                  value={building._id}
                  key={building._id}
                  control={<Radio />}
                  label={`Корпус: ${building.name}`}
                />
              ))}
            </RadioGroup>
          )}
        </div>

        <div>
          <Typography className="schedule-add-modal__title" noWrap={true} variant="subtitle1">
            Аудиторії
          </Typography>
          <Divider />
          <RadioGroup
            name="auditory"
            value={selectedAudience?.name ? selectedAudience?.name : ''}
            onChange={handleSelectAudience}
            className="schedule-add-modal__audience-box-item audience-box-item-right">
            {auditories.length ? (
              auditories.map((auditory) => (
                <div key={auditory._id}>
                  <FormControlLabel
                    value={auditory.name}
                    key={auditory._id}
                    control={<Radio />}
                    label={auditory.name}
                  />
                  <span>{`(${auditory.seatsNumber})`}</span>
                </div>
              ))
            ) : (
              <div className="schedule-add-modal__empty-auditories-list">
                <EmptyIcon />
              </div>
            )}
          </RadioGroup>
        </div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <StyledClosedButton onClick={handleCloseModal}>Закрити</StyledClosedButton>
        <Button onClick={onSubmit}>Зберегти</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ScheduleSelectAuditoryModal
