import { StreamsType } from '../streams/streamsTypes'
import { TeacherType } from '../teachersAndDepartment/teachersAndDepartmentTypes'

export type DistributedLoadType = {
  _id: string
  groupLoad: string
  planId: string
  groupId: string
  load: DistributedLoadSubjectsType[]
}

export type DistributedLoadSubjectsType = {
  _id: string
  groupId: string
  groupName: string
  name: string
  semester: string
  specialization: DistributedSpecializationType | null

  lectures?: DistributedSubjectType
  lectures_1?: DistributedSubjectType
  lectures_2?: DistributedSubjectType
  lectures_3?: DistributedSubjectType
  lectures_4?: DistributedSubjectType
  practical?: DistributedSubjectType
  practical_1?: DistributedSubjectType
  practical_2?: DistributedSubjectType
  practical_3?: DistributedSubjectType
  practical_4?: DistributedSubjectType
  laboratory?: DistributedSubjectType
  laboratory_1?: DistributedSubjectType
  laboratory_2?: DistributedSubjectType
  laboratory_3?: DistributedSubjectType
  laboratory_4?: DistributedSubjectType
  seminars?: DistributedSubjectType
  seminars_1?: DistributedSubjectType
  seminars_2?: DistributedSubjectType
  seminars_3?: DistributedSubjectType
  seminars_4?: DistributedSubjectType
  seminars_5?: DistributedSubjectType
  exams?: DistributedSubjectType
  exams_1?: DistributedSubjectType
  exams_2?: DistributedSubjectType
  exams_3?: DistributedSubjectType
  exams_4?: DistributedSubjectType
}

export type DistributedSpecializationType = {
  _id: string
  name: string
}

export type DistributedStreamType = {
  _id: string
  streamId: string
  name: string
  groups: string[]
}

export type DistributedSubjectType = {
  _id: string
  type: string
  hours: number
  teacher: TeacherType | null
  stream: DistributedStreamType | null
  subgroupNumber: number | null
}

export type DistributedSubjectsType = {
  subjectId: string
  _id: string
  type: string
  subjectType: string
  hours: number
  students: string
  teacher: TeacherType | null
  stream: DistributedStreamType | null
  subgroupNumber: number | null
}

export type SelectedDistributedLoadType = {
  hours: number
  name: string
  semester: string
  remark: string
  groupId: string
  specialization: DistributedSpecializationType | null
  teacher: TeacherType | null
  stream: DistributedStreamType | null
  subgroupNumber: number | null
  type: string
  _id: string
}

export type LessonsListItemType = {
  subjectType: string
  groupId: string
  groupName: string
  hours: number
  name: string
  remark: string
  semester: string
  specialization: DistributedSpecializationType
  stream: DistributedStreamType
  subgroupNumber: number
  teacher: TeacherType
  type: string
  _id: string
}
