import { string } from 'yup'
import { EducationalPlanSubjectTypes, SubjectType } from '../redux/educationalPlan/educationalPlanTypes'
import { CallScheduleAndTermsOfStudyType, TermsOfStudyType } from '../redux/accountInfo/accountInfoTypes'

enum SemestersListTypes {
  semester_1 = 'semester_1',
  semester_2 = 'semester_2',
  semester_3 = 'semester_3',
  semester_4 = 'semester_4',
  semester_5 = 'semester_5',
  semester_6 = 'semester_6',
  semester_7 = 'semester_7',
  semester_8 = 'semester_8',
}

/* subjects */

export type fetchChangeSubjectHoursType = {
  id: number
  payload: SubjectType
  semester: string
}

export type removeSubjectSemesterType = {
  id: number
  payload: string
}

export type createNewSubjectType = {
  name: string
  planId: string
}

export type updateSubjectNameType = {
  id: string
  name: string
}

export type CreateEducationPlanGroupPayload = {
  name: string
  institutionId: string
}

export type UpdatedSubjectPayload = {
  data: EducationalPlanSubjectTypes
  semesterNumber: string
}
/* //subjects */

export type createNewEducationPlanType = {
  name: string
  categoryId: string
  institutionId: string
}

export type removeEducationPlanType = {
  id: number
  categoryId: number
  message: string
}

export type changeEducationPlanNameType = {
  id: string
  name: string
  categoryId: string
}

/* teachers and departments */
export type onSubmitTeacherType = {
  firstName: string
  middleName: string
  lastName: string
  departmentId: number
  formOfWork: string
  institutionId: string
}

export type addDepartmentType = {
  _id: number
  name: string
  departmentNumber: number
  teachers: []
}

export type UpdateDepartmentType = {
  _id: number
  name: string
  departmentNumber: string
}

export type addDepartmentPayloadType = {
  name: string
  departmentNumber: number
  institutionId: string
}

export type onRemoveTeacherPayloadType = {
  id: string
  departmentId: number
}

export type UpdateTeacherType = {
  lastName: string
  firstName: string
  middleName: string
  departmentId: string
  formOfWork: string
  _id: string | number
}
/* // teachers and departments */

/* buildings and auditoriums */
export type onSubmitBuilding = {
  id: number
  name: string
}
export type FetchNewBuildingType = {
  name: string
  auditoriums: []
}

export type onSubmitBuildingsPaylaodTypes = {
  name: string
  auditoriums: []
  institutionId: string
}

export type onSubmitAuditory = {
  name: string
  buildingId: string
  type: string
}
export type onCreateAuditoryType = {
  name: string
  type: string
  buildingId: number
  seatsNumber: number
  institutionId: string
}

export type onRemoveAuditoryType = {
  buildingId: number
  id: number
}
/* // buildings and auditoriums */

/* facultys ans specialtys */
export type CreateFacultyType = {
  name: string
  shortName: string
  institutionId: string
}
export type CreateSpecialtyType = {
  name: string
  shortName: string
  facultyId: string
}

export type UpdateFacultyType = {
  _id: string
  name: string
  shortName: string
}

export type CreateSpecialty = {
  name: string
  shortName: string
  facultieId: string
  institutionId: string
}

export type RemoveSpecialtyType = {
  id: string
  facultieId: string
}

export type UpdateSpecialtyType = {
  id: string
  facultieId: string
  name: string
  shortName: string
}
/* // facultys ans specialtys */

/* group */

export type GroupInfoTypes = {
  /* ????????????????????????????????????????????????????????????????? */
  name: string
  specialtyId: string
  yearOfAdmission: string
  courseNumber: string
  students: string
  formOfEducations: string
  EducationPlanId: string
}

export type CreateGroupPayloadType = {
  name: string
  specialtyId: string
  yearOfAdmission: string
  courseNumber: string
  students: string
  formOfEducations: string
  EducationPlanId: string
  institutionId: string
}

