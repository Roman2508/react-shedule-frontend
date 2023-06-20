import React from 'react'
import '../../Pages/TeachersAndDepartments/TeachersAndDepartments.scss'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Button from '@mui/material/Button'
import Stack from '@mui/system/Stack'
import { StyledClosedButton } from '../../theme'
import { useAppDispatch } from '../../redux/store'
import { useForm } from 'react-hook-form'
import { AuditoriumsType, BuildingsType } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'
import { addAuditory, updateAuditory } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsAsyncAction'

type AddAuditoriumsFormType = {
  buildings: BuildingsType[]
  institutionId: string
  handleClose?: () => void
  editedAuditory?: AuditoriumsType
}

const AddAuditoriumsForm: React.FC<AddAuditoriumsFormType> = ({
  buildings,
  handleClose,
  editedAuditory,
  institutionId,
}) => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [newAuditory, setNewAuditory] = React.useState({
    name: '',
    buildingId: '',
    type: '',
    seatsNumber: 0,
  })

  const isSaveButtonDisabled = Object.entries(newAuditory).every((el) => el[1])

  const onChangeAuditoryInputValues = (type: string, value: string) => {
    setNewAuditory((prev) => {
      return { ...prev, [type]: value }
    })
  }

  React.useEffect(() => {
    if (editedAuditory && buildings) {
      const buildingName = buildings.find((el) => String(el._id) === String(editedAuditory.buildingId))?.name

      if (buildingName) {
        setNewAuditory({
          name: editedAuditory.name,
          buildingId: buildingName,
          type: editedAuditory.type,
          seatsNumber: editedAuditory.seatsNumber,
        })
      }
    }
  }, [editedAuditory])

  const onClearInputsValue = () => {
    setNewAuditory({
      name: '',
      buildingId: '',
      type: '',
      seatsNumber: 0,
    })
  }

  const onSubmitAuditory = handleSubmit((data) => {
    const buildingId = buildings.find((el) => el.name === data.buildingId)?._id

    if (buildingId) {
      const payload = {
        buildingId,
        institutionId,
        name: data.name,
        type: data.type,
        seatsNumber: Number(data.seatsNumber),
      }
      dispatch(addAuditory(payload))
    }
    onClearInputsValue()
  })

  const onUpdateAuditory = handleSubmit((data) => {
    const buildingId = buildings.find((el) => el.name === data.buildingId)?._id

    if (handleClose && editedAuditory) {
      if (buildingId) {
        const payload = {
          ...newAuditory,
          _id: editedAuditory._id,
          buildingId: String(buildingId),
        }
        dispatch(updateAuditory(payload))
      } else {
        const payload = {
          ...newAuditory,
          _id: editedAuditory._id,
          buildingId: editedAuditory.buildingId,
        }
        dispatch(updateAuditory(payload))
      }
      handleClose()
      onClearInputsValue()
    }
  })

  return (
    <form onSubmit={editedAuditory ? onUpdateAuditory : onSubmitAuditory}>
      <TextField
        className="teachers-and-departments__input"
        label="Назва"
        variant="standard"
        {...register('name' /* , { required: true, maxLength: 16 } */)}
        onChange={(e) => onChangeAuditoryInputValues('name', e.target.value)}
        value={newAuditory.name}
      />
      {/* {errors.name && <p style={{ color: '#d32f2f' }}>Довжина поля повинна бути від 1 до 16 символів</p>} */}

      <TextField
        className="teachers-and-departments__input"
        label="Кількість місць"
        variant="standard"
        type="number"
        InputProps={{ inputProps: { min: 0 } }}
        {...register('seatsNumber' /* , { required: true, maxLength: 4 } */)}
        onChange={(e) => onChangeAuditoryInputValues('seatsNumber', e.target.value)}
        value={newAuditory.seatsNumber === 0 ? '' : newAuditory.seatsNumber}
      />
      {/* {errors.seatsNumber && <p style={{ color: '#d32f2f' }}>Довжина поля повинна бути від 1 до 4 символів</p>} */}

      <FormControl className="teachers-and-departments__select" variant="standard">
        <InputLabel>Корпус</InputLabel>
        <Select
          {...register('buildingId')}
          value={newAuditory.buildingId}
          onChange={(e) => onChangeAuditoryInputValues('buildingId', e.target.value)}
          label="educationForm">
          {buildings.map((el) => (
            <MenuItem value={el.name} key={el._id}>
              {el.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl className="teachers-and-departments__select" variant="standard">
        <InputLabel>Тип аудиторії</InputLabel>
        <Select
          label="educationForm"
          {...register('type')}
          onChange={(e) => onChangeAuditoryInputValues('type', e.target.value)}
          value={newAuditory.type}>
          <MenuItem value={'Лекційна'}>Лекційна</MenuItem>
          <MenuItem value={'Лабораторна'}>Лабораторна</MenuItem>
          <MenuItem value={'Спеціалізована'}>Спеціалізована</MenuItem>
          <MenuItem value={"Комп'ютерна"}>Комп`ютерна</MenuItem>
          <MenuItem value={'-'}>-</MenuItem>
        </Select>
      </FormControl>

      <Stack spacing={2} direction="row" className="teachers-and-departments__buttons-box">
        <Button variant="outlined" type="submit" disabled={!isSaveButtonDisabled}>
          Зберегти
        </Button>
        {handleClose ? (
          <StyledClosedButton variant="outlined" onClick={handleClose}>
            Закрити
          </StyledClosedButton>
        ) : (
          <StyledClosedButton variant="outlined" onClick={onClearInputsValue}>
            Очистити
          </StyledClosedButton>
        )}
      </Stack>
    </form>
  )
}

export default AddAuditoriumsForm
