import axios, { AxiosResponse } from 'axios'
// require('dotenv')
import { AuditoriumsType } from '../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'
import {
  EducationalPlanGroupsType,
  EducationalPlanSubjectTypes,
  EducationalPlanType,
} from '../redux/educationalPlan/educationalPlanTypes'
import { GroupLoadItemType, SpecializationSubjectsType } from '../redux/group/groupTypes'
import { lessonsType, RemoveStreamLessonType } from '../redux/lessons/lessonsTypes'
import {
  addDepartmentPayloadType,
  AddLessonsType,
  AttachTeacherPayload,
  AttachTeacherType,
  changeEducationPlanNameType,
  CheckAuditoryOverlayType,
  CopyWeekLessonsType,
  CreateEducationPlanGroupPayload,
  CreateFacultyType,
  CreateGroupPayloadType,
  CreateGroupSpecializationType,
  createNewEducationPlanType,
  createNewSubjectType,
  CreateSpecialty,
  CreateStreamComponentType,
  CreateStreamPayloadType,
  CreateSubgroupsType,
  FetchNewBuildingType,
  GetDistributedLoadBySemesterType,
  GetDistributedLoadType,
  onCreateAuditoryType,
  onRemoveAuditoryType,
  onRemoveTeacherPayloadType,
  onSubmitBuilding,
  onSubmitTeacherType,
  removeEducationPlanType,
  RemoveGroupSpecializationType,
  RemoveSpecialtyType,
  RemoveStreamComponentType,
  RemoveSubgroupsType,
  UpdateCurrentShowedYearPayloadType,
  UpdateDepartmentType,
  UpdateDistributedLoadType,
  UpdatedSubjectPayload,
  UpdateFacultyType,
  UpdateGroupInfoType,
  UpdateGroupLoadType,
  UpdateGroupSpecializationType,
  UpdateLessonsType,
  UpdateSelectedSemesterType,
  UpdateSpecializationSubjectsType,
  UpdateSpecialtyType,
  UpdateStreamDetailsType,
  UpdateStreamLessonsType,
  UpdateStreamType,
  UpdateStudentsCountType,
  UpdateTeacherType,
  UpdateTermsOfStudyPayloadType,
} from './apiTypes'
import { LoginDataType, RegisterDataType } from '../redux/accountInfo/accountInfoTypes'
import { DistributedLoadSubjectsType } from '../redux/distributedLoad/distributedLoadTypes'

const instanse = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:4444/' : 'https://timetable-server.onrender.com/',
})

// Якщо є токен, вшиваю його в конфігурацію axios
instanse.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization = String(globalThis.localStorage.getItem('token'))

    return config
  }
})

export const educationalPlansAPI = {
  /* EducationPlanGroup */
  getEducationPlansGroup(institutionId: string) {
    return instanse.get(`educationPlansGroup/${institutionId}`)
  },
  createNewEducationPlanGroup(payload: CreateEducationPlanGroupPayload) {
    return instanse.post<EducationalPlanGroupsType>(`educationPlansGroup`, payload)
  },
  removeEducationPlansGroup(id: number) {
    return instanse.delete(`educationPlansGroup/${id}`)
  },
  changeEducationPlansGroupName(id: string, name: string) {
    return instanse.patch(`educationPlansGroup/${id}`, { name })
  },
  /* EducationPlan */
  createNewEducationPlan(payload: createNewEducationPlanType) {
    return instanse.post<EducationalPlanType>(`educationPlans`, payload)
  },
  getPlanById(id: string) {
    return instanse.get(`educationPlans/${id}`)
  },
  removeEducationPlan(id: number) {
    return instanse.delete<removeEducationPlanType>(`educationPlans/${id}`)
  },
  changeEducationPlanName(payload: changeEducationPlanNameType) {
    const { id, ...data } = payload
    return instanse.patch(`educationPlans/${id}`, data)
  },
  /* Subjects */
  changeSubjectHours(id: number, payload: any) {
    return instanse.patch<UpdatedSubjectPayload>(`subjectsList/${id}`, payload)
  },
  removeSubjectSemester(id: number, payload: string) {
    return instanse.patch(`subjectsList/${id}/semester`, { payload })
  },
  createNewSubject(payload: createNewSubjectType) {
    return instanse.post<EducationalPlanSubjectTypes>(`subjectsList`, payload)
  },
  removeSubject(id: string) {
    return instanse.delete(`subjectsList/${id}`)
  },
  updateSubjectName(id: string, name: string, departmentId: string) {
    return instanse.patch(`subjectsList/name-and-department/${id}`, { name, departmentId })
  },
}

