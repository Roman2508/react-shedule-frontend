import React from 'react'
import '../../Pages/TeachersAndDepartments/TeachersAndDepartments.scss'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Stack from '@mui/system/Stack'
import { StyledClosedButton } from '../../theme'
import { useAppDispatch } from '../../redux/store'
import { addTeacher, updateTeacher } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import { useForm } from 'react-hook-form'
import { onSubmitTeacherType } from '../../api/apiTypes'
import { DepartmentType, TeacherType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'

type AddTeacherFormType = {
  departments?: DepartmentType[]
  currentTeacher?: TeacherType
  handleClose?: () => void
  institutionId: string
}

export type EditedTeacherType = {
  lastName: string
  firstName: string
  middleName: string
  departmentId: string | number
  formOfWork: string
}

// departments is required

const AddTeacherFrom: React.FC<AddTeacherFormType> = ({ currentTeacher, departments, handleClose, institutionId }) => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [newTeacher, setNewTeacher] = React.useState<EditedTeacherType>({
    lastName: '',
    firstName: '',
    middleName: '',
    departmentId: '',
    formOfWork: '',
  })

  // Перевіряю чи всі поля заповнені
  const isSaveButtonDisabled = Object.entries(newTeacher).every((el) => el[1])

  React.useEffect(() => {
    if (currentTeacher) {
      const departmentName = departments?.find((el) => el._id === currentTeacher.departmentId)?.departmentNumber

      if (departmentName) {
        setNewTeacher({
          lastName: currentTeacher.lastName,
          firstName: currentTeacher.firstName,
          middleName: currentTeacher.middleName,
          departmentId: departmentName,
          formOfWork: currentTeacher.formOfWork,
        })
      }
    }
  }, [currentTeacher])

  const departmentsNumbers = departments?.map((el) => {
    return el.departmentNumber
  })

  const onChangeTeachersInputValues = (type: string, value: string) => {
    setNewTeacher((prev) => {
      return { ...prev, [type]: value }
    })
  }

  const onClearFormValues = () => {
    setNewTeacher({ lastName: '', firstName: '', middleName: '', departmentId: '', formOfWork: '' })
  }

  const onSubmitTeacher = handleSubmit((data) => {
    const departmentId = departments?.find((el) => el.departmentNumber == data.departmentId)?._id

    if (departmentId) {
      const payload = data as onSubmitTeacherType
      dispatch(addTeacher({ ...payload, departmentId, institutionId }))
      onClearFormValues()
    }
  })

  const onUpdateTeacherInfo = handleSubmit((data) => {
    if (currentTeacher && handleClose) {
      const departmentId = departments?.find((el) => el.departmentNumber === Number(data.departmentId))?._id

      let payload
      if (departmentId) {
        payload = {
          ...newTeacher,
          _id: currentTeacher._id,
          departmentId: String(departmentId),
        }
      } else {
        payload = {
          ...newTeacher,
          _id: currentTeacher._id,
          departmentId: String(currentTeacher.departmentId),
        }
      }
      dispatch(updateTeacher(payload))
      handleClose()
    }
  })

  return (
    <form onSubmit={currentTeacher ? onUpdateTeacherInfo : onSubmitTeacher}>
      <TextField
        className="teachers-and-departments__teacher-input"
        label="Прізвище"
        variant="standard"
        sx={{ marginRight: '36px !important' }}
        {...register('lastName')}
        onChange={(e) => onChangeTeachersInputValues('lastName', e.target.value)}
        value={newTeacher.lastName}
      />
      <TextField
        className="teachers-and-departments__teacher-input"
        label="Ім’я"
        variant="standard"
        {...register('firstName')}
        onChange={(e) => onChangeTeachersInputValues('firstName', e.target.value)}
        value={newTeacher.firstName}
      />
      <TextField
        className="teachers-and-departments__teacher-input"
        label="По батькові"
        variant="standard"
        sx={{ marginRight: '36px !important' }}
        {...register('middleName')}
        onChange={(e) => onChangeTeachersInputValues('middleName', e.target.value)}
        value={newTeacher.middleName}
      />
      <FormControl className="teachers-and-departments__teacher-select" variant="standard">
        <InputLabel>Кафедра</InputLabel>
        <Select
          {...register('departmentId')}
          value={newTeacher.departmentId}
          onChange={(e) => onChangeTeachersInputValues('departmentId', String(e.target.value))}
          label="educationForm">
          {departmentsNumbers?.map((el) => (
            <MenuItem value={el} key={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl className="teachers-and-departments__teacher-select" variant="standard">
        <InputLabel>Штатний/Сумісник</InputLabel>
        <Select
          label="educationForm"
          {...register('formOfWork')}
          onChange={(e) => onChangeTeachersInputValues('formOfWork', e.target.value)}
          value={newTeacher.formOfWork}>
          <MenuItem value={'Штатний'}>Штатний</MenuItem>
          <MenuItem value={'Сумісник'}>Сумісник</MenuItem>
        </Select>
      </FormControl>

      <Stack spacing={2} direction="row" className="teachers-and-departments__buttons-box">
        <Button variant="outlined" type="submit" disabled={!isSaveButtonDisabled}>
          Зберегти
        </Button>
        {currentTeacher ? (
          <StyledClosedButton variant="outlined" onClick={handleClose}>
            Закрити
          </StyledClosedButton>
        ) : (
          <StyledClosedButton variant="outlined" onClick={onClearFormValues}>
            Очистити
          </StyledClosedButton>
        )}
      </Stack>
    </form>
  )
}

export default AddTeacherFrom
