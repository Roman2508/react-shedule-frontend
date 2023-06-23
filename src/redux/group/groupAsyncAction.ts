import { GroupType, SpecializationSubjectsType } from './groupTypes'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { groupLoadAPI, groupsAPI } from '../../api/api'
import {
  CreateGroupPayloadType,
  CreateGroupSpecializationType,
  CreateSubgroupsType,
  RemoveGroupSpecializationType,
  RemoveSubgroupsType,
  UpdateGroupInfoType,
  UpdateGroupLoadType,
  UpdateGroupSpecializationType,
  UpdateSpecializationSubjectsType,
} from '../../api/apiTypes'

export const getGroups = createAsyncThunk('groups/getGroups', async (specialtyId: string) => {
  const { data } = await groupsAPI.getGroups(specialtyId)
  return data
})

export const getGroupLoadByDepartment = createAsyncThunk(
  'distributedLoad/getDistributedDepartmentLoad',
  async (payload: { currentShowedYear: string; department: string }) => {
    const { data } = await groupLoadAPI.getGroupLoadByDepartment(payload)
    return data
  }
)

export const getAllFacultyGroups = createAsyncThunk('groups/getAllFacultyGroups', async (facultieId: string) => {
  const { data } = await groupsAPI.getAllFacultyGroups(facultieId)
  return data
})

export const getGroupById = createAsyncThunk('groups/getGroupById', async (id: string) => {
  const { data } = await groupsAPI.getGroupById(id)
  return data as GroupType
})

export const createGroup = createAsyncThunk('groups/createGroup', async (payload: CreateGroupPayloadType) => {
  const { data } = await groupsAPI.createGroup(payload)
  return data
})

export const updateGroupInfo = createAsyncThunk('groups/updateGroup', async (payload: UpdateGroupInfoType) => {
  const { data } = await groupsAPI.updateGroupInfo(payload)
  return data
})

export const updateGroupLoad = createAsyncThunk('groups/updateGroupLoad', async (payload: UpdateGroupLoadType) => {
  const { data } = await groupsAPI.updateGroupLoad(payload)
  return data as GroupType
})

export const removeGroup = createAsyncThunk('groups/removeGroup', async (id: string) => {
  const { data } = await groupsAPI.removeGroup(id)
  return data
})

/* specialization */
export const createGroupSpecialization = createAsyncThunk(
  'groups/createGroupSpecialization',
  async (payload: CreateGroupSpecializationType) => {
    const { data } = await groupsAPI.createGroupSpecialization(payload)
    return data
  }
)

export const removeGroupSpecialization = createAsyncThunk(
  'groups/removeGroupSpecialization',
  async (payload: RemoveGroupSpecializationType) => {
    const { data } = await groupsAPI.removeGroupSpecialization(payload)

    return data
  }
)

export const updateGroupSpecialization = createAsyncThunk(
  'groups/updateGroupSpecialization',
  async (payload: UpdateGroupSpecializationType) => {
    const { data } = await groupsAPI.updateGroupSpecialization(payload)
    return data
  }
)
/* // specialization */

/* specializationSubjects */
export const addSubjectSpecialization = createAsyncThunk(
  'groups/addSubjectSpecialization',
  async (payload: SpecializationSubjectsType) => {
    const { data } = await groupsAPI.addSubjectSpecialization(payload)
    return data
  }
)

export const removeSpecializationSubject = createAsyncThunk(
  'groups/removeSpecializationSubject',
  async (payload: RemoveGroupSpecializationType) => {
    const { data } = await groupsAPI.removeSpecializationSubject(payload)
    return data
  }
)

export const updateSpecializationSubjects = createAsyncThunk(
  'groups/updateSpecializationSubjects',
  async (payload: UpdateSpecializationSubjectsType) => {
    const { data } = await groupsAPI.updateSpecializationSubjects(payload)
    return data
  }
)
/* // specializationSubjects */

/* subgroups */
export const getSubgroups = createAsyncThunk('groups/getSubgroups', async (groupId: string) => {
  const { data } = await groupsAPI.getSubgroups(groupId)
  return data
})

export const createSubgroups = createAsyncThunk('groups/createSubgroups', async (payload: CreateSubgroupsType[]) => {
  const { data } = await groupsAPI.createSubgroups(payload)
  return data
})

export const removeSubgroups = createAsyncThunk('groups/removeSubgroups', async (payload: RemoveSubgroupsType) => {
  const { data } = await groupsAPI.removeSubgroups(payload)
  return data
})

export const updateSubgroups = createAsyncThunk('groups/updateSubgroups', async (payload: CreateSubgroupsType[]) => {
  const { data } = await groupsAPI.updateSubgroups(payload)
  return data
})
/* // subgroups */
