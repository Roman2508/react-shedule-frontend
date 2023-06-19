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
import { addDepartment } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import RemoveDepartmentModal from './RemoveDepartmentModal'
import { DepartmentType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'

type onSubmitDepartmentsPaylaodTypes = {
  name: string
  departmentNumber: number
}

type AddDepartmentFormPropsType = {
  departments: DepartmentType[] | null
  institutionId: string
}

const AddDepartmentForm: React.FC<AddDepartmentFormPropsType> = ({ departments, institutionId }) => {
  const dispatch = useAppDispatch()

  const [openRemoveDepartmentModal, setOpenRemoveDepartmentModal] = React.useState(false)
  const [formValues, setFormValues] = React.useState({
    name: '',
    departmentNumber: '',
  })

  const isSaveButtonDisabled = Object.entries(formValues).every((el) => el[1])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onClearFormValues = () => {
    setFormValues({ name: '', departmentNumber: '' })
  }

  const onSubmitDepartments = handleSubmit((_data) => {
    const data = _data as onSubmitDepartmentsPaylaodTypes

    const payload = {
      ...data,
      institutionId,
      teachers: [],
    }
    dispatch(addDepartment(payload))
    onClearFormValues()
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
    setOpenRemoveDepartmentModal(true)
  }
  const handleClose = () => {
    setOpenRemoveDepartmentModal(false)
  }

  return (
    <>
      <RemoveDepartmentModal
        openModal={openRemoveDepartmentModal}
        handleCloseModal={handleClose}
        departments={departments}
      />

      <form onSubmit={onSubmitDepartments}>
        <TextField
          className="teachers-and-departments__input"
          label="Назва кафедри"
          variant="standard"
          {...register('name', { required: 'Це поле є обов`язковим.' })}
          value={formValues.name}
          onChange={(e) => onChangeInputValues(e.target.value, 'name')}
        />
        {/* <ErrorMessage errors={errors} name="singleErrorInput" /> */}
        <TextField
          className="teachers-and-departments__input"
          label="Шифр кафедри"
          variant="standard"
          {...register('departmentNumber')}
          value={formValues.departmentNumber}
          onChange={(e) => onChangeInputValues(e.target.value, 'departmentNumber')}
        />

        <Box className="teachers-and-departments__bottom">
          <Button variant="outlined" onClick={handleOpen}>
            Редагувати
          </Button>

          <Stack spacing={2} direction="row" className="teachers-and-departments__buttons-box">
            <Button variant="outlined" type="submit" disabled={!isSaveButtonDisabled}>
              Зберегти
            </Button>
            <StyledClosedButton variant="outlined" onClick={onClearFormValues}>
              Очистити
            </StyledClosedButton>
          </Stack>
        </Box>
      </form>
    </>
  )
}

export default AddDepartmentForm
