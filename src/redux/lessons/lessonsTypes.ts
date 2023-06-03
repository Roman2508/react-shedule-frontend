import { AuditoriumsType } from '../buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'
import { TeacherType } from '../teachersAndDepartment/teachersAndDepartmentTypes'
import { DistributedStreamType } from '../distributedLoad/distributedLoadTypes'
import { StreamsType } from '../streams/streamsTypes'

export type lessonsType = {
  _id: string
  groupId: string
  groupName: string
  name: string
  subjectType: string
  teacher: TeacherType
  auditory: AuditoriumsType
  remark: string
  stream: StreamsType
  date: string
  semester: string
  subjectNumber: number
  hours: number
  students: string
  type?: string
}

export type selectedSubjectType = {
  data: selectedSubjectDataType | null
  stream: null | DistributedStreamType
  groupId: string
  subjectId: string
}

export type selectedSubjectDataType = {
  groupId: string
  name: string
  type: string
  remark: string
  teacher: TeacherType
  hours: number
  students: string
}

// // //

export type ActiveFilterType = {
  id: number
  value: 'Група' | 'Викладач' | 'Аудиторія'
  type: 'groupId' | 'teacher' | 'auditory'
}

export type ScheduleFilterType = {
  selectedItems: string[]
  id: string
  name: string
  divisionName: string
  divisionId: string
  type: 'groupId' | 'teacher' | 'auditory'
}

export type SelectedGroupScheduleType = {
  groupId: string
  groupName: string
  selectedFacultieGroups: string[]
  facultieName: string
  facultieId: string
}

export type SelectedTeacherScheduleType = {
  selectedDepartmentTeachers: string[]
  teacherId: string
  teacherName: string
  departmentName: string
  departmentId: string
}
export type SelectedAuditoryScheduleType = {
  selectedBuildingAuditories: string[]
  auditoryId: string
  auditoryName: string
  buildingName: string
  buildingId: string
}

/*  */

export type RemoveStreamLessonType = {
  name: string
  groupId: string
  date: string
  subjectNumber: number
}

/*  */

export type OverlayAuditoryType = {
  _id: string
  buildingId: string
}
