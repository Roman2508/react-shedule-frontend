import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import { StyledClosedButton } from '../theme'
import { ModalDataType } from '../Pages/Home/Home'
import { useAppDispatch } from '../redux/store'
import { createFaculty, createSpecialty, updateFaculty, updateSpecialty } from '../redux/faculties/facultiesAsyncAction'
import { FacultyType, SpecialtyType } from '../redux/faculties/facultiesTypes'
import { useSelector } from 'react-redux'
import { selectAuthData } from '../redux/accountInfo/accountInfoSelector'
import createAlertMessage from '../utils/createAlertMessage'

type AddMaitItemModalPropsType = {
  open: boolean
  setOpen: (value: boolean) => void
  modalData?: ModalDataType
  setActiveMainItem: (faculty: FacultyType) => void
  setActiveSpecialtyItem: (val: SpecialtyType) => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const AddMainItemModal: React.FC<AddMaitItemModalPropsType> = ({
  open,
  setOpen,
  modalData,
  setActiveMainItem,
  setActiveSpecialtyItem,
}) => {
  const dispatch = useAppDispatch()

  const { institution } = useSelector(selectAuthData)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  React.useEffect(() => {
    if (modalData && modalData.data) {
      setInputsValues(modalData.data)
    }
  }, [modalData])

  const [inputsValues, setInputsValues] = React.useState({
    name: '',
    shortName: '',
  })

  const onClearInputsValues = () => {
    setInputsValues({ name: '', shortName: '' })
  }

  const onChangeInputsValues = (type: string, value: string) => {
    setInputsValues((prev) => {
      return { ...prev, [type]: value }
    })
  }

  const handleClose = () => {
    setOpen(false)
    onClearInputsValues()
  }

  const onAddMainUnit = handleSubmit(async (data) => {
    if (institution) {
      if (modalData && modalData.type === 'faculty') {
        const { payload } = await dispatch(createFaculty({ ...inputsValues, institutionId: institution._id }))
        createAlertMessage(dispatch, payload, 'Додано факультет', 'Помилка при додаванні факультета :(')
      }
      if (modalData && modalData.type === 'specialty' && modalData.facultieId) {
        const createSpecialtyPayload = {
          ...inputsValues,
          facultieId: modalData.facultieId,
          institutionId: institution._id,
        }

        const { payload } = await dispatch(createSpecialty(createSpecialtyPayload))
        createAlertMessage(dispatch, payload, 'Додано спеціальність', 'Помилка при додаванні спеціальності :(')

        if (payload) {
          // @ts-ignore
          setActiveMainItem((prev) => {
            const specialties = [...prev.specialties, payload]
            return { ...prev, specialties }
          })
        }
      }
      handleClose()
      onClearInputsValues()
    }
  })

  const onUpdateMainUnit = handleSubmit(async () => {
    if (modalData && modalData.facultieId) {
      if (modalData.type === 'updateMainItem') {
        const { payload } = await dispatch(updateFaculty({ ...inputsValues, _id: modalData.facultieId }))
        createAlertMessage(dispatch, payload, 'Факультет оновлено', 'Помилка при оновленні факультета :(')
        // @ts-ignore
        setActiveMainItem((prev) => ({ ...prev, name: inputsValues.name, shortName: inputsValues.shortName }))
      }
      if (modalData.type === 'updateSpecialty' && modalData.id) {
        const updateSpecialtyData = { ...inputsValues, facultieId: modalData.facultieId, id: modalData.id }

        const { payload } = await dispatch(updateSpecialty(updateSpecialtyData))
        createAlertMessage(dispatch, payload, 'Спеціальність оновлено', 'Помилка при оновленні спеціальності :(')
        if (payload) {
          // @ts-ignore
          setActiveMainItem((prev) => {
            // @ts-ignore
            const specialties = prev.specialties.map((el) => {
              if (el._id === payload._id) {
                return payload
              }

              return el
            })
            return { ...prev, specialties }
          })
        }

        // @ts-ignore
        setActiveSpecialtyItem((prev) => {
          return { ...prev, name: inputsValues.name, shortName: inputsValues.shortName }
        })
      }
      handleClose()
      onClearInputsValues()
    }
  })

  return (
    <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
      <DialogTitle sx={{ paddingBottom: '0' }}>
        {modalData?.type === 'faculty' && 'Новий структурний підрозділ'}
        {modalData?.type === 'specialty' && 'Нова спеціальність'}
        {modalData?.type === 'updateMainItem' && 'Редагувати структурний підрозділ'}
        {modalData?.type === 'updateSpecialty' && 'Редагувати спеціальність'}
      </DialogTitle>
      <form
        onSubmit={
          modalData?.type === 'updateMainItem' || modalData?.type === 'updateSpecialty'
            ? onUpdateMainUnit
            : onAddMainUnit
        }>
        <DialogContent sx={{ paddingTop: '10px' }}>
          <TextField
            {...register('name')}
            value={inputsValues.name}
            onChange={(e) => onChangeInputsValues('name', e.target.value)}
            margin="normal"
            id="name"
            label="Назва структурного підрозділу"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            {...register('shortName')}
            value={inputsValues.shortName}
            onChange={(e) => onChangeInputsValues('shortName', e.target.value)}
            margin="normal"
            id="name"
            label="Коротка назва"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <StyledClosedButton onClick={handleClose}>Закрити</StyledClosedButton>
          {(modalData?.type === 'faculty' || modalData?.type === 'specialty') && <Button type="submit">Додати</Button>}
          {(modalData?.type === 'updateMainItem' || modalData?.type === 'updateSpecialty') && (
            <Button type="submit">Зберегти</Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddMainItemModal
