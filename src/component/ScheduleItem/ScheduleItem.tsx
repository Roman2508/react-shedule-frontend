import React from 'react'
import moment from 'moment'
import Paper from '@mui/material/Paper'
import { ActiveFilterType, lessonsType, selectedSubjectType } from '../../redux/lessons/lessonsTypes'
import { createSubjectType } from '../ScheduleAddModal/ScheduleSeveralSubjects'
import { selectLessons } from '../../redux/lessons/lessonsSelector'
import { useSelector } from 'react-redux'
import { LessonsListItemType, SelectedDistributedLoadType } from '../../redux/distributedLoad/distributedLoadTypes'
import { setDublicatedLessonItems } from '../../utils/setDublicatedLessonItems'

type DayItemType = {
  data: moment.Moment
  end: string
  start: string
}

export type LessonsListType = {
  items: lessonsType[]
  count: number
  subjectNumber: number
  date: string
}

type ScheduleItemPropsType = {
  dayItem: DayItemType[][]
  lessons: [] | lessonsType[]
  handleCloseModal: () => void
  selected: selectedSubjectType
  activeLessonsFilter: ActiveFilterType
  setActionType: (value: string) => void
  setSelected: (value: selectedSubjectType) => void
  selectedDistributedLoad: SelectedDistributedLoadType[]
  setOpenSeveralSubjectsModal: (value: boolean) => void
  setSameTimeSeveralSubjects: (value: lessonsType[]) => void
  setSelectedLessonItem: (value: lessonsType | null) => void
  onSelectDate: (data: { date: string; number: number }) => void
  setSelectedDay: (data: { date: string; number: number }) => void
}