export const teachersAndDepartmentsAPI = {
  getAllDepartments(institutionId: string) {
    return instanse.get(`departments/${institutionId}`)
  },
  addDepartment(payload: addDepartmentPayloadType) {
    return instanse.post(`departments`, payload)
  },
  updateDepartment(payload: UpdateDepartmentType) {
    const { _id, ...data } = payload
    return instanse.patch(`departments/${_id}`, data)
  },
  removeDepartment(id: string) {
    return instanse.delete(`departments/${id}`)
  },
  addTeacher(payload: onSubmitTeacherType) {
    return instanse.post(`teachers`, payload)
  },
  updateTeacher(payload: UpdateTeacherType) {
    const { _id, ...data } = payload
    return instanse.patch(`teachers/${_id}`, data)
  },
  removeTeacher({ departmentId, id }: onRemoveTeacherPayloadType) {
    return instanse.delete(`teachers/${departmentId}/${id}`)
  },
}

export const buildingsAndAuditoriumsAPI = {
  getAllBuildings(institutionId: string) {
    return instanse.get(`buildings/${institutionId}`)
  },
  updateBuildingById(payload: onSubmitBuilding) {
    const { id, name } = payload
    return instanse.patch(`buildings/${id}`, { name })
  },
  createBuilding(payload: FetchNewBuildingType) {
    return instanse.post(`buildings`, payload)
  },
  removeBuildingById(id: string) {
    return instanse.delete(`buildings/${id}`)
  },
  addAuditory(payload: onCreateAuditoryType) {
    return instanse.post(`auditoriums`, payload)
  },
  removeAuditoryById({ buildingId, id }: onRemoveAuditoryType) {
    return instanse.delete(`auditoriums/${buildingId}/${id}`)
  },
  updateAuditoryById(payload: AuditoriumsType) {
    const { _id, ...data } = payload
    return instanse.patch(`auditoriums/${_id}`, data)
  },
}

export const facultiesAPI = {
  /* faculties */
  getAllFaculties(institutionId: string) {
    return instanse.get(`faculties/${institutionId}`)
  },
  createFaculty(payload: CreateFacultyType) {
    return instanse.post(`faculties`, payload)
  },
  removeFaculty(id: string) {
    return instanse.delete(`faculties/${id}`)
  },
  updateFaculty(payload: UpdateFacultyType) {
    const { _id, ...data } = payload
    return instanse.patch(`faculties/${_id}`, data)
  },

  /* specialties */
  getActiveSpecialties(id: string) {
    return instanse.get(`specialties/${id}`)
  },
  createSpecialty(payload: CreateSpecialty) {
    return instanse.post(`specialties`, payload)
  },
  removeSpecialty(payload: RemoveSpecialtyType) {
    const { facultieId, id } = payload
    return instanse.delete(`specialties/${facultieId}/${id}`)
  },
  updateSpecialty(payload: UpdateSpecialtyType) {
    const { id, ...rest } = payload
    return instanse.patch(`specialties/${id}`, rest)
  },
}

