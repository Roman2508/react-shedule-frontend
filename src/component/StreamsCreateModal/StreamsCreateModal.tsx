import * as yup from 'yup'
import * as React from 'react'
import Slide from '@mui/material/Slide'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { TransitionProps } from '@mui/material/transitions'

import { StyledClosedButton } from '../../theme'
import { useAppDispatch } from '../../redux/store'
import { StreamsType } from '../../redux/streams/streamsTypes'
import createAlertMessage from '../../utils/createAlertMessage'
import { createStream, updateStream } from '../../redux/streams/streamsAsyncActions'
import { yupResolver } from '@hookform/resolvers/yup'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type FormProps = {
  name: string
}

const streamResolver = yup.object({
  name: yup
    .string()
    .min(3, 'Мінімальна довжина 3 символа')
    .max(20, 'Максимальна довжина 20 символів')
    .required("Це обов'язкове поле"),
})

type StreamsCreateModalPropsType = {
  openModal: boolean
  institutionId: string
  modalType: 'create' | 'update'
  activeStream: StreamsType | null
  setOpenModal: (value: boolean) => void
  setActiveStream: (val: StreamsType | ((prev: any) => any)) => void
}

const StreamsCreateModal: React.FC<StreamsCreateModalPropsType> = ({
  openModal,
  modalType,
  setOpenModal,
  activeStream,
  institutionId,
  setActiveStream,
}) => {
  const dispatch = useAppDispatch()

  const [name, setName] = React.useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>({
    resolver: yupResolver(streamResolver),
  })

  React.useEffect(() => {
    if (modalType === 'create') {
      setName('')
    }
  }, [modalType])

  React.useEffect(() => {
    if (modalType === 'update' && activeStream !== null) {
      setName(activeStream.name)
    }
  }, [activeStream, modalType])

  const handleClose = () => {
    setOpenModal(false)
    setName('')
  }

  const onCreateStream = handleSubmit(async () => {
    const { payload } = await dispatch(createStream({ name, institutionId }))
    createAlertMessage(dispatch, payload, 'Потік додано', 'Помилка при створенні потоку :(')
    handleClose()
  })

  const onUpdateStream = handleSubmit(async () => {
    if (activeStream !== null) {
      const streamGroupsId = activeStream.components.map((el) => el.groupId)

      const { payload } = await dispatch(updateStream({ name, _id: activeStream._id, groupId: streamGroupsId }))
      createAlertMessage(dispatch, payload, 'Потік оновлено', 'Помилка при оновленні потоку :(')

      setActiveStream((prev) => {
        return { ...prev, name }
      })
      handleClose()
    }
  })

  return (
    <Dialog open={openModal} TransitionComponent={Transition} keepMounted onClose={handleClose}>
      <DialogTitle>{modalType === 'create' ? 'Новий потік' : 'Редагування потоку'}</DialogTitle>
      <form onSubmit={modalType === 'create' ? onCreateStream : onUpdateStream} style={{ width: '280px' }}>
        <DialogContent sx={{ padding: '0 24px 20px' }}>
          <TextField
            {...register('name')}
            error={!!errors.name}
            inputRef={(input) => input && input.focus()} // Автофокус
            className="teachers-and-departments__teacher-input"
            label="Назва потоку"
            helperText={errors.name?.message}
            variant="standard"
            value={name}
            sx={{ width: '100% !important' }}
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <StyledClosedButton onClick={handleClose}>Закрити</StyledClosedButton>
          <Button type="submit" disabled={!name}>
            Зберегти
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default StreamsCreateModal
