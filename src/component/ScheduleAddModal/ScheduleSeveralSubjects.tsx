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
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Paper from '@mui/material/Paper'
import { lessonsType, selectedSubjectType } from '../../redux/lessons/lessonsTypes'

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>
//   },
//   ref: React.Ref<unknown>,
// ) {
//   return <Slide direction="up" ref={ref} {...props} />
// })

type ScheduleSeveralSubjectsPropsType = {
  openModal: boolean
  selected: selectedSubjectType
  setOpenModal: (value: boolean) => void
  sameTimeSeveralSubjects: lessonsType[]
  handleOpenScheduleAddMainModal: () => void
  selectedDate: { date: string; number: number }
  setSelected: (value: selectedSubjectType) => void
  setSelectedLessonItem: (value: lessonsType) => void
  onSelectDate: (data: { date: string; number: number }) => void
}

export const createSubjectType = (lesson: lessonsType) => {
  let type
  let lessonSubjectTypeClass

  if (lesson.subjectType.includes('lectures')) {
    type = 'ЛК'
    lessonSubjectTypeClass = 'schedule-page__lesson-lec'
  }
  if (lesson.subjectType.includes('practical')) {
    type = 'ПЗ'
    lessonSubjectTypeClass = 'schedule-page__lesson-prac'
  }
  if (lesson.subjectType.includes('laboratory')) {
    type = 'ЛАБ'
    lessonSubjectTypeClass = 'schedule-page__lesson-lab'
  }
  if (lesson.subjectType.includes('seminars')) {
    type = 'СЕМ'
    lessonSubjectTypeClass = 'schedule-page__lesson-sem'
  }
  if (lesson.subjectType.includes('exams')) {
    type = 'ЕКЗ'
    lessonSubjectTypeClass = 'schedule-page__lesson-exam'
  }

  return { type, lessonSubjectTypeClass }
}

const ScheduleSeveralSubjects: React.FC<ScheduleSeveralSubjectsPropsType> = ({
  selected,
  openModal,
  setSelected,
  selectedDate,
  setOpenModal,
  onSelectDate,
  setSelectedLessonItem,
  sameTimeSeveralSubjects,
  handleOpenScheduleAddMainModal,
}) => {
  const [currentDate, setCurrentDate] = React.useState('')

  React.useEffect(() => {
    setCurrentDate(() => {
      const date = moment(selectedDate.date, 'X').format('dddd DD MM')

      const dateArray = date.split(' ')

      const strDate = `${dateArray[0]} (${dateArray[1]} ${dateArray[2]})`

      return strDate
    })
  }, [selectedDate])

  const onCloseModal = () => {
    setOpenModal(false)
  }

  const onSeveralLessonClick = (data: { date: string; number: number }, lesson: lessonsType) => {
    onSelectDate(data)
    onCloseModal()
    setSelectedLessonItem(lesson)
  }

  // const onAddSeveralLesson = (row: any, groupId: string, subjectId: string) => {
  // const onAddSeveralLesson = (lesson: lessonsType) => {
  const onAddSeveralLesson = () => {
    if (selected) {
      // setSelectedLessonItem(lesson)
      // const data = {
      //   name: row.name,
      //   type: row.type,
      //   remark: row.remark,
      //   teacher: row.teacher,
      // }

      // setSelected({ data, subjectId, groupId })
      // @ts-ignore
      // setSelected((prev) => prev)
      handleOpenScheduleAddMainModal()
      onCloseModal()
    }
  }

  return (
    <Dialog
      open={openModal}
      // TransitionComponent={Transition}
      keepMounted
      onClose={onCloseModal}
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle>{`${currentDate} ${selectedDate.number} пара`}</DialogTitle>
      <Divider />
      <DialogContent sx={{ padding: '0 !important' }} className="schedule-add-modal__audience-box">
        <div className="schedule-add-modal__main-grid">
          <Box sx={{ display: 'flex' }}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              {sameTimeSeveralSubjects.map((el: lessonsType) => {
                const lessonInfo = createSubjectType(el)

                return (
                  <Paper
                    key={el._id}
                    className={`schedule-add-modal__several-subjects`}
                    onClick={() =>
                      onSeveralLessonClick(
                        { date: el.date, number: el.subjectNumber },
                        { ...el, type: lessonInfo.type },
                      )
                    }>
                    <div>{`${el.name} (${lessonInfo.type})`}</div>
                    <div>{`${el.teacher.lastName} ${el.teacher.firstName[0]}.${el.teacher.middleName[0]}.`}</div>
                    <div>
                      <span>{`(${el.remark}) `}</span>
                      <span>{`${el.auditory.name} ауд.`}</span>
                    </div>
                  </Paper>
                )
              })}
              <Paper
                className="schedule-add-modal__several-subjects--new"
                onClick={onAddSeveralLesson}
                /* onClick={() =>
                  onSeveralLessonClick(
                    { date: selectedDate.date, number: selectedDate.number },
                    { ...el, type: lessonInfo.type },
                  )
                } */
              >
                Додати
              </Paper>
            </FormControl>
          </Box>
        </div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <StyledClosedButton onClick={onCloseModal}>Закрити</StyledClosedButton>
        {/* <Button onClick={onCloseModal}>Зберегти</Button> */}
      </DialogActions>
    </Dialog>
  )
}

export default ScheduleSeveralSubjects
