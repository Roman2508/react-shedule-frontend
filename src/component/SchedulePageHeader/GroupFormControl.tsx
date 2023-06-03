import React from 'react'
import '../../Pages/SchedulePage/SchedulePage.scss'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import CircularProgress from '@mui/material/CircularProgress'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { FacultyType } from '../../redux/faculties/facultiesTypes'
import {
  SelectedAuditoryScheduleType,
  SelectedGroupScheduleType,
  SelectedTeacherScheduleType,
} from '../../redux/lessons/lessonsTypes'
import { BuildingsType } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'
import { DepartmentType, TeacherType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'
import FormControlItem from './FormControlItem'
import { useAppDispatch } from '../../redux/store'
import { getAllFacultyGroups } from '../../redux/group/groupAsyncAction'
import { getDistributedLoad } from '../../redux/distributedLoad/distributedLoadAsyncAction'
import { changeFilterType } from '../../redux/lessons/lessonsSlice'
import { GroupType } from '../../redux/group/groupTypes'
import { getAllDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import { InstitutionDataType } from '../../redux/accountInfo/accountInfoTypes'
import { getAllBuildings } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsAsyncAction'

type GroupFormControlPropsType = {
  userId: string
  renderMode: string
  buildings: BuildingsType[]
  faculties: [] | FacultyType[]
  fullTimeGroups: GroupType[] | null
  partTimeGroups: GroupType[] | null
  departments: null | DepartmentType[]
  institution: InstitutionDataType | null
  selectedGroupSchedule: SelectedGroupScheduleType
  selectedTeacherSchedule: SelectedTeacherScheduleType
  selectedAuditorySchedule: SelectedAuditoryScheduleType
  setSelectedGroupYearsOfAdmission: (val: string) => void
}

const GroupFormControl: React.FC<GroupFormControlPropsType> = ({
  userId,
  renderMode,
  faculties,
  departments,
  buildings,
  institution,
  partTimeGroups,
  fullTimeGroups,
  selectedGroupSchedule,
  selectedTeacherSchedule,
  selectedAuditorySchedule,
  setSelectedGroupYearsOfAdmission,
}) => {
  const dispatch = useAppDispatch()

  /* зміна факультету та групи */
  const handleChangeFaculty = async (event: SelectChangeEvent) => {
    const findedFacultie = faculties.find((el) => el._id === event.target.value)

    if (findedFacultie) {
      const { payload } = await dispatch(getAllFacultyGroups(event.target.value))

      const getDistributedLoadPayload = { groupId: selectedGroupSchedule.groupId, userId }

      dispatch(getDistributedLoad(getDistributedLoadPayload))

      // @ts-ignore
      const groupList = payload.map((el: GroupType) => el.name)

      const currentGroupData = {
        selectedItems: [...groupList],
        id: payload[0]._id,
        name: payload[0].name,
        divisionName: findedFacultie.name,
        divisionId: event.target.value,
        type: 'groupId',
      }

      dispatch(changeFilterType(currentGroupData))

      setSelectedGroupYearsOfAdmission(payload[0].yearOfAdmission)
    }
  }
  const handleChangeGroup = (event: SelectChangeEvent) => {
    let group

    group = fullTimeGroups?.find((el) => el.name === event.target.value)

    if (!group) {
      group = partTimeGroups?.find((el) => el.name === event.target.value)
    }

    const currentGroupData = {
      selectedItems: selectedGroupSchedule.selectedFacultieGroups,
      id: group?._id || '',
      name: event.target.value,
      divisionName: selectedGroupSchedule.facultieName,
      divisionId: selectedGroupSchedule.facultieId,
      type: 'groupId',
    }

    dispatch(changeFilterType(currentGroupData))

    // Встановлюю рік вступу вибраної групи
    if (group) {
      setSelectedGroupYearsOfAdmission(group.yearOfAdmission)
    }
  }
  /* // зміна факультету та групи */

  /* зміна кафедри та викладача */
  const handleChangeDepartment = (event: SelectChangeEvent) => {
    if (departments !== null && institution) {
      const findedDepartment = departments.find((el) => String(el._id) === event.target.value)

      if (findedDepartment) {
        // const { payload } = await dispatch(getAllDepartments(institution._id))

        const currentDepartment = departments.find((el: DepartmentType) => String(el._id) === event.target.value)

        let currentTeacher = { name: '', id: '' }

        let teachersList: string[] = []

        if (currentDepartment) {
          teachersList = currentDepartment.teachers.map((el: TeacherType) => {
            const name = `${el.lastName} ${el.firstName[0]}.${el.middleName[0]}.`
            return name
          })
          const current = currentDepartment.teachers[0]

          const teacherName = `${current.lastName} ${current.firstName[0]}.${current.middleName[0]}.`
          const teacherId = current._id

          currentTeacher = { name: teacherName, id: String(teacherId) }
        }

        //
        const currentTeacherData = {
          selectedItems: teachersList,
          id: currentTeacher.id,
          name: currentTeacher.name,
          divisionName: findedDepartment.name,
          divisionId: findedDepartment._id,
          type: 'teacher',
        }

        dispatch(changeFilterType(currentTeacherData))
      }
    }
  }
  const handleChangeTeacher = (event: SelectChangeEvent) => {
    if (departments) {
      const departmentsList = departments.map((el) => el.teachers).flat(2)

      const selectedTeacher = departmentsList.find((el) => {
        const name = `${el.lastName} ${el.firstName[0]}.${el.middleName[0]}.`

        return name === event.target.value
      })

      const currentTeacherData = {
        selectedItems: selectedTeacherSchedule.selectedDepartmentTeachers,
        id: selectedTeacher?._id || '',
        name: event.target.value,
        divisionName: selectedTeacherSchedule.departmentName,
        divisionId: selectedTeacherSchedule.departmentId,
        type: 'teacher',
      }

      dispatch(changeFilterType(currentTeacherData))
    }
  }
  /* // зміна кафедри та викладача */

  /* зміна корпусу та аудиторії */
  const handleChangeBuilding = async (event: SelectChangeEvent) => {
    const findedBuilding = buildings.find((el) => String(el._id) === event.target.value)

    if (findedBuilding && institution) {
      const { payload } = await dispatch(getAllBuildings(institution._id))
      const currentBuilding: BuildingsType = payload.find((el: BuildingsType) => String(el._id) === event.target.value)

      let currentAuditory = { name: '', id: '' }

      let auditoriesList: string[] = []

      if (currentBuilding) {
        auditoriesList = currentBuilding.auditoriums.map((el) => el.name)

        currentAuditory = {
          id: String(currentBuilding.auditoriums[0]._id),
          name: currentBuilding.auditoriums[0].name,
        }
      }

      const currentAuditoryData = {
        selectedItems: auditoriesList,
        id: currentAuditory.id,
        name: currentAuditory.name,
        divisionName: findedBuilding.name,
        divisionId: findedBuilding._id,
        type: 'auditory',
      }

      dispatch(changeFilterType(currentAuditoryData))
    }
  }
  const handleChangeAuditory = (event: SelectChangeEvent) => {
    const auditoriesList = buildings.map((el) => el.auditoriums).flat(2)

    const selectedAuditory = auditoriesList.find((el) => String(el.name) === event.target.value)

    const currentAuditoryData = {
      selectedItems: selectedAuditorySchedule.selectedBuildingAuditories,
      id: selectedAuditory?._id || '',
      name: event.target.value,
      divisionName: selectedAuditorySchedule.buildingName,
      divisionId: selectedAuditorySchedule.buildingId,
      type: 'auditory',
    }

    dispatch(changeFilterType(currentAuditoryData))
  }
  /* // зміна корпусу та аудиторії */

  if (renderMode === 'Група') {
    return (
      <FormControlItem
        mainLabel={'Факультет'}
        secondaryLabel={'Група'}
        mainItems={faculties}
        secondaryItems={selectedGroupSchedule.selectedFacultieGroups}
        onChangeMainHandler={handleChangeFaculty}
        onChangeSecondaryHandler={handleChangeGroup}
        selectedMainItemId={selectedGroupSchedule.facultieId}
        selectedSecondaryItemName={selectedGroupSchedule.groupName}
      />
    )
  }

  if (renderMode === 'Викладач' && departments !== null) {
    return (
      <FormControlItem
        mainLabel={'Кафедра'}
        secondaryLabel={'Викладач'}
        mainItems={departments}
        secondaryItems={selectedTeacherSchedule.selectedDepartmentTeachers}
        onChangeMainHandler={handleChangeDepartment}
        onChangeSecondaryHandler={handleChangeTeacher}
        selectedMainItemId={selectedTeacherSchedule.departmentId}
        selectedSecondaryItemName={selectedTeacherSchedule.teacherName}
      />
    )
  }
  if (renderMode === 'Аудиторія') {
    return (
      <FormControlItem
        mainLabel={'Корпус'}
        secondaryLabel={'Аудиторія'}
        mainItems={buildings}
        secondaryItems={selectedAuditorySchedule.selectedBuildingAuditories}
        onChangeMainHandler={handleChangeBuilding}
        onChangeSecondaryHandler={handleChangeAuditory}
        selectedMainItemId={selectedAuditorySchedule.buildingId}
        selectedSecondaryItemName={selectedAuditorySchedule.auditoryName}
      />
    )
  } else {
    return <div></div>
  }
}

export default React.memo(GroupFormControl)

// if (renderMode === 'Група') {
//   return (
//     <>
//       <FormControl sx={{ width: '380px' }} fullWidth>
//         {faculties.length ? (
//           <>
//             <InputLabel>Факультет</InputLabel>
//             <Select
//               className="schedule-page__select"
//               value={selectedGroupSchedule.facultieId}
//               // defaultValue={'faculties[0].name'}
//               label="facultie"
//               onChange={handleChangeFaculty}>
//               {faculties.map((el) => (
//                 <MenuItem key={el._id} value={el._id}>
//                   {el.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </>
//         ) : (
//           <div style={{ textAlign: 'center' }}>
//             <CircularProgress size={38} />
//           </div>
//         )}
//       </FormControl>

//       <FormControl sx={{ width: '180px', marginLeft: '16px' }} fullWidth>
//         {selectedGroupSchedule.selectedFacultieGroups.length ? (
//           <>
//             <InputLabel id="demo-simple-select-label">Група</InputLabel>
//             <Select
//               className="schedule-page__select"
//               value={selectedGroupSchedule.groupName}
//               label="group"
//               onChange={handleChangeGroup}>
//               {selectedGroupSchedule.selectedFacultieGroups.map((el: string, index: number) => (
//                 <MenuItem value={String(el)} key={index}>
//                   {el}
//                 </MenuItem>
//               ))}
//             </Select>
//           </>
//         ) : (
//           <div style={{ textAlign: 'center' }}>
//             <CircularProgress size={38} />
//           </div>
//         )}
//       </FormControl>
//     </>
//   )
// }

// if (renderMode === 'Викладач' && departments !== null) {
//   return (
//     <>
//       <FormControl sx={{ width: '380px' }} fullWidth>
//         {departments.length ? (
//           <>
//             <InputLabel>Кафедра</InputLabel>
//             <Select
//               className="schedule-page__select"
//               value={selectedTeacherSchedule.departmentId}
//               // defaultValue={'faculties[0].name'}
//               label="facultie"
//               onChange={handleChangeDepartment}>
//               {departments.map((el) => (
//                 <MenuItem key={el._id} value={el._id}>
//                   {el.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </>
//         ) : (
//           <div style={{ textAlign: 'center' }}>
//             <CircularProgress size={38} />
//           </div>
//         )}
//       </FormControl>

//       <FormControl sx={{ width: '180px', marginLeft: '16px' }} fullWidth>
//         {selectedTeacherSchedule.selectedDepartmentTeachers.length ? (
//           <>
//             <InputLabel id="demo-simple-select-label">Викладач</InputLabel>
//             <Select
//               className="schedule-page__select"
//               value={selectedTeacherSchedule.teacherName}
//               label="group"
//               onChange={handleChangeTeacher}>
//               {selectedTeacherSchedule.selectedDepartmentTeachers.map((el: string, index: number) => (
//                 <MenuItem value={String(el)} key={index}>
//                   {el}
//                 </MenuItem>
//               ))}
//             </Select>
//           </>
//         ) : (
//           <div style={{ textAlign: 'center' }}>
//             <CircularProgress size={38} />
//           </div>
//         )}
//       </FormControl>
//     </>
//   )
// }
// if (renderMode === 'Аудиторія') {
//   return (
//     <>
//       <FormControl sx={{ width: '380px' }} fullWidth>
//         {buildings.length ? (
//           <>
//             <InputLabel>Корпус</InputLabel>
//             <Select
//               className="schedule-page__select"
//               value={selectedAuditorySchedule.buildingId}
//               // defaultValue={'faculties[0].name'}
//               label="building"
//               onChange={handleChangeBuilding}>
//               {buildings.map((el) => (
//                 <MenuItem key={el._id} value={el._id}>
//                   {el.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </>
//         ) : (
//           <div style={{ textAlign: 'center' }}>
//             <CircularProgress size={38} />
//           </div>
//         )}
//       </FormControl>

//       <FormControl sx={{ width: '180px', marginLeft: '16px' }} fullWidth>
//         {selectedAuditorySchedule.selectedBuildingAuditories.length ? (
//           <>
//             <InputLabel>Аудиторія</InputLabel>
//             <Select
//               className="schedule-page__select"
//               value={selectedAuditorySchedule.auditoryName}
//               label="auditory"
//               onChange={handleChangeAuditory}>
//               {selectedAuditorySchedule.selectedBuildingAuditories.map((el: string, index: number) => (
//                 <MenuItem value={String(el)} key={index}>
//                   {el}
//                 </MenuItem>
//               ))}
//             </Select>
//           </>
//         ) : (
//           <div style={{ textAlign: 'center' }}>
//             <CircularProgress size={38} />
//           </div>
//         )}
//       </FormControl>
//     </>
//   )
// }
