import React from 'react'
import moment from 'moment'
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
import { lessonsType, selectedSubjectType } from '../../redux/lessons/lessonsTypes'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import AddMultiplyIcon from '@mui/icons-material/DifferenceOutlined'
import AddLessonIcon from '@mui/icons-material/Addchart'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Typography from '@mui/material/Typography'
import ScheduleSelectAuditoryModal from './ScheduleSelectAuditoryModal'
import ScheduleAddSeveralModal from './ScheduleAddSeveralModal'
import {
  addNewLesson,
  removeLesson,
  removeStreamLessons,
  updateAuditory,
  updateStreamsAuditory,
} from '../../redux/lessons/lessonsAsyncActions'
import { useAppDispatch } from '../../redux/store'
import { getAllDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import { useSelector } from 'react-redux'
import { selectBuildings } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsSelector'
import { getAllBuildings } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsAsyncAction'
import { AuditoriumsType } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'
import { DistributedStreamType } from '../../redux/distributedLoad/distributedLoadTypes'
// import { selectSettings } from '../../redux/settings/settingsSelector'
import { selectLessons } from '../../redux/lessons/lessonsSelector'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import createAlertMessage from '../../utils/createAlertMessage'

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>
//   },
//   ref: React.Ref<unknown>,
// ) {
//   return <Slide direction="up" ref={ref} {...props} />
// })

type ScheduleAddModalMainPropsType = {
  selectedDate: {
    date: string
    number: number
  }
  userId: string
  institutionId: string
  openModal: boolean
  actionType: string
  groupName: string
  selectedSemester: string
  currentWeekNumber: number
  handleOpenModal: () => void
  handleCloseModal: () => void
  selected: selectedSubjectType
  selectedLessonItem: lessonsType | null
  selectedSubjectStreamInfo: DistributedStreamType | null
  setSelectedLessonItem: (value: lessonsType | null) => void
}

const ScheduleAddModalMain: React.FC<ScheduleAddModalMainPropsType> = ({
  userId,
  selected,
  openModal,
  groupName,
  actionType,
  selectedDate,
  institutionId,
  handleOpenModal,
  selectedSemester,
  handleCloseModal,
  currentWeekNumber,
  selectedLessonItem,
  setSelectedLessonItem,
  selectedSubjectStreamInfo,
}) => {
  const dispatch = useAppDispatch()

  const { buildings } = useSelector(selectBuildings)
  const { institution } = useSelector(selectAuthData)
  const { overlayAuditory } = useSelector(selectLessons)

  const [isAddModalOpen, setAddModalOpen] = React.useState(false)
  const [isAddSeveralModalOpen, setAddSeveralModalOpen] = React.useState(false)

  const [typeOfEdition, setTypeOfEdition] = React.useState(0)

  const [selectedCorps, setSelectedCorps] = React.useState('')
  const [selectedAudience, setSelectedAudience] = React.useState<AuditoriumsType | null>(null)
  const [auditories, setAuditories] = React.useState<AuditoriumsType[] | []>([])

  const [currentDate, setCurrentDate] = React.useState('')

  React.useEffect(() => {
    if (institution) {
      dispatch(getAllBuildings(institution._id))
    }
  }, [institution])

  React.useEffect(() => {
    setCurrentDate(() => {
      const date = moment(selectedDate.date, 'X').format('dddd DD MM')

      const dateArray = date.split(' ')

      const strDate = `${dateArray[0]} (${dateArray[1]} ${dateArray[2]})`

      return strDate
    })
  }, [selectedDate])

  React.useEffect(() => {
    // Синхронізація вибраного корпусу та аудиторії при першій загрузці
    if (buildings.length > 0) {
      setSelectedCorps(String(buildings[0]._id))
      setSelectedAudience(buildings[0].auditoriums[0])
    }
  }, [])

  React.useEffect(() => {
    // Синхронізація вибраного корпусу та аудиторії
    if (selectedLessonItem) {
      setSelectedCorps(selectedLessonItem.auditory.buildingId)
      setSelectedAudience(selectedLessonItem.auditory)
    }
  }, [selectedLessonItem])

  React.useEffect(() => {
    const auditoriums = buildings.find((el) => String(el._id) === selectedCorps)?.auditoriums

    if (auditoriums) {
      const noOverlayAuditories: AuditoriumsType[] = []

      auditoriums.map((a) => {
        const some = overlayAuditory.some((el) => String(el._id) === String(a._id))

        if (!some) {
          noOverlayAuditories.push(a)
        }
      })

      setAuditories(noOverlayAuditories)
    }
  }, [selectedCorps, overlayAuditory])

  const handleOpenAuditoryModal = () => {
    setAddModalOpen(true)
    handleCloseModal()
  }

  const handleCloseAuditoryModal = () => {
    setAddModalOpen(false)
    handleOpenModal()
  }

  const handleOpenSeveralModal = () => {
    setAddSeveralModalOpen(true)
    setAddModalOpen(false)
    handleCloseModal()
  }

  const handleCloseSeveralModal = () => {
    setAddSeveralModalOpen(false)
    handleCloseAuditoryModal()
  }

  // Створення розкладу
  const onSubmitNewLesson = async () => {
    handleCloseModal()

    if (selected.data && selectedAudience) {
      if (actionType === 'update') {
        if (selectedLessonItem) {
          // Якщо дисципліну обрано - оновлюю (аудиторію)
          // Якщо було обрано дисципліну, що об'єднана в потік
          if (selectedSubjectStreamInfo) {
            /*  */
            Promise.all(
              selectedSubjectStreamInfo.groups.map(async (el) => {
                const updateStreamsAuditoryPayload = {
                  institutionId,
                  groupId: el,
                  name: selectedLessonItem.name,
                  auditory: String(selectedAudience?._id),
                  subjectNumber: selectedLessonItem.subjectNumber,
                  date: Number(selectedLessonItem.date),
                  semester: selectedSemester,
                }
                /* Оновлюю аудиторію в кожній групі, що об'єднана в потік */
                const { payload } = await dispatch(updateStreamsAuditory(updateStreamsAuditoryPayload))
                createAlertMessage(dispatch, payload, 'Аудиторію оновлено', 'Помилка при оновленні аудиторії :(')
              }),
            )
            /*  */
            /* Якщо було обрано дисципліну, що НЕ об'єднана в потік */
          } else {
            const updateAuditoryPayload = {
              _id: selectedLessonItem._id,
              auditory: String(selectedAudience?._id),
            }

            const { payload } = await dispatch(updateAuditory(updateAuditoryPayload))
            createAlertMessage(dispatch, payload, 'Аудиторію оновлено', 'Помилка при оновленні аудиторії :(')
          }
        }
        /*  */
        /*  */
        /*  */
      }

      if (actionType === 'add') {
        // Якщо не обрано дисципліну - створюю нову

        // Якщо вибрана дисципліна об'єднана в потік - створюю розклад для всіх груп в потоці
        if (selectedSubjectStreamInfo) {
          Promise.all(
            selectedSubjectStreamInfo.groups.map(async (el) => {
              if (selected.data) {
                const addNewLessonPayload = {
                  userId,
                  institutionId,
                  name: selected.data.name || '',
                  teacher: String(selected.data.teacher._id),
                  auditory: String(selectedAudience?._id) || '',
                  remark: selected.data.remark || '',
                  date: selectedDate.date || '',
                  subjectNumber: selectedDate.number,
                  subjectType: selected.data?.type || '',
                  groupName: groupName,
                  hours: Number(selected.data?.hours),
                  stream: selected.stream?.streamId || null,
                  semester: selectedSemester,
                  students: selected.data.students,
                  groupId: el,
                }

                const { payload } = await dispatch(addNewLesson(addNewLessonPayload))
                createAlertMessage(dispatch, payload, 'Додано дисципліну', 'Помилка при додаванні дисципліни :(')
              }
            }),
          )
        }

        // Якщо вибрана дисципліна НЕ об'єднана в потік
        if (!selectedSubjectStreamInfo) {
          // @ts-ignore
          const selectedGroupName = groupName ? groupName : selected.data.groupName

          const addNewLessonPayload = {
            userId,
            institutionId,
            name: selected.data?.name || '',
            teacher: String(selected.data?.teacher._id),
            auditory: String(selectedAudience?._id) || '',
            remark: selected.data?.remark || '',
            date: selectedDate.date || '',
            subjectNumber: selectedDate.number,
            subjectType: selected.data?.type || '',
            stream: selected.stream?.streamId || null,
            semester: selectedSemester,
            groupName: selectedGroupName,
            groupId: selected.groupId,
            students: selected.data.students,
            hours: selected.data.hours,
          }

          const { payload } = await dispatch(addNewLesson(addNewLessonPayload))
          createAlertMessage(dispatch, payload, 'Додано дисципліну', 'Помилка при додаванні дисципліни :(')
        }
      }
    }
    setSelectedLessonItem(null)
  }

  // Видалення розкладу
  const onRemoveLesson = async () => {
    if (selectedLessonItem) {
      if (window.confirm('Ви дійсно хочете видалити дисципліну?')) {
        // Перевірка чи об'єднана вибрана дисципліна в потік
        if (selectedSubjectStreamInfo) {
          /*  */
          Promise.all(
            selectedSubjectStreamInfo.groups.map(async (el) => {
              const removeStreamLessonsPayload = {
                groupId: el,
                name: selectedLessonItem.name,
                date: selectedLessonItem.date,
                subjectNumber: selectedLessonItem.subjectNumber,
              }
              // Видалення елемента в базі
              const { payload } = await dispatch(removeStreamLessons(removeStreamLessonsPayload))
              createAlertMessage(dispatch, payload, 'Дисципліну видалено', 'Помилка при видаленні дисципліни :(')
              // Видалення елемента в currentGroupLessons
            }),
          )
          /*  */
        } else {
          const { payload } = await dispatch(removeLesson(selectedLessonItem._id))
          createAlertMessage(dispatch, payload, 'Дисципліну видалено', 'Помилка при видаленні дисципліни :(')
        }
        handleCloseModal()
      }
    }
    setSelectedLessonItem(null)
  }

  const onCloseScheduleModal = () => {
    handleCloseModal()
    setSelectedLessonItem(null)
  }

  return (
    <>
      <ScheduleSelectAuditoryModal
        selected={selected}
        buildings={buildings}
        auditories={auditories}
        openModal={isAddModalOpen}
        selectedDate={selectedDate}
        selectedCorps={selectedCorps}
        selectedAudience={selectedAudience}
        setSelectedCorps={setSelectedCorps}
        setSelectedAudience={setSelectedAudience}
        handleOpenModal={handleOpenAuditoryModal}
        handleCloseModal={handleCloseAuditoryModal}
      />

      <ScheduleAddSeveralModal
        openModal={isAddSeveralModalOpen}
        setTypeOfEdition={setTypeOfEdition}
        handleOpenModal={handleOpenSeveralModal}
        handleCloseModal={handleCloseSeveralModal}
      />

      <Dialog
        open={openModal}
        // TransitionComponent={Transition}
        keepMounted
        // onClose={handleCloseModal}
      >
        <DialogTitle>{`${currentDate} ${selectedDate.number} пара`}</DialogTitle>
        <Divider />
        <DialogContent sx={{ padding: '0 !important' }} className="schedule-add-modal__audience-box">
          <div className="schedule-add-modal__main-grid">
            <Box sx={{ width: 500 }}>
              <BottomNavigation
                showLabels
                value={typeOfEdition}
                onChange={(_, newValue) => {
                  setTypeOfEdition(newValue)
                }}>
                <BottomNavigationAction sx={{ minWidth: '50%' }} label="Додати одне заняття" icon={<AddLessonIcon />} />
                <BottomNavigationAction
                  sx={{ minWidth: '50%' }}
                  label="Додати декілька занять"
                  icon={<AddMultiplyIcon />}
                  onClick={handleOpenSeveralModal}
                  disabled
                />
              </BottomNavigation>
            </Box>
            <Divider />
            <Button sx={{ margin: '20px 22px 10px' }} variant="outlined" onClick={handleOpenAuditoryModal}>
              Вибрати аудиторію
            </Button>

            {/* lesson-info */}
            <div style={{ padding: '10px 22px' }} className="schedule-add-modal__lesson-info">
              <div>
                <Typography variant="h6">
                  Аудиторія:{' '}
                  {selectedAudience?.name
                    ? selectedAudience?.name
                    : selectedLessonItem?.auditory
                    ? selectedLessonItem?.auditory.name
                    : ''}
                </Typography>
                <Typography variant="h6">Тиждень: {currentWeekNumber + 1}</Typography>
                <Typography variant="h6">
                  К-ть студентів:{' '}
                  {selectedLessonItem?.students ? selectedLessonItem?.students : selected.data?.students}
                </Typography>
              </div>
              {selectedLessonItem && (
                <div style={{ textAlign: 'right' }}>
                  <Typography variant="h6">
                    {`${selectedLessonItem?.teacher.lastName}
                 ${selectedLessonItem?.teacher.firstName[0]}.${selectedLessonItem?.teacher.middleName[0]}`}
                  </Typography>
                  <Typography variant="h6">{`${selectedLessonItem?.name} (${selectedLessonItem?.type})`}</Typography>
                  <Typography variant="h6">{`${selectedLessonItem?.remark}`}</Typography>
                </div>
              )}
            </div>
            {/* // lesson-info */}
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <StyledClosedButton onClick={onCloseScheduleModal}>Закрити</StyledClosedButton>
          <Button onClick={onRemoveLesson} color="error">
            Видалити
          </Button>
          <Button onClick={onSubmitNewLesson} disabled={!selectedAudience?.name}>
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ScheduleAddModalMain
