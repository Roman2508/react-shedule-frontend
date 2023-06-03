import React from 'react'
import { TransitionProps } from '@mui/material/transitions'
import { StyledClosedButton } from '../../theme'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { DepartmentType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'
import { useAppDispatch } from '../../redux/store'
import {
  removeDepartmentById,
  updateDepartment,
} from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type RemoveDepartmentModalPropsType = {
  openModal: boolean
  handleCloseModal: () => void
  departments: DepartmentType[] | null
}

const RemoveDepartmentModal: React.FC<RemoveDepartmentModalPropsType> = ({
  openModal,
  handleCloseModal,
  departments,
}) => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [currentDepartment, setCurrentDepartment] = React.useState<DepartmentType | null>(null)
  const [newDepartmentInfo, setNewDepartmentInfo] = React.useState({
    name: '',
    departmentNumber: '',
  })

  React.useEffect(() => {
    if (currentDepartment) {
      setNewDepartmentInfo({
        name: currentDepartment.name,
        departmentNumber: String(currentDepartment.departmentNumber),
      })
    }
  }, [currentDepartment])

  const onCloseModal = () => {
    handleCloseModal()
    setCurrentDepartment(null)
  }

  const handleChange = (event: SelectChangeEvent) => {
    const current = departments?.find((el) => el.name === event.target.value)
    if (current) {
      setCurrentDepartment(current)
    }
  }

  const onChangenewDepartmentInfo = (value: string, type: string) => {
    setNewDepartmentInfo((prev) => {
      return {
        ...prev,
        [type]: value,
      }
    })
  }

  const onUpdateDepartment = () => {
    if (currentDepartment) {
      const data = {
        ...newDepartmentInfo,
        _id: currentDepartment?._id,
      }

      dispatch(updateDepartment(data))
      setNewDepartmentInfo({ name: '', departmentNumber: '' })
      // setNewDepartmentInfo(newDepartmentInfo)
      handleCloseModal()
    }
  }

  const onRemoveDepartment = () => {
    if (currentDepartment) {
      if (window.confirm('Ви дійсно хочете видалити кафедру?')) {
        if (currentDepartment.teachers.length <= 0) {
          handleCloseModal()
          dispatch(removeDepartmentById(String(currentDepartment._id)))
        } else {
          alert('Кафедра не повинна налічувати викладачів')
        }
      }
    }
  }

  return (
    <Dialog open={openModal} TransitionComponent={Transition} keepMounted onClose={handleCloseModal}>
      <DialogTitle>{'Редагувати кафедру'}</DialogTitle>
      <Divider />

      <DialogContent>
        <FormControl fullWidth>
          <InputLabel className="buildings-and-auditoriums__text-field">Кафедри</InputLabel>
          <Select value={currentDepartment?.name || ''} label="Кафедри" onChange={handleChange}>
            {departments?.map((b) => (
              <MenuItem value={b.name} sx={{ maxWidth: '300px' }}>
                {`${b.departmentNumber}. ${b.name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Шифр кафедри"
          variant="outlined"
          className="buildings-and-auditoriums__text-field department-modal-inputs"
          sx={{ margin: '20px 0 0', minWidth: '300px', display: 'block' }}
          {...register('departmentNumber', { required: 'Це поле є обов`язковим.' })}
          disabled={!currentDepartment}
          value={newDepartmentInfo.departmentNumber}
          onChange={(e) => onChangenewDepartmentInfo(e.target.value, 'departmentNumber')}
        />

        <TextField
          label="Назва"
          variant="outlined"
          className="buildings-and-auditoriums__text-field department-modal-inputs"
          sx={{ margin: '20px 0 0', minWidth: '300px', display: 'block' }}
          {...register('name', { required: 'Це поле є обов`язковим.' })}
          disabled={!currentDepartment}
          value={newDepartmentInfo.name}
          onChange={(e) => onChangenewDepartmentInfo(e.target.value, 'name')}
        />
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button sx={{ marginRight: '50px' }} disabled={!currentDepartment} onClick={onUpdateDepartment}>
          Зберегти
        </Button>

        <StyledClosedButton onClick={onCloseModal}>Закрити</StyledClosedButton>
        <Button onClick={onRemoveDepartment} disabled={!currentDepartment} color="error">
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RemoveDepartmentModal