export const groupsAPI = {
  getGroups(specialtyId: string) {
    return instanse.get(`groups/${specialtyId}`)
  },
  getAllFacultyGroups(facultieId: string) {
    return instanse.get(`groups/all/${facultieId}`)
  },
  getGroupById(id: string) {
    return instanse.get(`groups/one/${id}`)
  },
  createGroup(payload: CreateGroupPayloadType) {
    return instanse.post('groups', payload)
  },
  updateGroupInfo(payload: UpdateGroupInfoType) {
    return instanse.patch(`groups/info/${payload._id}`, payload)
  },
  updateGroupLoad(payload: UpdateGroupLoadType) {
    return instanse.patch(`groups/load/${payload.groupId}`, payload)
  },
  removeGroup(id: string) {
    return instanse.delete(`groups/${id}`)
  },
  /* GroupSpecializationList */
  createGroupSpecialization(payload: CreateGroupSpecializationType) {
    const { groupId, name } = payload
    return instanse.post(`/groups/specialization-list/${groupId}`, { name })
  },
  removeGroupSpecialization(payload: RemoveGroupSpecializationType) {
    const { groupId, _id } = payload
    return instanse.delete(`/groups/specialization-list/${groupId}`, { data: { _id } })
  },
  updateGroupSpecialization(payload: UpdateGroupSpecializationType) {
    const { groupId, ...data } = payload
    return instanse.patch(`/groups/specialization-list/${groupId}`, data)
  },

  /* GroupSpecializationSubject */
  addSubjectSpecialization(payload: SpecializationSubjectsType) {
    return instanse.post(`/groups/specialization-subjects/${payload.groupId}`, payload)
  },
  removeSpecializationSubject(payload: RemoveGroupSpecializationType) {
    return instanse.delete(`/groups/specialization-subjects/${payload.groupId}/${payload._id}`)
  },
  updateSpecializationSubjects(payload: UpdateSpecializationSubjectsType) {
    const { specializationId, ...data } = payload
    return instanse.patch(`/groups/specialization-subjects/${specializationId}`, data)
  },

  /* Subgroups */
  getSubgroups(groupId: string) {
    return instanse.get(`/groups/subgroups/${groupId}`)
  },

  createSubgroups(payload: CreateSubgroupsType[]) {
    return instanse.post(`/groups/subgroups/${payload[0].groupId}`, payload)
  },
  removeSubgroups(payload: RemoveSubgroupsType) {
    return instanse.delete(`/groups/subgroups/${payload.groupId}/${payload.subgroupId}`)
  },
  updateSubgroups(payload: CreateSubgroupsType[]) {
    return instanse.patch(`/groups/subgroups`, payload)
  },
}

export const streamsAPI = {
  getStreams(institutionId: string) {
    return instanse.get(`/streams/${institutionId}`)
  },
  createStream(payload: CreateStreamPayloadType) {
    return instanse.post('/streams', payload)
  },
  updateStream(payload: UpdateStreamType) {
    return instanse.patch(`/streams/${payload._id}`, { name: payload.name, groupId: payload.groupId })
  },
  removeStreams(_id: string) {
    return instanse.delete(`/streams/${_id}`)
  },
  /* stream components */
  createStreamComponent(payload: CreateStreamComponentType) {
    const { _id, ...data } = payload
    return instanse.post(`/streams/components/${_id}`, data)
  },
  removeStreamComponent(payload: RemoveStreamComponentType) {
    const { _id, streamId } = payload
    return instanse.delete(`/streams/components/${streamId}/${_id}`)
  },
  /* stream details */
  updateStreamDetails(payload: { _id: string; data: UpdateStreamDetailsType[] }) {
    const { _id, data } = payload
    return instanse.patch(`/streams/details/${_id}`, data)
  },
  removeStreamDetails(payload: RemoveStreamComponentType) {
    const { _id, streamId } = payload
    return instanse.delete(`/streams/details/${streamId}/${_id}`)
  },
}

