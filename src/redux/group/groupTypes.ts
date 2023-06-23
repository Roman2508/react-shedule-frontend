import { EducationalPlanSubjectTypes, SubjectType } from '../educationalPlan/educationalPlanTypes'
import { StreamsType } from '../streams/streamsTypes'

export type GroupType = {
  _id: string
  specialtieId: string
  name: string
  yearOfAdmission: string
  courseNumber: number
  students: number
  formOfEducations: string
  EducationPlanId: string
  groupLoad: GroupLoadType
  streams: StreamsType[]
  subgroups: SubgroupsType[]
  specializationsList: SpecializationListType[]
  specializationsSubjects: SpecializationSubjectsType[]
}

export type GroupLoadType = {
  _id: string
  groupId: string
  planId: string
  load: GroupLoadItemType[]
}

export type GroupLoadItemType = {
  _id: string
  departmentId: string
  groupId: string
  stream: null
  subgroups: null
  totalHour: string
  planId: string
  name: string
  semester_1: SubjectType | null
  semester_2: SubjectType | null
  semester_3: SubjectType | null
  semester_4: SubjectType | null
  semester_5: SubjectType | null
  semester_6: SubjectType | null
  semester_7: SubjectType | null
  semester_8: SubjectType | null
  semester_9: SubjectType | null
  semester_10: SubjectType | null
  semester_11: SubjectType | null
  semester_12: SubjectType | null
  createdAt: string
  updatedAt: string
}

export type SubgroupsType = {
  _id: string
  groupId: string
  name: string
  semester: string
  lectures: null | number
  practical: null | number
  laboratory: null | number
  seminars: null | number
  exams: null | number
}

export type SubgroupsSubjectsType = {
  _id: string
  name: string
  semester: string
  subgroups: SubgroupsType
  lectures: number
  practical: number
  laboratory: number
  seminars: number
  exams: number
  zalik: number
  inPlan: number
  individual: number
  termPaper: boolean
}

export type SpecializationListType = {
  _id: string
  name: string
}

export type SpecializationSubjectsType = {
  _id: string
  groupId: string
  institutionId: string
  semester: string
  name: string
  specialization: { _id: string; name: string }
  lectures: number
  practical: number
  laboratory: number
  seminars: number
  termPaper: boolean
  exams: number
  zalik: number
  inPlan: number
  individual: number
}

export type SelectedSpecializationSubjectType = {
  _id: string
  exams: number
  inPlan: number
  individual: number
  laboratory: number
  lectures: number
  name: string
  practical: number
  semester: string
  seminars: number
  termPaper: boolean
  zalik: number
}
