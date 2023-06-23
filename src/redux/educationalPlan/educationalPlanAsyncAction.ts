import { createAsyncThunk } from '@reduxjs/toolkit'
import { educationalPlansAPI } from '../../api/api'
import {
  changeEducationPlanNameType,
  CreateEducationPlanGroupPayload,
  createNewEducationPlanType,
  createNewSubjectType,
  fetchChangeSubjectHoursType,
  removeEducationPlanType,
  removeSubjectSemesterType,
  UpdateEdPlanNameType,
  updateSubjectNameType,
} from '../../api/apiTypes'
import { EducationalPlanGroupsType, EducationalPlanSubjectTypes, EducationalPlanType } from './educationalPlanTypes'

/* EducationPlanGroup */
export const fetchEducationalPlans = createAsyncThunk(
  'educationalPlans/fetchEducationalPlans',
  async (institutionId: string) => {
    const { data } = await educationalPlansAPI.getEducationPlansGroup(institutionId)
    return data
  }
)

export const createNewEducationPlanGroup = createAsyncThunk(
  'educationalPlans/createNewEducationPlanGroup',
  async (payload: CreateEducationPlanGroupPayload) => {
    const { data } = await educationalPlansAPI.createNewEducationPlanGroup(payload)
    return data as EducationalPlanGroupsType
  }
)

export const removeEducationPlanGroup = createAsyncThunk(
  'educationalPlans/removeEducationPlanGroup',
  async (id: number) => {
    const { data } = await educationalPlansAPI.removeEducationPlansGroup(id)
    return data
  }
)
export const changeEducationPlanGroupName = createAsyncThunk(
  'educationalPlans/changeEducationPlanGroupName',
  async (payload: UpdateEdPlanNameType) => {
    const { id, name } = payload
    const { data } = await educationalPlansAPI.changeEducationPlansGroupName(id, name)
    return data
  }
)

/* EducationPlan */

export const createNewEducationPlan = createAsyncThunk(
  'educationalPlans/createNewEducationPlan',
  async (payload: createNewEducationPlanType) => {
    // const { name, categoryId } = payload
    const { data } = await educationalPlansAPI.createNewEducationPlan(payload)
    return data as EducationalPlanType
  }
)

export const fetchEducationalPlansById = createAsyncThunk(
  'educationalPlans/fetchEducationalPlansById',
  async (id: string) => {
    const { data } = await educationalPlansAPI.getPlanById(id)
    return data
  }
)

export const removeEducationPlan = createAsyncThunk('educationalPlans/removeEducationPlan', async (id: number) => {
  const { data } = await educationalPlansAPI.removeEducationPlan(id)
  return data as removeEducationPlanType
})

export const changeEducationPlanName = createAsyncThunk(
  'educationalPlans/changeEducationPlanName',
  async (payload: changeEducationPlanNameType) => {
    const { data } = await educationalPlansAPI.changeEducationPlanName(payload)
    return data
  }
)

/* Subjects */

export const fetchChangeSubjectHours = createAsyncThunk(
  'educationalPlans/fetchChangeSubjectHours',
  async (newData: fetchChangeSubjectHoursType) => {
    const { id, payload, semester } = newData

    const { data } = await educationalPlansAPI.changeSubjectHours(id, { [semester]: payload })
    return data
  }
)

export const removeSubjectSemester = createAsyncThunk(
  'educationalPlans/removeSubjectSemester',
  async (payload: removeSubjectSemesterType) => {
    const { data } = await educationalPlansAPI.removeSubjectSemester(payload.id, payload.payload /* , payload.planId */)
    return data
  }
)

export const createNewSubject = createAsyncThunk(
  'educationalPlans/createNewSubject',
  async (payload: createNewSubjectType) => {
    const { data } = await educationalPlansAPI.createNewSubject(payload)
    return data as EducationalPlanSubjectTypes
  }
)

export const removeSubject = createAsyncThunk('educationalPlans/removeSubject', async (id: string) => {
  const { data } = await educationalPlansAPI.removeSubject(id)
  return data
})

export const updateSubjectName = createAsyncThunk(
  'educationalPlans/updateSubjectName',
  async (payload: updateSubjectNameType) => {
    const { id, name, departmentId } = payload
    const { data } = await educationalPlansAPI.updateSubjectName(id, name, departmentId)
    return data
  }
)
