import React from 'react'
import '../../Pages/SchedulePage/SchedulePage.scss'
import Paper from '@mui/material/Paper'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import LeftArrow from '@mui/icons-material/KeyboardArrowLeft'
import RightArrow from '@mui/icons-material/ChevronRight'
import { FacultyType } from '../../redux/faculties/facultiesTypes'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { useAppDispatch } from '../../redux/store'
import { getAllFaculties } from '../../redux/faculties/facultiesAsyncAction'
import { getAllFacultyGroups } from '../../redux/group/groupAsyncAction'
import { getDistributedLoad } from '../../redux/distributedLoad/distributedLoadAsyncAction'
import { selectGroups } from '../../redux/group/groupSelector'
import { useSelector } from 'react-redux'
import { GroupType } from '../../redux/group/groupTypes'
import {
  ActiveFilterType,
  SelectedAuditoryScheduleType,
  SelectedGroupScheduleType,
  SelectedTeacherScheduleType,
} from '../../redux/lessons/lessonsTypes'
import GroupFormControl from './GroupFormControl'
import { DepartmentType, TeacherType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'
import { BuildingsType } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'
import { getAllDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import { getAllBuildings } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsAsyncAction'
import { StyledSelectWeek } from '../../theme'
import { updateUserSemester } from '../../redux/accountInfo/accountInfoAsyncActions'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { calcCurrentSemester } from '../../utils/calcCurrentSemester'
import { changeFilterType } from '../../redux/lessons/lessonsSlice'
import { useLocalStorage } from '../../utils/useLocalStorage'

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
    },
  },
}

type SchedulePageHeaderPropsType = {
  userId: string
  totalWeeksCount: number
  selectedSemester: string
  currentWeekNumber: number
  buildings: BuildingsType[]
  faculties: [] | FacultyType[]
  departments: null | DepartmentType[]
  selectedGroupYearsOfAdmission: string | null
  setSelectedSemester: (val: string) => void
  setCurrentWeekNumber: (val: number) => void
  setSelectedGroupYearsOfAdmission: (val: string) => void
  currentWeekNumberHandler: (type: string, max: number) => void
  activeLessonsFilter: { id: number; value: string; type: string }
  setActiveLessonsFilter: (value: ActiveFilterType) => void
  selectedGroupSchedule: SelectedGroupScheduleType
  selectedTeacherSchedule: SelectedTeacherScheduleType
  selectedAuditorySchedule: SelectedAuditoryScheduleType
}

