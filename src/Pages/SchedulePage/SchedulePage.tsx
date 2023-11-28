import qs from 'qs'
import React from 'react'
import moment from 'moment'
import Paper from '@mui/material/Paper'
import { useSelector } from 'react-redux'
import Tooltip from '@mui/material/Tooltip'
import { useLocation, useNavigate } from 'react-router-dom'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EmptyGroupsIcon from '@mui/icons-material/ContentPasteSearchOutlined'

import './SchedulePage.scss'
import {
  ActiveFilterType,
  lessonsType,
  SelectedAuditoryScheduleType,
  SelectedGroupScheduleType,
  selectedSubjectType,
  SelectedTeacherScheduleType,
} from '../../redux/lessons/lessonsTypes'
import {
  checkAuditoryOverlay,
  getAuditoryLessons,
  getGroupLessons,
  getLessonsById,
  getTeacherLessons,
} from '../../redux/lessons/lessonsAsyncActions'
import { useAppDispatch } from '../../redux/store'
import { GroupType } from '../../redux/group/groupTypes'
import { StyledCopyLessonsButton } from '../../theme'
import CircularProgress from '@mui/material/CircularProgress'
import CircularPreloader from '../../component/CircularPreloader'
import { selectLessons } from '../../redux/lessons/lessonsSelector'
import ScheduleItem from '../../component/ScheduleItem/ScheduleItem'
import { getAllFacultyGroups } from '../../redux/group/groupAsyncAction'
import { selectFaculties } from '../../redux/faculties/facultiesSelectors'
import { getAllFaculties } from '../../redux/faculties/facultiesAsyncAction'
import { changeFilterType, clearCurrentGroupLessons } from '../../redux/lessons/lessonsSlice'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import SchedulePageHeader from '../../component/SchedulePageHeader/SchedulePageHeader'
import ScheduleAddModalMain from '../../component/ScheduleAddModal/ScheduleAddModalMain'
import { selectDistributedLoad } from '../../redux/distributedLoad/distributedLoadSelector'
import { getDistributedLoad, getDistributedTeacherLoad } from '../../redux/distributedLoad/distributedLoadAsyncAction'
import ScheduleSubjectsList from '../../component/ScheduleSubjectsList/ScheduleSubjectsList'
import ScheduleSeveralSubjects from '../../component/ScheduleAddModal/ScheduleSeveralSubjects'
import { selectBuildings } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsSelector'
import { getAllDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import { getAllBuildings } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsAsyncAction'
import { selectTeachersAndDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentSelector'
import { DistributedStreamType, SelectedDistributedLoadType } from '../../redux/distributedLoad/distributedLoadTypes'
import { selectAlerts } from '../../redux/appSelectors'
import { setShowError } from '../../redux/alerts/alertsSlise'
import AlertMessage from '../../component/AlertMessage'
import { calcCurrentSemester } from '../../utils/calcCurrentSemester'
import { CopyTheSchedule } from '../../component/CopyTheSchedule/CopyTheSchedule'
import { FacultyType } from '../../redux/faculties/facultiesTypes'
import { AppLoadingStatusTypes } from '../../redux/appTypes'
import createSelectedSchedule from '../../utils/createSelectedSchedule'
import { selectGroups } from '../../redux/group/groupSelector'
import { createSelectedDistributedLoad } from '../../utils/createSelectedDistributedLoad'
import convertTeacherLoadToDistributedLoad from '../../utils/convertTeacherLoadToDistributedLoad'

// window.moment = moment

type SchedulePagePropsType = {}

const SchedulePage: React.FC<SchedulePagePropsType> = ({}) => {
  moment.updateLocale('en', {
    week: { dow: 1 },
    weekdays: {
      standalone: 'Неділя_Понеділок_Вівторок_Среда_Четвер_П`ятниця_Субота'.split('_'),
      format: 'Воскресенье_Понедельник_Вторник_Среду_Четверг_Пятницу_Субботу'.split('_'),
      isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/,
    },
  })

  // ///////////////////////////////////////////
  // ///////////////////////////////////////////
  // ///////////////////////////////////////////
  const dispatch = useAppDispatch()

  const location = useLocation()
  const navigate = useNavigate()

  const isRendered = React.useRef(false)

  const alertInfo = useSelector(selectAlerts)
  const { buildings } = useSelector(selectBuildings)
  const { faculties } = useSelector(selectFaculties)
  const { institution, userData } = useSelector(selectAuthData)
  const { departments } = useSelector(selectTeachersAndDepartments)
  const { fullTimeGroups, partTimeGroups } = useSelector(selectGroups)
  const { load: distributedLoad, loadingStatus } = useSelector(selectDistributedLoad)
  const { lessons, currentTeacherLessons, currentAuditoryLessons, filterType } = useSelector(selectLessons)

  // Вибраний семестр
  const [selectedSemester, setSelectedSemester] = React.useState('')

  const [selectedDistributedLoad, setSelectedDistributedLoad] = React.useState<SelectedDistributedLoadType[] | []>([])

  const [openModal, setOpenModal] = React.useState(false)
  const [openSeveralSubjectsModal, setOpenSeveralSubjectsModal] = React.useState(false)

  const [sameTimeSeveralSubjects, setSameTimeSeveralSubjects] = React.useState<lessonsType[]>([])

  const [selectedSubjectStreamInfo, setSelectedSubjectStreamInfo] = React.useState<DistributedStreamType | null>(null)

  const [openCopyTheScheduleModal, setOpenCopyTheScheduleModal] = React.useState(false)

  // Визначає, вибраний елемент розкладу буде створено чи оновлено
  const [actionType, setActionType] = React.useState('')

  const [activeLessonsFilter, setActiveLessonsFilter] = React.useState<ActiveFilterType>({
    id: 0,
    value: 'Група',
    type: 'groupId',
  })

  const [selectedGroupYearsOfAdmission, setSelectedGroupYearsOfAdmission] = React.useState<string | null>(null)

  // Розклад вибраної групи
  const [selectedGroupSchedule, setSelectedGroupSchedule] = React.useState<SelectedGroupScheduleType>({
    selectedFacultieGroups: [],
    groupId: '',
    groupName: '',
    facultieName: '',
    facultieId: '',
  })

  // Розклад вибраного викладача
  const [selectedTeacherSchedule, setSelectedTeacherSchedule] = React.useState<SelectedTeacherScheduleType>({
    selectedDepartmentTeachers: [],
    teacherId: '',
    teacherName: '',
    departmentName: '',
    departmentId: '',
  })

  // Розклад вибраної аудиторії
  const [selectedAuditorySchedule, setSelectedAuditorySchedule] = React.useState<SelectedAuditoryScheduleType>({
    selectedBuildingAuditories: [],
    auditoryId: '',
    auditoryName: '',
    buildingName: '',
    buildingId: '',
  })

  // ///////////////////////////////////////////
  const [selected, setSelected] = React.useState<selectedSubjectType>({
    data: null,
    stream: null,
    groupId: '',
    subjectId: '',
  })

  const [selectedDate, setSelectedDay] = React.useState({
    date: '1',
    number: 1,
  })

  // Вибрана дисципліна
  const [selectedLessonItem, setSelectedLessonItem] = React.useState<lessonsType | null>(null)

  //////////////////////////////////////////////
  //////////////////////////////////////////////
  //////////////////////////////////////////////

  // При першому рендері отримую корпуси та кафедри та встановлюю вибраний семестр
  React.useEffect(() => {
    if (institution) {
      const fetchData = async () => {
        dispatch(getAllBuildings(institution._id))
        dispatch(getAllDepartments(institution._id))

        const { payload } = await dispatch(getAllFaculties(institution._id))

        if (globalThis.location.search) {
          const params = qs.parse(globalThis.location.search.substring(1))

          if (!params.division) {
            return
          }

          if (params.scheduleType === 'groupId') {
            // Якщо є параметри в URL та було обрано розклад групи - отримую всі групи обраного факультету
            dispatch(getAllFacultyGroups(String(params.division)))
          } else {
            // Якщо є параметри в URL та було обрано розклад викладача або аудиторії - отримую групи першого факультету в списку
            dispatch(getAllFacultyGroups(payload[0]._id))
          }
          //
        } else {
          // Якщо параметри в URL відсутні - отримую групи першого факультету в списку
          dispatch(getAllFacultyGroups(payload[0]._id))
        }
      }

      fetchData()
    }
  }, [institution])

  //////////////////////////////////////////////
  //////////////////////////////////////////////
  //////////////////////////////////////////////

  // При першому рендері перевіряю чи є в URL параметри, якщо є - встановлюю вибрану групу / викладача / аудиторію
  // dispatch active filter
  React.useEffect(() => {
    if (globalThis.location.search) {
      // Вирізаю ? з рядка параметрів за допомогою .substring(1)
      const params = qs.parse(globalThis.location.search.substring(1))

      if (!params.division && !params.id) {
        return
      }

      let currentFilter: ActiveFilterType = {
        id: 0,
        value: 'Група',
        type: 'groupId',
      }

      if (params.scheduleType === 'groupId' && institution) {
        currentFilter = {
          id: 0,
          value: 'Група',
          type: 'groupId',
        }

        // Шукаю обраний факультет
        const currentFacultie = faculties.find((el: FacultyType) => el._id === params.division)

        if (!fullTimeGroups || !partTimeGroups) {
          return
        }

        const groupList = [...fullTimeGroups, ...partTimeGroups]

        if (groupList && currentFacultie) {
          const selectedFacultieGroups: string[] = groupList.map((el: GroupType) => el.name)

          const selectedGroup = groupList.find((el: GroupType) => el._id === params.id)

          if (!selectedGroup) {
            return
          }

          setSelectedGroupYearsOfAdmission(selectedGroup.yearOfAdmission)

          const currentSelectedSchedule = {
            selectedItems: selectedFacultieGroups,
            id: String(params.id),
            name: selectedGroup.name,
            divisionName: currentFacultie.name,
            divisionId: currentFacultie._id,
            type: 'groupId',
          }

          dispatch(changeFilterType(currentSelectedSchedule))
        }
      } else if (params.scheduleType === 'auditory') {
        // Встановлюю рік вступу
        if (fullTimeGroups && partTimeGroups) {
          const groupsList = [...fullTimeGroups, ...partTimeGroups]

          setSelectedGroupYearsOfAdmission(groupsList[0].yearOfAdmission)
        }

        //

        currentFilter = {
          id: 2,
          value: 'Аудиторія',
          type: 'auditory',
        }

        if (buildings !== null && buildings.length) {
          const currentBuilding = buildings.find((el) => String(el._id) === String(params.division))

          if (currentBuilding) {
            const allSelectedAuditoriesNames = currentBuilding.auditoriums.map((el) => el.name)
            const currentAuditory = currentBuilding.auditoriums.find((el) => String(el._id) === String(params.id))

            if (currentAuditory) {
              const currentSelectedAuditory = {
                selectedItems: allSelectedAuditoriesNames,
                id: String(params.id),
                name: currentAuditory.name,
                divisionName: currentBuilding.name,
                divisionId: currentBuilding._id,
                type: 'auditory',
              }

              dispatch(changeFilterType(currentSelectedAuditory))
            }
          }
        }
      } else if (params.scheduleType === 'teacher') {
        // Встановлюю рік вступу

        if (fullTimeGroups && partTimeGroups) {
          const groupsList = [...fullTimeGroups, ...partTimeGroups]

          if (groupsList.length) setSelectedGroupYearsOfAdmission(groupsList[0].yearOfAdmission)
        }

        currentFilter = {
          id: 1,
          value: 'Викладач',
          type: 'teacher',
        }

        if (departments !== null && departments.length) {
          const currentDepartment = departments.find((el) => String(el._id) === String(params.division))
          if (!currentDepartment) {
            return
          }

          const allSelectedAuditoriesNames = currentDepartment.teachers.map((el) => {
            const teacherName = `${el.lastName} ${el.firstName[0]}.${el.middleName[0]}.`

            return teacherName
          })

          const currentTeacher = currentDepartment.teachers.find((el) => String(el._id) === String(params.id))

          if (!currentTeacher) {
            return
          }

          const currentTeacherName = `${currentTeacher.lastName} ${currentTeacher.firstName[0]}.${currentTeacher.middleName[0]}.`

          const currentSelectedAuditory = {
            selectedItems: allSelectedAuditoriesNames,
            id: String(params.id),
            name: currentTeacherName,
            divisionName: currentDepartment.name,
            divisionId: currentDepartment._id,
            type: 'teacher',
          }

          dispatch(changeFilterType(currentSelectedAuditory))
        }
      }

      setActiveLessonsFilter(currentFilter)

      isRendered.current = true
    }
  }, [institution, departments, buildings, faculties, fullTimeGroups, partTimeGroups])

  // Якщо немає параметрів в URL - оримую всі факультети та групи факультету
  React.useEffect(() => {
    if (!isRendered.current) {
      if (institution && userData) {
        const fetchFaculties = async () => {
          // const { payload } = await dispatch(getAllFaculties(institution._id))

          if (faculties.length) {
            setSelectedGroupSchedule((prev: SelectedGroupScheduleType) => {
              const updatedObj = {
                ...prev,
                facultieName: faculties[0].name,
                facultieId: faculties[0]._id,
              }

              return updatedObj
            })
          }

          // const allFacultieResponse = await dispatch(getAllFacultyGroups(payload[0]._id))

          if (fullTimeGroups && partTimeGroups) {
            const groupsList = [...fullTimeGroups, ...partTimeGroups]

            const getDistributedLoadPayload = {
              groupId: groupsList[0]._id,
              userId: userData._id,
            }
            await dispatch(getDistributedLoad(getDistributedLoadPayload))

            const groupList = groupsList.map((el: GroupType) => el.name)

            // if (payload.length) {
            // @ts-ignore
            setSelectedGroupSchedule((prev: SelectedGroupScheduleType) => {
              const updatedObj = {
                ...prev,
                selectedFacultieGroups: [...groupList],
                groupId: groupsList[0]._id,
                groupName: groupsList[0].name,
              }

              return updatedObj
            })
            // }

            setSelectedGroupYearsOfAdmission(groupsList[0].yearOfAdmission)
          }
        }
        fetchFaculties()
      }
    }

    isRendered.current = false
  }, [institution, userData, faculties, fullTimeGroups, partTimeGroups])

  // В залежності від filterType змінюю setSelectedGroupSchedule / setSelectedAuditorySchedule / setSelectedTeacherSchedule
  React.useEffect(() => {
    if (filterType.id) {
      if (filterType.type === 'groupId') {
        const selectedGroupData = createSelectedSchedule(filterType, 'groupId')
        // @ts-ignore
        setSelectedGroupSchedule(selectedGroupData)
      }
      if (filterType.type === 'teacher') {
        const selectedTeacherData = createSelectedSchedule(filterType, 'teacher')

        // @ts-ignore
        setSelectedTeacherSchedule(selectedTeacherData)
      }
      if (filterType.type === 'auditory') {
        const selectedAuditoryData = createSelectedSchedule(filterType, 'auditory')
        // @ts-ignore
        setSelectedAuditorySchedule(selectedAuditoryData)
      }
    }
  }, [filterType])

  // Вшиваю параметри сортування розкладу в URL
  React.useEffect(() => {
    if (institution) {
      let id = ''
      let division = ''

      if (activeLessonsFilter.type === 'groupId') {
        id = selectedGroupSchedule.groupId
        division = selectedGroupSchedule.facultieId
      }
      if (activeLessonsFilter.type === 'auditory') {
        id = selectedAuditorySchedule.auditoryId
        division = selectedAuditorySchedule.buildingId
      }
      if (activeLessonsFilter.type === 'teacher') {
        id = selectedTeacherSchedule.teacherId
        division = selectedTeacherSchedule.departmentId
      }

      const queryString = qs.stringify({
        scheduleType: activeLessonsFilter.type,
        division,
        id,
      })

      navigate(`?${queryString}`)
    }
  }, [
    // buildings,
    // institution,
    // departments,
    activeLessonsFilter.type,
    selectedGroupSchedule.groupId,
    selectedAuditorySchedule.auditoryId,
    selectedTeacherSchedule.teacherId,
  ])

  /* Не ставиться дисципліна, що об'єднана в потік (Якщо ставити через вкладку "аудиторія" (не ставиться для всіх груп крім вибраної)) */
  /* Не ставиться дисципліна, що об'єднана в потік (Якщо ставити через вкладку "аудиторія" (не ставиться для всіх груп крім вибраної)) */
  /* Не ставиться дисципліна, що об'єднана в потік (Якщо ставити через вкладку "аудиторія" (не ставиться для всіх груп крім вибраної)) */
  /* Не ставиться дисципліна, що об'єднана в потік (Якщо ставити через вкладку "аудиторія" (не ставиться для всіх груп крім вибраної)) */
  /* Не ставиться дисципліна, що об'єднана в потік (Якщо ставити через вкладку "аудиторія" (не ставиться для всіх груп крім вибраної)) */
  /* Не ставиться дисципліна, що об'єднана в потік (Якщо ставити через вкладку "аудиторія" (не ставиться для всіх груп крім вибраної)) */

  // Визначаю чи хоча б 1 дисципліна об'єднана в потік. Якщо об'єднана - отримую розклад груп потоку
  React.useEffect(() => {
    if (selected.stream !== null) {
      const unitedSubjects = selectedDistributedLoad.filter((el) => el.stream !== null)

      Promise.all(
        unitedSubjects.map(async (el) => {
          const streamGroups = el.stream?.groups

          streamGroups?.map((g) => {
            if ((g !== distributedLoad?.groupId, institution)) {
              const groupPayload = { id: g, type: 'groupId', institutionId: institution._id }
              dispatch(getGroupLessons(groupPayload))
              // Можливо, якщо в потоці більше 2 груп, розклад одної буде перезаписувати іншу !!!!!
            }
          })
        })
      )
    } else {
      dispatch(clearCurrentGroupLessons())
    }
  }, [selectedDistributedLoad, selected])

  //
  // Отримую розклад вибраної групи для перевірок накладок (при перегляді розкладу викладача)
  React.useEffect(() => {
    if (activeLessonsFilter.value === 'Викладач' || activeLessonsFilter.value === 'Аудиторія') {
      if (selected.data && institution) {
        const groupPayload = {
          id: selected.data.groupId,
          type: 'groupId',
          institutionId: institution._id,
        }

        dispatch(getGroupLessons(groupPayload))
      }
    }
  }, [selected])

  //
  // Отримую всі ід аудиторій які стоять в вибраний час
  React.useEffect(() => {
    if (institution && selectedSemester) {
      const payload = {
        semester: String(selectedSemester),
        date: selectedDate.date,
        subjectNumber: selectedDate.number,
        institutionId: institution._id,
      }
      dispatch(checkAuditoryOverlay(payload))
    }
  }, [selectedDate, institution, selectedSemester])

  //
  // Отримую розклад вибраної аудиторії (для перевірки накладок) при першому рендері
  React.useEffect(() => {
    if (buildings.length && institution) {
      const auditoryPayload = {
        id: String(buildings[0].auditoriums[0]._id),
        type: 'auditory',
        institutionId: institution._id,
      }
      dispatch(getAuditoryLessons(auditoryPayload))
    }
  }, [buildings])

  //
  // Отримую розклад вибраного викладача (для перевірки накладок)
  React.useEffect(() => {
    if (selected.data?.teacher._id && institution) {
      const teacherPayload = { id: String(selected.data.teacher._id), type: 'teacher', institutionId: institution._id }
      dispatch(getTeacherLessons(teacherPayload))
    }
  }, [selected.data?.teacher._id, selected.data?.teacher])

  //
  React.useEffect(() => {
    if (distributedLoad) {
      const selectedStreamInfo = selectedDistributedLoad.find(
        (el) => el.name === selected.data?.name && el.type === selected.data?.type
      )
      ///////////////////////////////////////////////////
      if (selectedStreamInfo) {
        setSelectedSubjectStreamInfo(selectedStreamInfo.stream)
      }
    }
  }, [selected])

  //////////////////////////////////////////////
  //////////////////////////////////////////////
  //////////////////////////////////////////////

  React.useEffect(() => {
    if (userData && institution && selectedGroupYearsOfAdmission) {
      const showedSemester = institution.settings.currentShowedYear

      const semester = calcCurrentSemester(
        showedSemester,
        selectedGroupYearsOfAdmission,
        userData.settings.selectedSemester
      )

      if (semester) {
        setSelectedSemester(semester)
      }
    }
  }, [userData, institution, selectedGroupYearsOfAdmission])

  // Отримую розклад Групи / Викладача / Аудиторії
  React.useEffect(() => {
    if (activeLessonsFilter.value === 'Група') {
      if (selectedGroupSchedule.groupId && institution) {
        dispatch(
          getLessonsById({
            id: selectedGroupSchedule.groupId,
            type: activeLessonsFilter.type,
            institutionId: institution._id,
          })
        )
      }
    }
    if (activeLessonsFilter.value === 'Викладач') {
      if (selectedTeacherSchedule.teacherId && institution) {
        dispatch(
          getLessonsById({
            id: selectedTeacherSchedule.teacherId,
            type: activeLessonsFilter.type,
            institutionId: institution._id,
          })
        )
      }
    }
    if (activeLessonsFilter.value === 'Аудиторія') {
      if (selectedAuditorySchedule.auditoryId && institution) {
        dispatch(
          getLessonsById({
            id: selectedAuditorySchedule.auditoryId,
            type: activeLessonsFilter.type,
            institutionId: institution._id,
          })
        )
      }
    }
  }, [selectedGroupSchedule, selectedTeacherSchedule, selectedAuditorySchedule, activeLessonsFilter])

  // Змінюю selectedDistributedLoad в залежності від activeLessonsFilter
  React.useEffect(() => {
    const fetchSelectedDistributedLoad = async () => {
      if (activeLessonsFilter.value === 'Група' && distributedLoad && selectedSemester) {
        const newDistributedLoad = createSelectedDistributedLoad(
          distributedLoad.load,
          selectedSemester,
          selectedGroupSchedule.groupName
        )

        setSelectedDistributedLoad(newDistributedLoad)
      }

      if (
        activeLessonsFilter.value === 'Викладач' &&
        selectedTeacherSchedule.teacherId &&
        institution &&
        selectedSemester
      ) {
        const { payload } = await dispatch(
          getDistributedTeacherLoad({
            currentShowedYear: institution.settings.currentShowedYear,
            teacher: selectedTeacherSchedule.teacherId,
          })
        )

        const newDistributedLoad = createSelectedDistributedLoad(
          payload,
          selectedSemester,
          selectedGroupSchedule.groupName
        )

        setSelectedDistributedLoad(newDistributedLoad)
      }

      if (activeLessonsFilter.value === 'Аудиторія') {
        const newDistributedLoad = convertTeacherLoadToDistributedLoad(currentAuditoryLessons)
        setSelectedDistributedLoad(newDistributedLoad)
      }
    }

    fetchSelectedDistributedLoad()
  }, [
    distributedLoad,
    activeLessonsFilter,
    selectedTeacherSchedule,
    currentAuditoryLessons,
    selectedSemester,
    institution,
  ])

  //////////////////////////////////////////////
  //////////////////////////////////////////////
  //////////////////////////////////////////////

  // Вибір дати
  const onSelectDate = (data: { date: string; number: number }) => {
    setSelectedDay(data)
    handleOpenModal()
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  // Нормер відкритого тижня (в семестрі)
  const [currentWeekNumber, setCurrentWeekNumber] = React.useState(0)

  if (!lessons || !institution || !userData) {
    return <CircularPreloader />
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  const termsOfStudy = institution.settings.termsOfStudy

  let start
  let end

  window.moment = moment

  // Вибрір поточного семестру
  if (selectedSemester === '1' || selectedSemester === '3' || selectedSemester === '5' || selectedSemester === '7') {
    start = moment.unix(termsOfStudy.firstSemester.start)
    end = moment.unix(termsOfStudy.firstSemester.end)
  } else {
    start = moment.unix(termsOfStudy.secondSemester.start)
    end = moment.unix(termsOfStudy.secondSemester.end)
  }

  const weeks: any[] = []

  const week = start.clone()

  // Створюю масив тижнів від початку семестру до кінця
  while (!week.isAfter(end.clone().add(1, 'week'))) {
    const days: any[] = []

    const day = week.clone().startOf('week')

    while (!day.isAfter(week.endOf('week').subtract(1, 'day'))) {
      days.push(day.clone())
      day.add(1, 'day')
    }

    const dayItem = days.map((el, index) => {
      const data = el
      const start = data.clone().format('X')
      const end = data.clone().endOf('day').format('X')
      return [...Array(7).fill({ data, start, end, number: index + 1 })]
    })

    weeks.push(dayItem)
    week.add(1, 'week')
  }

  const isCurrentDay = (day: any) => moment().isSame(day, 'day')

  const currentWeekNumberHandler = (type: string, max: number) => {
    // @ts-ignore
    setCurrentWeekNumber((prev) => {
      if (type === 'prev' && prev !== 0) {
        return prev - 1
      } else if (type === 'next' && prev !== max) {
        return prev + 1
      } else {
        return prev
      }
    })
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* коли відкритий розклад аудиторії потрібно в ScheduleSubjectsList підвантажувати список дисциплін цієї аудиторії */
  /* коли відкритий розклад аудиторії потрібно в ScheduleSubjectsList підвантажувати список дисциплін цієї аудиторії */
  /* коли відкритий розклад аудиторії потрібно в ScheduleSubjectsList підвантажувати список дисциплін цієї аудиторії */

  return (
    <>
      {location.pathname === '/schedule' && (
        <div className="schedule-page__copy-btn">
          <Tooltip title="Копіювання розкладу">
            <StyledCopyLessonsButton
              variant="contained"
              disabled={activeLessonsFilter.type !== 'groupId'}
              onClick={() => setOpenCopyTheScheduleModal(true)}
            >
              {/* Копіювання розкладу */}
              <ContentCopyIcon />
            </StyledCopyLessonsButton>
          </Tooltip>
        </div>
      )}

      <AlertMessage
        show={alertInfo.show}
        setShowError={setShowError}
        alertMessage={alertInfo.alertMessage}
        alertTitle={alertInfo.alertTitle}
        severity={alertInfo.severity}
      />

      <CopyTheSchedule
        weeks={weeks}
        institutionId={institution._id}
        selectedGroupId={selectedGroupSchedule.groupId}
        openCopyTheScheduleModal={openCopyTheScheduleModal}
        setOpenCopyTheScheduleModal={setOpenCopyTheScheduleModal}
      />

      <ScheduleAddModalMain
        selected={selected}
        openModal={openModal}
        userId={userData._id}
        actionType={actionType}
        selectedDate={selectedDate}
        institutionId={institution._id}
        handleOpenModal={handleOpenModal}
        handleCloseModal={handleCloseModal}
        selectedSemester={selectedSemester}
        currentWeekNumber={currentWeekNumber}
        selectedLessonItem={selectedLessonItem}
        groupName={selectedGroupSchedule.groupName}
        setSelectedLessonItem={setSelectedLessonItem}
        selectedSubjectStreamInfo={selectedSubjectStreamInfo}
      />

      <ScheduleSeveralSubjects
        selected={selected}
        setSelected={setSelected}
        onSelectDate={onSelectDate}
        selectedDate={selectedDate}
        openModal={openSeveralSubjectsModal}
        setOpenModal={setOpenSeveralSubjectsModal}
        setSelectedLessonItem={setSelectedLessonItem}
        handleOpenScheduleAddMainModal={handleOpenModal}
        sameTimeSeveralSubjects={sameTimeSeveralSubjects}
      />

      <div className="schedule-page">
        {/* shedule-header */}
        <SchedulePageHeader
          faculties={faculties}
          buildings={buildings}
          userId={userData._id}
          departments={departments}
          totalWeeksCount={weeks.length}
          selectedSemester={selectedSemester}
          currentWeekNumber={currentWeekNumber}
          setSelectedSemester={setSelectedSemester}
          activeLessonsFilter={activeLessonsFilter}
          setCurrentWeekNumber={setCurrentWeekNumber}
          selectedGroupSchedule={selectedGroupSchedule}
          setActiveLessonsFilter={setActiveLessonsFilter}
          selectedTeacherSchedule={selectedTeacherSchedule}
          currentWeekNumberHandler={currentWeekNumberHandler}
          selectedAuditorySchedule={selectedAuditorySchedule}
          selectedGroupYearsOfAdmission={selectedGroupYearsOfAdmission}
          setSelectedGroupYearsOfAdmission={setSelectedGroupYearsOfAdmission}
        />
        {/* // shedule-header */}
        <div className="schedule-page__wrapper">
          {/* SUBJECTS LIST */}
          <Paper className="schedule-page__subjects">
            {/* Schedule Table */}
            {loadingStatus === AppLoadingStatusTypes.LOADING && !selectedDistributedLoad.length ? (
              <div
                style={{
                  padding: '32px 0',
                  textAlign: 'center',
                }}
              >
                <CircularProgress size={38} />
              </div>
            ) : (
              <ScheduleSubjectsList
                lessons={lessons}
                selected={selected}
                setSelected={setSelected}
                loadingStatus={loadingStatus}
                selectedDistributedLoad={selectedDistributedLoad}
              />
            )}

            {/* // Schedule Table */}
          </Paper>
          {/* SUBJECTS LIST */}

          <Paper className="schedule-page__schedule-box">
            {/* NUMBER OF SUBJECT */}
            <div className="schedule-page__lesson-number-box">
              {[1, 2, 3, 4, 5, 6, 7].map((el) => (
                <Paper key={el} variant="outlined" className="schedule-page__lesson-number">
                  {el}
                </Paper>
              ))}
            </div>
            {/* NUMBER OF SUBJECT */}

            <div className="schedule-page__schedule">
              {/* DATE */}
              {weeks[currentWeekNumber].map((el: any) => (
                <Paper
                  key={el[0].data.unix()}
                  variant="outlined"
                  className={`schedule-page__day-item ${isCurrentDay(el[0].data) && 'current-day'}`}
                >
                  {el[0].data.format('dddd ')}
                  {el[0].data.format('DD.MM')}
                </Paper>
              ))}
              {/* DATE */}

              {/* SCHEDULE ITEM */}
              <ScheduleItem
                lessons={lessons}
                selected={selected}
                setSelected={setSelected}
                onSelectDate={onSelectDate}
                setActionType={setActionType}
                setSelectedDay={setSelectedDay}
                dayItem={weeks[currentWeekNumber]}
                handleCloseModal={handleCloseModal}
                activeLessonsFilter={activeLessonsFilter}
                setSelectedLessonItem={setSelectedLessonItem}
                selectedDistributedLoad={selectedDistributedLoad}
                setSameTimeSeveralSubjects={setSameTimeSeveralSubjects}
                setOpenSeveralSubjectsModal={setOpenSeveralSubjectsModal}
              />
              {/* SCHEDULE ITEM */}
            </div>
          </Paper>
        </div>
      </div>
    </>
  )
}

export default SchedulePage

// При першому рендері встановити обраний факультет та групу

// React.useEffect(() => {
//   if (institution && userData) {
//     try {
//       const fetchFaculties = async () => {
//         const { payload } = await dispatch(getAllFaculties(institution._id))

//         if (payload.length) {
//           setSelectedGroupSchedule((prev: SelectedGroupScheduleType) => {
//             const updatedObj = {
//               ...prev,
//               facultieName: payload[0].name,
//               facultieId: payload[0]._id,
//             }

//             return updatedObj
//           })
//         }

//         const allFacultieResponse = await dispatch(getAllFacultyGroups(payload[0]._id))

//         if (allFacultieResponse.payload.length) {
//           const getDistributedLoadPayload = {
//             groupId: allFacultieResponse.payload[0]._id,
//             userId: userData._id,
//           }
//           await dispatch(getDistributedLoad(getDistributedLoadPayload))

//           const groupList = allFacultieResponse.payload.map((el: GroupType) => el.name)

//           if (payload.length) {
//             // @ts-ignore
//             setSelectedGroupSchedule((prev: SelectedGroupScheduleType) => {
//               const updatedObj = {
//                 ...prev,
//                 selectedFacultieGroups: [...groupList],
//                 groupId: allFacultieResponse.payload[0]._id,
//                 groupName: allFacultieResponse.payload[0].name,
//               }

//               return updatedObj
//             })
//           }

//           setSelectedGroupYearsOfAdmission(allFacultieResponse.payload[0].yearOfAdmission)
//         }
//       }

//       fetchFaculties()
//     } catch (error) {
//       alert(error)
//     }
//   }
// }, [institution, userData])

// Коли activeLessonsFilter.value === 'Викладач' - оновлюю selectedTeacherSchedule
// React.useEffect(() => {
//   if (activeLessonsFilter.value === 'Викладач') {
//     setSelectedTeacherSchedule((prev) => {
//       if (departments !== null && departments.length) {
//         const currentTeacher = departments[0].teachers[0]

//         const teacherName = `${currentTeacher.lastName} ${currentTeacher.firstName[0]}.${currentTeacher.middleName[0]}.`

//         const selectedDepartmentTeachers = departments[0].teachers.map((el) => {
//           const name = `${el.lastName} ${el.firstName[0]}.${el.middleName[0]}.`
//           return name
//         })

//         const updatedObj = {
//           teacherName,
//           selectedDepartmentTeachers,
//           departmentName: departments[0].name,
//           departmentId: String(departments[0]._id),
//           teacherId: String(currentTeacher._id),
//         }

//         return updatedObj
//       }
//       return prev
//     })
//   }
// }, [activeLessonsFilter, departments])

// Коли activeLessonsFilter.value === 'Аудиторія' - оновлюю selectedAuditorySchedule
// React.useEffect(() => {
//   if (activeLessonsFilter.value === 'Аудиторія') {
//     setSelectedAuditorySchedule((prev) => {
//       if (buildings !== null) {
//         const currentAuditory = buildings[0].auditoriums[0]

//         const selectedBuildingAuditories = buildings[0].auditoriums.map((el) => el.name)

//         const updatedObj = {
//           selectedBuildingAuditories,
//           buildingName: buildings[0].name,
//           buildingId: String(buildings[0]._id),
//           auditoryId: String(currentAuditory._id),
//           auditoryName: currentAuditory.name,
//         }

//         return updatedObj
//       }

//       return prev
//     })
//   }
// }, [activeLessonsFilter])