const ScheduleItem: React.FC<ScheduleItemPropsType> = ({
  dayItem,
  lessons,
  selected,
  setSelected,
  onSelectDate,
  setActionType,
  setSelectedDay,
  activeLessonsFilter,
  setSelectedLessonItem,
  selectedDistributedLoad,
  setSameTimeSeveralSubjects,
  setOpenSeveralSubjectsModal,
}) => {
  const [lessonsList, setLessonsList] = React.useState<LessonsListType[]>([])

  const { currentAuditoryLessons, currentGroupLessons, currentTeacherLessons } = useSelector(selectLessons)

  React.useEffect(() => {
    const dublicatedItems = setDublicatedLessonItems(lessons)

    setLessonsList(dublicatedItems)
  }, [lessons])

  const onClickEmptyItem = (date: string, number: number, item: DayItemType) => {
    // Перевірка чи було клікнуто на shedule item в якому вже стоїть дисипліна, групи в потоці
    let isOverlay = currentGroupLessons.find(
      (lesson) => lesson.date >= item.start && lesson.date <= item.end && lesson.subjectNumber === number,
    )!!

    // Перевірка чи було клікнуто на shedule item в якому вже стоїть дисипліна викладача
    if (!isOverlay) {
      isOverlay = currentTeacherLessons.find(
        (lesson) => lesson.date >= item.start && lesson.date <= item.end && lesson.subjectNumber === number,
      )!!
    }

    // Якщо є накладка то modalMain не відкривається
    if (isOverlay) {
      return
    }

    // Перевірка, чи було клікнуто на пустий елемент
    const isEmpty = lessons.find(
      (lesson) => lesson.date >= item.start && lesson.date <= item.end && lesson.subjectNumber === number,
    )!!

    if (!isEmpty) {
      setActionType('add')

      const findedLessons = lessons.find((el) => {
        return (
          el.name === selected?.data?.name &&
          el.remark === selected.data?.remark &&
          el.subjectType === selected.data.type
        )
      })

      if (findedLessons) {
        const { type } = createSubjectType(findedLessons)

        setSelectedLessonItem({ ...findedLessons, type })
      }

      onSelectDate({ date, number })
    }
  }

  const onClickScheduleItem = (lesson: lessonsType, date: string, subjectNumber: number) => {
    const data = {
      name: lesson.name,
      type: lesson.subjectType || '',
      remark: lesson.remark,
      teacher: lesson.teacher,
      hours: lesson.hours,
      groupId: lesson.groupId,
      students: lesson.students,
    }

    handleOpenSeveralModal(
      lesson,
      { date, subjectNumber },
      { data, subjectId: lesson._id, groupId: lesson.groupId, stream: null }, // ????????????? null ?????????????
    )
  }

  // Перевірка чи було обрано підгрупу
  const handleOpenSeveralModal = (
    lesson: lessonsType,
    dateInfo: { date: string; subjectNumber: number },
    selectedSubjects: selectedSubjectType,
  ) => {
    // @ts-ignore
    setSelected((prev) => {
      // Якщо було брано іншу підгрупу
      if (lesson.remark.includes('підгр.') && prev.data?.remark.includes('підгр.')) {
        if (prev.data?.remark !== lesson.remark) {
          setActionType('add')

          // @ts-ignore
          setSameTimeSeveralSubjects(() => {
            const severalSubjects = lessons
              .map((el) => {
                if (String(el.date) === String(dateInfo.date) && el.subjectNumber === dateInfo.subjectNumber) {
                  return el
                }

                return
              })
              .filter((el) => el !== undefined)

            return severalSubjects
          })
          setOpenSeveralSubjectsModal(true)

          setSelectedDay({ date: dateInfo.date, number: dateInfo.subjectNumber })

          return prev
        }
        // Якщо було брано одну й ту саму підгрупу

        setActionType('update')

        // Встановити дату та номер пари і відкрити модальне вікно
        onSelectDate({ date: dateInfo.date, number: dateInfo.subjectNumber })

        setSelectedLessonItem(lesson)

        return { ...selectedSubjects }
      } else {
        // Встановити дату та номер пари і відкрити модальне вікно
        onSelectDate({ date: dateInfo.date, number: dateInfo.subjectNumber })

        setActionType('update')

        setSelectedLessonItem(lesson)

        const streamInfo = selectedDistributedLoad.find(
          (el) => el.name === lesson.name && el.type === lesson.subjectType,
        )?.stream

        return { ...selectedSubjects, stream: streamInfo || null }
      }
    })
  }

  return (
    <>
      {dayItem.map((el, index: number) => {
        return (
          <div className="schedule-page__day-wrapper" key={index}>
            {el.map((item, index) => {
              return (
                <Paper
                  key={index}
                  className={`schedule-page__schedule-item schedule-page__schedule-item--light`}
                  onClick={() => onClickEmptyItem(item.start, index + 1, item)}>
                  <>
                    {lessonsList
                      .filter((lesson) => lesson.date >= item.start && lesson.date <= item.end)
                      .map((lesson) => {
                        return (
                          lesson.subjectNumber === index + 1 && (
                            <React.Fragment key={lesson.date + lesson.subjectNumber}>
                              {lesson.items.map((el) => {
                                const lessonInfo = createSubjectType(el)

                                const isItemSelected =
                                  selected.data?.name === el.name &&
                                  selected.data?.remark === el.remark &&
                                  selected.data?.type === el.subjectType

                                if (lesson.count === 1) {
                                  // Якщо стоїть 1 дисципліна
                                  return (
                                    <div
                                      key={el.name + el.remark + el.subjectNumber + el.date}
                                      onClick={() =>
                                        onClickScheduleItem({ ...el, type: lessonInfo.type }, item.start, index + 1)
                                      }
                                      className={`schedule-page__lesson ${lessonInfo.lessonSubjectTypeClass} ${
                                        isItemSelected ? 'schedule-page__selected' : ''
                                      }`}>
                                      {/*  */}

                                      <p>{`${el.name} (${lessonInfo.type})`}</p>
                                      <p>{`${el.teacher.lastName} ${el.teacher.firstName[0]}.${el.teacher.middleName[0]}.`}</p>
                                      <p>{`${el.auditory.name}`}</p>
                                      {el.remark !== '-' && <p>{`${el.remark}`}</p>}
                                      {/*  */}
                                    </div>
                                  )
                                } else if (lesson.count === 2) {
                                  // Якщо одночасно стоїть 2 дисципліни
                                  return (
                                    <div
                                      key={el.name + el.remark + el.subjectNumber + el.date + el.groupId}
                                      onClick={() =>
                                        onClickScheduleItem({ ...el, type: lessonInfo.type }, item.start, index + 1)
                                      }
                                      className={`schedule-page__two-lessons ${lessonInfo.lessonSubjectTypeClass} ${
                                        isItemSelected ? 'schedule-page__selected' : ''
                                      }`}>
                                      {/*  */}

                                      <span>{`${el.name} (${lessonInfo.type}) `}</span>
                                      <span>{`${el.teacher.lastName} ${el.teacher.firstName[0]}.${el.teacher.middleName[0]}.`}</span>
                                      <span>{`${el.auditory.name} `}</span>
                                      {el.remark !== '-' && <span>{`(${el.remark})`}</span>}
                                      {/*  */}
                                    </div>
                                  )
                                } else if (lesson.count === 3) {
                                  // Якщо одночасно стоїть 3 дисципліни
                                  return (
                                    <div
                                      key={el.name + el.remark + el.subjectNumber + el.date + el.groupId}
                                      onClick={() =>
                                        onClickScheduleItem({ ...el, type: lessonInfo.type }, item.start, index + 1)
                                      }
                                      className={`schedule-page__three-lessons ${lessonInfo.lessonSubjectTypeClass} ${
                                        isItemSelected ? 'schedule-page__selected' : ''
                                      }`}>
                                      {/*  */}

                                      <span>{`${el.name} (${lessonInfo.type}) `}</span>
                                      <span>{`${el.teacher.lastName} ${el.teacher.firstName[0]}.${el.teacher.middleName[0]}.`}</span>
                                      <span>{`${el.auditory.name} `}</span>
                                      {el.remark !== '-' && <span>{`(${el.remark})`}</span>}
                                      {/*  */}
                                    </div>
                                  )
                                } else if (lesson.count === 4) {
                                  // Якщо одночасно стоїть 4 дисципліни
                                  return (
                                    <div
                                      key={el.name + el.remark + el.subjectNumber + el.date + el.groupId}
                                      onClick={() =>
                                        onClickScheduleItem({ ...el, type: lessonInfo.type }, item.start, index + 1)
                                      }
                                      className={`schedule-page__four-lessons ${lessonInfo.lessonSubjectTypeClass} ${
                                        isItemSelected ? 'schedule-page__selected' : ''
                                      }`}>
                                      {/*  */}

                                      <span>{`${el.name} (${lessonInfo.type}) `}</span>
                                      <span>{`${el.teacher.lastName} ${el.teacher.firstName[0]}.${el.teacher.middleName[0]}.`}</span>
                                      <span>{`${el.auditory.name} `}</span>
                                      {el.remark !== '-' && <span>{`(${el.remark})`}</span>}
                                      {/*  */}
                                    </div>
                                  )
                                }
                              })}
                            </React.Fragment>
                          )
                        )
                      })}
                    {/*  */}
                    {/*  */}
                    {/*  */}
                    {currentTeacherLessons
                      .filter((lessonOverlay) => lessonOverlay.date >= item.start && lessonOverlay.date <= item.end)
                      .map((lessonOverlay) => {
                        const lessonOverlayInfo = createSubjectType(lessonOverlay)

                        const groupName = lessonOverlay.groupName

                        return (
                          lessonOverlay.subjectNumber === index + 1 && (
                            <p
                              key={lessonOverlay._id}
                              style={{
                                padding: '1px 3px',
                                color: 'red',
                                fontSize: '12px',
                              }}>
                              {`${lessonOverlay.teacher.lastName} ${lessonOverlay.teacher.firstName[0]}.${
                                lessonOverlay.teacher.middleName[0]
                              }. 
                              ${groupName} ${lessonOverlay.remark !== '-' ? `(${lessonOverlay.remark})` : ''} 
                              ${lessonOverlay.name} (${lessonOverlayInfo.type}). 
                              Аудиторія: ${lessonOverlay.auditory.name}`}
                            </p>
                          )
                        )
                      })}

                    {currentGroupLessons
                      .filter((lessonOverlay) => lessonOverlay.date >= item.start && lessonOverlay.date <= item.end)
                      .map((lessonOverlay) => {
                        const lessonOverlayInfo = createSubjectType(lessonOverlay)

                        const groupName = lessonOverlay.groupName

                        return (
                          lessonOverlay.subjectNumber === index + 1 && (
                            <p
                              key={lessonOverlay._id}
                              style={{
                                padding: '1px 3px',
                                color: 'red',
                                fontSize: '12px',
                              }}>
                              {`${lessonOverlay.teacher.lastName} ${lessonOverlay.teacher.firstName[0]}.${
                                lessonOverlay.teacher.middleName[0]
                              }. 
                              ${groupName} ${lessonOverlay.remark !== '-' ? `(${lessonOverlay.remark})` : ''} 
                              ${lessonOverlay.name} (${lessonOverlayInfo.type}). 
                              Аудиторія: ${lessonOverlay.auditory.name}`}
                            </p>
                          )
                        )
                      })}

                    {/*  */}
                    {/*  */}
                    {/*  */}
                  </>
                </Paper>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

export default React.memo(ScheduleItem)
