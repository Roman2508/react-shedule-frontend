import React from 'react'
import '../../Pages/TeachersAndDepartments/TeachersAndDepartments.scss'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/system/Stack'
import Box from '@mui/system/Box'
import { StyledClosedButton } from '../../theme'
import { useForm } from 'react-hook-form'
// import { ErrorMessage } from '@hookform/error-message'
import { useAppDispatch } from '../../redux/store'
import RemoveBuildingsForm from './RemoveBuildingsForm'
import { selectBuildings } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsSelector'
import { useSelector } from 'react-redux'
import { addBuilding } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsAsyncAction'
import { onSubmitBuildingsPaylaodTypes } from '../../api/apiTypes'

type AddBuildingsFormPropsType = {
  institutionId: string
}

const AddBuildingsForm: React.FC<AddBuildingsFormPropsType> = ({ institutionId }) => {
  const dispatch = useAppDispatch()

  const { buildings } = useSelector(selectBuildings)

  const [openRemoveBuildingsModal, setOpenRemoveBuildingsModal] = React.useState(false)
  const [formValues, setFormValues] = React.useState({
    name: '',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onClearInputValue = () => {
    setFormValues({
      name: '',
    })
  }

  const onSubmitBuildings = handleSubmit((data) => {
    const payload: onSubmitBuildingsPaylaodTypes = {
      institutionId,
      name: data.name,
      auditoriums: [],
    }
    dispatch(addBuilding(payload))
    onClearInputValue()
  })

  const onChangeInputValues = (value: string, type: string) => {
    setFormValues((prev) => {
      return {
        ...prev,
        [type]: value,
      }
    })
  }
  const handleOpen = () => {
    setOpenRemoveBuildingsModal(true)
  }
  const handleClose = () => {
    setOpenRemoveBuildingsModal(false)
  }

  return (
    <>
      <RemoveBuildingsForm openModal={openRemoveBuildingsModal} handleCloseModal={handleClose} buildings={buildings} />

      <form onSubmit={onSubmitBuildings}>
        <TextField
          className="teachers-and-departments__building-input"
          label="Назва"
          variant="standard"
          {...register('name', { required: 'Це поле є обов`язковим.' })}
          value={formValues.name}
          onChange={(e) => onChangeInputValues(e.target.value, 'name')}
        />
        {errors.name && <p style={{ color: '#d32f2f' }}>Це поле є обов`язковим.</p>}
        {/* <e errors={errors} name="singleErrorInput" /> */}

        <Box className="teachers-and-departments__bottom">
          <Button variant="outlined" onClick={handleOpen}>
            Редагувати
          </Button>

          <Stack spacing={2} direction="row" className="teachers-and-departments__buttons-box">
            <Button variant="outlined" type="submit">
              Зберегти
            </Button>
            <StyledClosedButton variant="outlined" onClick={onClearInputValue}>
              Очистити
            </StyledClosedButton>
          </Stack>
        </Box>
      </form>
    </>
  )
}

export default AddBuildingsForm
