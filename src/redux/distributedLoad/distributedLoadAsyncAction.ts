import { createAsyncThunk } from '@reduxjs/toolkit'
import { distributedLoadAPI } from '../../api/api'
import {
  AttachTeacherPayload,
  GetDistributedLoadBySemesterType,
  GetDistributedLoadType,
  UpdateDistributedLoadType,
  UpdateStudentsCountType,
} from '../../api/apiTypes'
import { DistributedLoadSubjectsType } from './distributedLoadTypes'

export const updateDistributedLoad = createAsyncThunk(
  'distributedLoad/updateDistributedLoad',
  async (payload: UpdateDistributedLoadType) => {
    const { data } = await distributedLoadAPI.updateDistributedLoad(payload)
    return data
  }
)

export const getDistributedLoad = createAsyncThunk(
  'distributedLoad/getDistributedLoad',
  async (payload: GetDistributedLoadType) => {
    const { data } = await distributedLoadAPI.getDistributedLoad(payload)
    return data
  }
)

export const getDistributedTeacherLoad = createAsyncThunk(
  'distributedLoad/getDistributedTeacherLoad',
  async (payload: { teacher: string; currentShowedYear: string }) => {
    const { data } = await distributedLoadAPI.getDistributedTeacherLoad(payload)
    return data
  }
)

export const getDistributedLoadBySemester = createAsyncThunk<
  DistributedLoadSubjectsType[],
  GetDistributedLoadBySemesterType
>('distributedLoad/getDistributedLoadBySemester', async (payload) => {
  const { data } = await distributedLoadAPI.getDistributedLoadBySemester(payload)
  return data
})

export const attachTeacher = createAsyncThunk(
  'distributedLoad/attachTeacher',
  async (payload: AttachTeacherPayload) => {
    const { data } = await distributedLoadAPI.attachTeacher(payload)
    return data
  }
)

export const updateStudentsCount = createAsyncThunk(
  'distributedLoad/updateStudentsCount',
  async (payload: UpdateStudentsCountType) => {
    const { data } = await distributedLoadAPI.updateStudentsCount(payload)
    return data
  }
)