export type UpdateGroupInfoType = {
  _id: string
  name: string
  specialtyId: string
  yearOfAdmission: string
  courseNumber: string
  students: string
  formOfEducations: string
  // EducationPlanId: string
}

export type UpdateGroupLoadType = {
  groupId: string
  planId: string
  load: string[]
}

export type CreateGroupSpecializationType = {
  groupId: string
  name: string
}

export type RemoveGroupSpecializationType = {
  groupId: string
  _id: string
}

export type UpdateGroupSpecializationType = {
  _id: string
  groupId: string
  name: string
}

export type UpdateSpecializationSubjectsType = {
  specializationId: string
  _id: string
  name: string
}

export type CreateSubgroupsType = {
  _id?: string // ????????????????????????????????????????????????????????????????
  institutionId: string
  groupId: string
  name: string
  semester: string
  lectures?: string | null
  practical?: string | null
  laboratory?: string | null
  seminars?: string | null
  exams?: string | null
}

export type RemoveSubgroupsType = {
  groupId: string
  subgroupId: string
}
/* // group */

/* streams */
export type CreateStreamPayloadType = {
  name: string
  institutionId: string
}

export type UpdateStreamType = {
  _id: string
  name: string
  groupId: string[]
}

export type CreateStreamComponentType = {
  _id: string
  name: string
  groupId: string
  groupLoad: string
}

export type RemoveStreamComponentType = {
  _id: string
  streamId: string
}

export type UpdateStreamDetailsType = {
  name: string
  semester: string
  type: string
  subgroupNumber?: number | null
}

/* // streams */

/* distributedLoad */
export type UpdateDistributedLoadType = {
  groupId: string
  groupLoadId: string
  institutionId: string
  currentShowedYear: string
  streamId: string[]
}

export type GetDistributedLoadType = {
  groupId: string
  userId: string
}

export type AttachTeacherPayload = {
  data: AttachTeacherType[]
  currentGroupId: string
}

export type AttachTeacherType = {
  _id: string
  groupId: string
  name: string
  semester: string
  type: string
  subjectType: string
  hours: number
  students: string
  stream: AttachTeacherStreamType | null
  subgroupNumber: number | null
  teacher: string | null
}

export type AttachTeacherStreamType = {
  groups: string[]
  name: string
  streamId: string
  // _id: string
}

export type UpdateStudentsCountType = {
  _id: string
  subjectType: string
  students: string
}

export type GetDistributedLoadBySemesterType = {
  sortType: string
  selectedSemester: string
  id: string
}

/* // distributedLoad */

/* addLessonType */
export type AddLessonsType = {
  groupId: string
  groupName: string
  name: string
  subjectType: string
  teacher: string
  auditory: string
  remark: string
  date: string
  semester: string
  students: string
  subjectNumber: number
}

export type CopyWeekLessonsType = {
  groupId: string
  institutionId: string
  startDateCopyFrom: number
  endDateCopyFrom: number
  startDateCopyTo: number
  endDateCopyTo: number
}

export type UpdateLessonsType = {
  _id: string
  auditory: string
}

export type UpdateStreamLessonsType = {
  groupId: string
  name: string
  date: number
  subjectNumber: number
  auditory: string
  semester: string
}
/* // addLessonType */

/* checkAuditoryOverlay */

export type CheckAuditoryOverlayType = {
  institutionId: string
  semester: string
  subjectNumber: number
  date: string
}

/* // checkAuditoryOverlay */

/* accountInfo Types */
export type UpdateTermsOfStudyPayloadType = {
  institutionId: string
  termsOfStudy: TermsOfStudyType
}

export type UpdateCurrentShowedYearPayloadType = {
  institutionId: string
  currentShowedYear: string
}
/* // accountInfo Types */

/* user settings */
export type UpdateSelectedSemesterType = {
  userId: string
  selectedSemester: string
}
/* // user settings */
