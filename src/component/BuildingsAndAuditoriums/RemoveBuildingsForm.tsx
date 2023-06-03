import React from 'react'
import './BuildingsAndAuditoriums.scss'
import { TransitionProps } from '@mui/material/transitions'
import { StyledClosedButton } from '../../theme'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import Divider from '@mui/material/Divider'
import { useAppDispatch } from '../../redux/store'
import { BuildingsType } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import { removeBuilding, updateBuilding } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsAsyncAction'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type RemoveBuildingsFormPropsType = {
  openModal: boolean
  handleCloseModal: () => void
  buildings: BuildingsType[] | null
}

const RemoveBuildingsForm: React.FC<RemoveBuildingsFormPropsType> = ({ openModal, handleCloseModal, buildings }) => {
  const dispatch = useAppDispatch()

  // const [currentDepartment, setCurrentDepartment] = React.useState<BuildingsType>()
  const [editedBuilding, setEditedBuilding] = React.useState('')
  const [newBuildingName, setNewBuildingName] = React.useState(editedBuilding)

  const onCloseModal = () => {
    handleCloseModal()
  }

  React.useEffect(() => {
    setNewBuildingName(editedBuilding)
  }, [editedBuilding])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleChange = (event: SelectChangeEvent) => {
    setEditedBuilding(event.target.value as string)
  }

  const onChangeBuildingInfo = () => {
    if (!!buildings) {
      const findedBuilding = buildings.find((el) => el.name === editedBuilding)
      if (!!findedBuilding) {
        const payload = { id: findedBuilding._id, name: newBuildingName }
        dispatch(updateBuilding(payload))
        setEditedBuilding('')
      }
      handleCloseModal()
    }
  }

  const onRemoveBuilding = () => {
    if (window.confirm('Ви дійсно хочете видалити корпус?')) {
      handleCloseModal()
      if (!!buildings) {
        const findedBuilding = buildings.find((el) => el.name === editedBuilding)
        if (findedBuilding) {
          if (!findedBuilding.auditoriums.length) {
            dispatch(removeBuilding(String(findedBuilding._id)))
            setEditedBuilding('')
          } else {
            alert('Корпус не повинен налічувати аудиторій')
          }
        }
      }
    }
  }

  return (
    <Dialog open={openModal} TransitionComponent={Transition} keepMounted onClose={handleCloseModal}>
      <DialogTitle>{'Редагувати корпус'}</DialogTitle>
      <Divider />
      <form style={{ width: '320px' }}>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel className="buildings-and-auditoriums__text-field">Корпуси</InputLabel>
            <Select value={editedBuilding} label="Корпуси" onChange={handleChange}>
              {buildings?.map((b) => (
                <MenuItem key={b._id} value={b.name} sx={{ maxWidth: '300px' }}>
                  {b.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Назва"
            variant="outlined"
            className="buildings-and-auditoriums__text-field"
            sx={{ margin: '20px 0 0', width: '100%' }}
            {...register('newName', { required: 'Це поле є обов`язковим.' })}
            disabled={!editedBuilding}
            value={newBuildingName}
            onChange={(e) => setNewBuildingName(e.target.value)}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button sx={{ marginRight: '30px' }} disabled={!editedBuilding} onClick={onChangeBuildingInfo}>
            Зберегти
          </Button>
          <StyledClosedButton onClick={onCloseModal}>Закрити</StyledClosedButton>
          <Button onClick={onRemoveBuilding} color="error" disabled={!editedBuilding}>
            Видалити
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RemoveBuildingsForm
