import { createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI } from '../../api/api'
import { LoginDataType, RegisterDataType } from './accountInfoTypes'
import {
  UpdateCurrentShowedYearPayloadType,
  UpdateSelectedSemesterType,
  UpdateTermsOfStudyPayloadType,
} from '../../api/apiTypes'

export const login = createAsyncThunk('accountInfo/login', async (payload: LoginDataType) => {
  const { data } = await authAPI.login(payload)
  return data
})

export const registerInstitution = createAsyncThunk(
  'accountInfo/registerInstitution',
  async (payload: RegisterDataType) => {
    const { data } = await authAPI.register(payload)
    return data
  },
)

export const fetchMe = createAsyncThunk('accountInfo/me', async () => {
  const { data } = await authAPI.fetchMe()
  return data
})

export const fetchInstitution = createAsyncThunk('accountInfo/fetchInstitution', async (id: string) => {
  const { data } = await authAPI.getInstitution(id)
  return data
})

export const updateTermsOfStudy = createAsyncThunk(
  'accountInfo/updateTermsOfStudy',
  async (payload: UpdateTermsOfStudyPayloadType) => {
    const { data } = await authAPI.updateTermsOfStudy(payload)
    return data
  },
)

export const updateCurrentShowedYear = createAsyncThunk(
  'accountInfo/updateCurrentShowedYear',
  async (payload: UpdateCurrentShowedYearPayloadType) => {
    const { data } = await authAPI.updateCurrentShowedYear(payload)
    return data
  },
)

export const updateUserSemester = createAsyncThunk(
  'accountInfo/updateUserSemester',
  async (payload: UpdateSelectedSemesterType) => {
    const { data } = await authAPI.updateUserSemester(payload)
    return data
  },
)