export const groupLoadAPI = {
  getGroupLoad(id: string) {
    return instanse.get(`/group-load/${id}`)
  },
  getGroupLoadByDepartment(payload: { currentShowedYear: string; department: string }) {
    const { currentShowedYear, department } = payload
    return instanse.get<null, AxiosResponse<GroupLoadItemType[]>>(`groups/load/${currentShowedYear}/${department}`)
  },
}

export const lessonsAPI = {
  getAllLessons(payload: { id: string; type: string; institutionId: string }) {
    return instanse.get(`/lessons/${payload.institutionId}/${payload.type}/${payload.id}`)
  },
  addNewLesson(payload: AddLessonsType) {
    return instanse.post(`/lessons`, payload)
  },
  copyWeekLessons(payload: CopyWeekLessonsType) {
    return instanse.post(`/lessons/several`, payload)
  },
  removeLesson(id: string) {
    return instanse.delete(`/lessons/${id}`)
  },
  removeStreamLessons(payload: RemoveStreamLessonType) {
    return instanse.post('/lessons/remove-streams', payload)
  },
  updateAuditory(payload: UpdateLessonsType) {
    const { _id, auditory } = payload
    return instanse.patch(`/lessons/${_id}`, { auditory })
  },
  updateStreamAuditory(payload: UpdateStreamLessonsType) {
    const { groupId, ...data } = payload
    return instanse.patch(`/lessons/update-streams/${groupId}`, data)
  },
  checkAuditoryOverlay(payload: CheckAuditoryOverlayType) {
    const { date, semester, subjectNumber, institutionId } = payload
    return instanse.get(`/lessons/${institutionId}/${semester}/${subjectNumber}/${date}`)
  },
}

export const authAPI = {
  login(data: LoginDataType) {
    return instanse.post('/auth/login', data)
  },
  register(data: RegisterDataType) {
    return instanse.post('/auth/register', data)
  },
  fetchMe() {
    return instanse.post('/auth/me')
  },
  getInstitution(id: string) {
    return instanse.get(`/institutions/${id}`)
  },
  updateTermsOfStudy(payload: UpdateTermsOfStudyPayloadType) {
    const { institutionId, ...data } = payload
    return instanse.patch(`/institutions/termsOfStudy/${institutionId}`, data)
  },
  updateCurrentShowedYear(payload: UpdateCurrentShowedYearPayloadType) {
    const { institutionId, currentShowedYear } = payload
    return instanse.patch(`/institutions/currentShowedYear/${institutionId}`, { currentShowedYear })
  },
  updateUserSemester(payload: UpdateSelectedSemesterType) {
    const { userId, ...data } = payload
    return instanse.patch(`/user/semester/${userId}`, data)
  },
}

export const distributedLoadAPI = {
  updateDistributedLoad(payload: UpdateDistributedLoadType) {
    return instanse.patch('/distributed-load', payload)
  },
  getDistributedLoad({ groupId, userId }: GetDistributedLoadType) {
    return instanse.get(`/distributed-load/${userId}/${groupId}`)
  },
  getDistributedTeacherLoad(payload: { teacher: string; currentShowedYear: string }) {
    const { teacher, currentShowedYear } = payload
    return instanse.get(`/distributed-load/teacher/${currentShowedYear}/${teacher}`)
  },
  getDistributedLoadBySemester(payload: GetDistributedLoadBySemesterType) {
    const { sortType, selectedSemester, id } = payload
    return instanse.get(`/distributed-semester-load/${sortType}/${selectedSemester}/${id}`)
  },
  attachTeacher(payload: AttachTeacherPayload) {
    // const id = payload[0]._id
    const { data, currentGroupId } = payload

    return instanse.patch(`/distributed-load/attach-teacher/${currentGroupId}`, data)
  },

  updateStudentsCount(payload: UpdateStudentsCountType) {
    const { _id, ...data } = payload
    return instanse.patch(`/distributed-load/students-count/${_id}`, data)
  },
}