const SchedulePageHeader: React.FC<SchedulePageHeaderPropsType> = ({
  userId,
  faculties,
  buildings,
  departments,
  totalWeeksCount,
  currentWeekNumber,
  selectedSemester,
  setSelectedSemester,
  activeLessonsFilter,
  setCurrentWeekNumber,
  selectedGroupSchedule,
  setActiveLessonsFilter,
  currentWeekNumberHandler,
  selectedTeacherSchedule,
  selectedAuditorySchedule,
  selectedGroupYearsOfAdmission,
  setSelectedGroupYearsOfAdmission,
}) => {
  const dispatch = useAppDispatch()

  const lessonFilters: ActiveFilterType[] = [
    {
      id: 0,
      value: 'Група',
      type: 'groupId',
    },
    {
      id: 1,
      value: 'Викладач',
      type: 'teacher',
    },
    {
      id: 2,
      value: 'Аудиторія',
      type: 'auditory',
    },
  ]

  const { fullTimeGroups, partTimeGroups } = useSelector(selectGroups)
  const { institution } = useSelector(selectAuthData)

  const colorMode = useLocalStorage('colorMode')

  const [selectSemesterValue, setSelectSemesterValue] = React.useState<'1' | '2'>('1')

  // При зміні групи отримувати навантаження
  React.useEffect(() => {
    if (selectedGroupSchedule.groupId) {
      const payload = { groupId: selectedGroupSchedule.groupId, userId }
      dispatch(getDistributedLoad(payload))
    }
  }, [selectedGroupSchedule.groupId])

  React.useEffect(() => {
    if (selectedSemester === '1' || selectedSemester === '3' || selectedSemester === '5' || selectedSemester === '7') {
      setSelectSemesterValue('1')
    }
    if (selectedSemester === '2' || selectedSemester === '4' || selectedSemester === '6' || selectedSemester === '8') {
      setSelectSemesterValue('2')
    }
  }, [selectedSemester])

  // Change filterType
  const handleChangeActiveLessonsFilter = (event: React.SyntheticEvent, newValue: number) => {
    setActiveLessonsFilter(lessonFilters[newValue])

    // Група
    if (newValue === 0) {
      if (fullTimeGroups && partTimeGroups) {
        const groups = [...fullTimeGroups, ...partTimeGroups]
        const groupNames = groups.map((el) => el.name)

        const currentGroupData = {
          selectedItems: groupNames,
          id: groups[0]._id,
          name: groups[0].name,
          divisionName: faculties[0].name,
          divisionId: faculties[0]._id,
          type: 'groupId',
        }

        dispatch(changeFilterType(currentGroupData))
      }
    } else if (newValue === 1) {
      // Викладач
      if (departments) {
        const teachersList = departments[0].teachers.map((el) => {
          return `${el.lastName} ${el.firstName[0]}.${el.middleName[0]}.`
        })

        const teacher = departments[0].teachers[0]
        const teacherName = `${teacher.lastName} ${teacher.firstName[0]}.${teacher.middleName[0]}.`

        const currentTeacherData = {
          selectedItems: teachersList,
          id: teacher._id,
          name: teacherName,
          divisionName: departments[0].name,
          divisionId: departments[0]._id,
          type: 'teacher',
        }

        dispatch(changeFilterType(currentTeacherData))
      }
    } else if (newValue === 2) {
      // Аудиторія

      const auditoriesList = buildings.map((el) => el.auditoriums).flat(2)
      const auditoriesNames = buildings[0].auditoriums.map((el) => el.name)

      const currentAuditoryData = {
        selectedItems: auditoriesNames,
        id: auditoriesList[0]._id,
        name: auditoriesList[0].name,
        divisionName: buildings[0].name,
        divisionId: buildings[0]._id,
        type: 'auditory',
      }

      dispatch(changeFilterType(currentAuditoryData))
    }
  }

  const handleChangeSelectedSemester = async (event: SelectChangeEvent<unknown>) => {
    if (institution && selectedGroupYearsOfAdmission && globalThis.confirm('Ви дійсно хочете змінити семестр?')) {
      await dispatch(updateUserSemester({ userId, selectedSemester: String(event.target.value) }))

      const showedYear = institution.settings.currentShowedYear

      const semester = calcCurrentSemester(showedYear, selectedGroupYearsOfAdmission, String(event.target.value))

      if (semester) {
        setSelectedSemester(semester)
      }

      setCurrentWeekNumber(0)
    }
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // - Заборонити ставити підгрупи, до яких підв'язаний один викладач - //
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  return (
    <Paper className="schedule-page__top">
      <div className="schedule-page__selects">
        <GroupFormControl
          userId={userId}
          faculties={faculties}
          buildings={buildings}
          departments={departments}
          institution={institution}
          fullTimeGroups={fullTimeGroups}
          partTimeGroups={partTimeGroups}
          renderMode={activeLessonsFilter.value}
          selectedGroupSchedule={selectedGroupSchedule}
          selectedTeacherSchedule={selectedTeacherSchedule}
          selectedAuditorySchedule={selectedAuditorySchedule}
          setSelectedGroupYearsOfAdmission={setSelectedGroupYearsOfAdmission}
        />
      </div>

      {/* select semester */}
      <div>
        <StyledSelectWeek
          size="small"
          label="Семестр"
          MenuProps={MenuProps}
          value={selectSemesterValue}
          sx={{ minWidth: '90px !important', height: '43px' }}
          onChange={handleChangeSelectedSemester}>
          <MenuItem value={'1'}>
            <span className="schedule-page__current-week">1</span>
          </MenuItem>
          <MenuItem value={'2'}>
            <span className="schedule-page__current-week">2</span>
          </MenuItem>
        </StyledSelectWeek>
      </div>

      {/* select week */}
      <div className="schedule-page__week">
        <button
          className="schedule-page__week-btn"
          disabled={currentWeekNumber === 0}
          onClick={() => currentWeekNumberHandler('prev', totalWeeksCount - 1)}>
          <LeftArrow />
        </button>
        {/* <button className="schedule-page__week-btn today-btn" onClick={currentWeekHandler}>
          today {currentWeekNumber + 1}
        </button> */}
        <StyledSelectWeek
          size="small"
          value={currentWeekNumber + 1}
          label="Номер тижня"
          sx={{ minWidth: '100px !important', height: '43px' }}
          MenuProps={MenuProps}
          onChange={(val: any) => setCurrentWeekNumber(Number(val.target.value - 1))}>
          {[...Array(totalWeeksCount)].map((_, index) => (
            <MenuItem value={index + 1} key={index}>
              <span className="schedule-page__current-week">{index + 1}</span>
            </MenuItem>
          ))}
        </StyledSelectWeek>
        <button
          className="schedule-page__week-btn"
          disabled={currentWeekNumber + 1 === totalWeeksCount}
          onClick={() => currentWeekNumberHandler('next', totalWeeksCount - 1)}>
          <RightArrow />
        </button>
      </div>
      {/*  */}
      <div className="schedule-page__schedule-type">
        <Tabs value={activeLessonsFilter.id} onChange={handleChangeActiveLessonsFilter}>
          {lessonFilters.map((el) => (
            <Tab label={el.value} id={`${el.id}`} key={el.id} />
          ))}
        </Tabs>
      </div>
    </Paper>
  )
}

export default SchedulePageHeader

// /* зміна факультету та групи */

// const handleChangeFaculty = async (event: SelectChangeEvent) => {
//   const findedFacultie = faculties.find((el) => el._id === event.target.value)

//   if (findedFacultie) {
//     const { payload } = await dispatch(getAllFacultyGroups(event.target.value))

//     const getDistributedLoadPayload = { groupId: selectedGroupSchedule.groupId, userId }

//     dispatch(getDistributedLoad(getDistributedLoadPayload))

//     // @ts-ignore
//     const groupList = payload.map((el: GroupType) => el.name)

//     const currentGroupData = {
//       selectedItems: [...groupList],
//       id: payload[0]._id,
//       name: payload[0].name,
//       divisionName: findedFacultie.name,
//       divisionId: event.target.value,
//       type: 'groupId',
//     }

//     dispatch(changeFilterType(currentGroupData))

//     setSelectedGroupYearsOfAdmission(payload[0].yearOfAdmission)
//   }
// }

// const handleChangeGroup = (event: SelectChangeEvent) => {
//   let group

//   group = fullTimeGroups?.find((el) => el.name === event.target.value)

//   if (!group) {
//     group = partTimeGroups?.find((el) => el.name === event.target.value)
//   }

//   const currentGroupData = {
//     selectedItems: selectedGroupSchedule.selectedFacultieGroups,
//     id: group?._id || '',
//     name: event.target.value,
//     divisionName: selectedGroupSchedule.facultieName,
//     divisionId: selectedGroupSchedule.facultieId,
//     type: 'groupId',
//   }

//   dispatch(changeFilterType(currentGroupData))

//   // Встановлюю рік вступу вибраної групи
//   if (group) {
//     setSelectedGroupYearsOfAdmission(group.yearOfAdmission)
//   }
// }
// /* // зміна факультету та групи */

// /* зміна кафедри та викладача */
// const handleChangeDepartment = async (event: SelectChangeEvent) => {
//   if (departments !== null) {
//     const findedDepartment = departments.find((el) => String(el._id) === event.target.value)

//     if (findedDepartment && institution) {
//       const { payload } = await dispatch(getAllDepartments(institution._id))

//       const currentDepartment: DepartmentType = payload.find(
//         (el: DepartmentType) => String(el._id) === event.target.value,
//       )

//       let currentTeacher = { name: '', id: '' }

//       let teachersList: string[] = []

//       if (currentDepartment) {
//         teachersList = currentDepartment.teachers.map((el: TeacherType) => {
//           const name = `${el.lastName} ${el.firstName[0]}.${el.middleName[0]}.`
//           return name
//         })
//         const current = currentDepartment.teachers[0]

//         const teacherName = `${current.lastName} ${current.firstName[0]}.${current.middleName[0]}.`
//         const teacherId = current._id

//         currentTeacher = { name: teacherName, id: String(teacherId) }
//       }

//       //
//       const currentAuditoryData = {
//         selectedItems: teachersList,
//         id: currentTeacher.id,
//         name: currentTeacher.name,
//         divisionName: findedDepartment.name,
//         divisionId: findedDepartment._id,
//         type: 'auditory',
//       }

//       dispatch(changeFilterType(currentAuditoryData))
//     }
//   }
// }

// const handleChangeTeacher = (event: SelectChangeEvent) => {
//   if (departments) {
//     const departmentsList = departments.map((el) => el.teachers).flat(2)

//     const selectedTeacher = departmentsList.find((el) => {
//       const name = `${el.lastName} ${el.firstName[0]}.${el.middleName[0]}.`

//       return name === event.target.value
//     })

//     const currentAuditoryData = {
//       selectedItems: selectedTeacherSchedule.selectedDepartmentTeachers,
//       id: selectedTeacher?._id || '',
//       name: event.target.value,
//       divisionName: selectedTeacherSchedule.departmentName,
//       divisionId: selectedTeacherSchedule.departmentId,
//       type: 'auditory',
//     }

//     dispatch(changeFilterType(currentAuditoryData))
//   }
// }
// /* // зміна кафедри та викладача */

// /* зміна корпусу та аудиторії */
// const handleChangeBuilding = async (event: SelectChangeEvent) => {
//   const findedBuilding = buildings.find((el) => String(el._id) === event.target.value)

//   if (findedBuilding && institution) {
//     const { payload } = await dispatch(getAllBuildings(institution._id))
//     const currentBuilding: BuildingsType = payload.find((el: BuildingsType) => String(el._id) === event.target.value)

//     let currentAuditory = { name: '', id: '' }

//     let auditoriesList: string[] = []

//     if (currentBuilding) {
//       auditoriesList = currentBuilding.auditoriums.map((el) => el.name)

//       currentAuditory = {
//         id: String(currentBuilding.auditoriums[0]._id),
//         name: currentBuilding.auditoriums[0].name,
//       }
//     }

//     const currentAuditoryData = {
//       selectedItems: auditoriesList,
//       id: currentAuditory.id,
//       name: currentAuditory.name,
//       divisionName: findedBuilding.name,
//       divisionId: findedBuilding._id,
//       type: 'auditory',
//     }

//     dispatch(changeFilterType(currentAuditoryData))
//   }
// }

// const handleChangeAuditory = (event: SelectChangeEvent) => {
//   const auditoriesList = buildings.map((el) => el.auditoriums).flat(2)

//   const selectedAuditory = auditoriesList.find((el) => String(el.name) === event.target.value)

//   const currentAuditoryData = {
//     selectedItems: selectedAuditorySchedule.selectedBuildingAuditories,
//     id: selectedAuditory?._id || '',
//     name: event.target.value,
//     divisionName: selectedAuditorySchedule.buildingName,
//     divisionId: selectedAuditorySchedule.buildingId,
//     type: 'auditory',
//   }

//   dispatch(changeFilterType(currentAuditoryData))
// }
// /* // зміна корпусу та аудиторії */

// const group1 = 'handleChangeFaculty'
// // const handleChangeFaculty = async (event: SelectChangeEvent) => {
// //   const findedFacultie = faculties.find((el) => el._id === event.target.value)

// //   if (findedFacultie) {
// //     const { payload } = await dispatch(getAllFacultyGroups(event.target.value))

// //     const getDistributedLoadPayload = { groupId: selectedGroupSchedule.groupId, userId }

// //     dispatch(getDistributedLoad(getDistributedLoadPayload))

// //     // @ts-ignore
// //     setSelectedGroupSchedule((prev: SelectedGroupScheduleType) => {
// //       const groupList = payload.map((el: GroupType) => el.name)

// //       const updatedObj = {
// //         facultieName: findedFacultie.name,
// //         facultieId: event.target.value,
// //         selectedFacultieGroups: [...groupList],
// //         groupId: payload[0]._id,
// //         groupName: payload[0].name,
// //       }

// //       return updatedObj
// //     })

// //     setSelectedGroupYearsOfAdmission(payload[0].yearOfAdmission)
// //   }
// // }

// const group2 = 'handleChangeGroup'
// // const handleChangeGroup = (event: SelectChangeEvent) => {
// //   // @ts-ignore
// //   setSelectedGroupSchedule((prev: SelectedGroupScheduleType) => {
// //     let group

// //     group = fullTimeGroups?.find((el) => el.name === event.target.value)

// //     if (!group) {
// //       group = partTimeGroups?.find((el) => el.name === event.target.value)
// //     }

// //     const updatedObj = {
// //       ...prev,
// //       groupName: event.target.value,
// //       groupId: group?._id || '',
// //     }

// //     // Встановлюю рік вступу вибраної групи
// //     if (group) {
// //       setSelectedGroupYearsOfAdmission(group.yearOfAdmission)
// //     }

// //     return updatedObj
// //   })
// // }

// const teacher1 = 'handleChangeDepartment'
// // const handleChangeDepartment = async (event: SelectChangeEvent) => {
// //   if (departments !== null) {
// //     const findedDepartment = departments.find((el) => String(el._id) === event.target.value)

// //     if (findedDepartment && institution) {
// //       const { payload } = await dispatch(getAllDepartments(institution._id))
// // dispatch(getAllDepartments(institution._id)).then(({ payload }) => {

// // @ts-ignore
// // setSelectedTeacherSchedule((prev: SelectedTeacherScheduleType) => {
// //   const currentDepartment: DepartmentType = payload.find(
// //     (el: DepartmentType) => String(el._id) === event.target.value,
// //   )

// //   let currentTeacher = { name: '', id: '' }

// //   let teachersList: string[] = []

// //   if (currentDepartment) {
// //     teachersList = currentDepartment.teachers.map((el: TeacherType) => {
// //       const name = `${el.lastName} ${el.firstName[0]}.${el.middleName[0]}.`
// //       return name
// //     })
// //     const current = currentDepartment.teachers[0]

// //     const teacherName = `${current.lastName} ${current.firstName[0]}.${current.middleName[0]}.`
// //     const teacherId = current._id

// //     currentTeacher = { name: teacherName, id: String(teacherId) }
// //   }

// //   const updatedObj = {
// //     selectedDepartmentTeachers: teachersList, // ?
// //     teacherId: currentTeacher.id, // ?
// //     teacherName: currentTeacher.name, // ?
// //     departmentName: findedDepartment.name,
// //     departmentId: findedDepartment._id,
// //   }

// //   //
// //   const currentSelectedAuditory = {
// //     selectedItems: teachersList,
// //     id: currentTeacher.id,
// //     name: currentTeacher.name,
// //     divisionName: findedDepartment.name,
// //     divisionId: findedDepartment._id,
// //     type: 'auditory',
// //   }

// //   dispatch(changeFilterType(currentSelectedAuditory))

// //   return updatedObj
// // })
// //     }
// //   }
// // }

// const teacher2 = 'handleChangeTeacher'
// // const handleChangeTeacher = (event: SelectChangeEvent) => {
// // @ts-ignore
// // setSelectedTeacherSchedule((prev: SelectedTeacherScheduleType) => {
// //   if (departments) {
// //     const departmentsList = departments.map((el) => el.teachers).flat(2)
// //     const selectedTeacher = departmentsList.find((el) => {
// //       const name = `${el.lastName} ${el.firstName[0]}.${el.middleName[0]}.`
// //       return name === event.target.value
// //     })
// //     const updatedObj = {
// //       ...prev,
// //       teacherId: selectedTeacher?._id || '',
// //       teacherName: event.target.value,
// //     }
// //     //
// //     const currentSelectedAuditory = {
// //       selectedItems: prev.selectedDepartmentTeachers,
// //       id: selectedTeacher?._id || '',
// //       name: event.target.value,
// //       divisionName: prev.departmentName,
// //       divisionId: prev.departmentId,
// //       type: 'auditory',
// //     }
// //     dispatch(changeFilterType(currentSelectedAuditory))
// //     return updatedObj
// //   }
// //   return prev
// // })
// // }

// const auditory1 = 'handleChangeBuilding'
// // const handleChangeBuilding = (event: SelectChangeEvent) => {
// //   const findedBuilding = buildings.find((el) => String(el._id) === event.target.value)

// //   if (findedBuilding && institution) {
// //     dispatch(getAllBuildings(institution._id)).then(({ payload }) => {
// //       // dispatch(getDistributedLoad(event.target.value)) ??????????

// //       // @ts-ignore
// //       setSelectedAuditorySchedule((prev: SelectedAuditoryScheduleType) => {
// //         const currentBuilding: BuildingsType = payload.find(
// //           (el: BuildingsType) => String(el._id) === event.target.value,
// //         )

// //         let currentAuditory = { name: '', id: '' }

// //         let auditoriesList: string[] = []

// //         if (currentBuilding) {
// //           auditoriesList = currentBuilding.auditoriums.map((el) => el.name)

// //           currentAuditory = {
// //             id: String(currentBuilding.auditoriums[0]._id),
// //             name: currentBuilding.auditoriums[0].name,
// //           }
// //         }

// //         const updatedObj = {
// //           selectedBuildingAuditories: auditoriesList,
// //           auditoryId: currentAuditory.id,
// //           auditoryName: currentAuditory.name,
// //           buildingName: findedBuilding.name,
// //           buildingId: findedBuilding._id,
// //         }

// //         return updatedObj
// //       })
// //     })
// //   }
// // }

// const auditory2 = 'handleChangeAuditory'
// // const handleChangeAuditory = (event: SelectChangeEvent) => {
// //   // @ts-ignore
// //   setSelectedAuditorySchedule((prev: SelectedAuditoryScheduleType) => {
// //     const auditoriesList = buildings.map((el) => el.auditoriums).flat(2)

// //     const selectedAuditory = auditoriesList.find((el) => String(el.name) === event.target.value)

// //     const updatedObj = {
// //       ...prev,
// //       auditoryId: selectedAuditory?._id || '',
// //       auditoryName: event.target.value,
// //     }

// //     return updatedObj
// //   })
// // }
