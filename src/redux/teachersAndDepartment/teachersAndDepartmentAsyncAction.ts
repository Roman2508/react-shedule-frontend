import { createAsyncThunk } from '@reduxjs/toolkit'
import { teachersAndDepartmentsAPI } from '../../api/api'
import {
  addDepartmentPayloadType,
  addDepartmentType,
  onRemoveTeacherPayloadType,
  onSubmitTeacherType,
  UpdateDepartmentType,
  UpdateTeacherType,
} from '../../api/apiTypes'

/* departments */
export const getAllDepartments = createAsyncThunk(
  'teachersAndDepartments/getAllDepartments',
  async (institutionId: string) => {
    const { data } = await teachersAndDepartmentsAPI.getAllDepartments(institutionId)
    return data
  },
)

export const addDepartment = createAsyncThunk(
  'teachersAndDepartments/addDepartment',
  async (payload: addDepartmentPayloadType) => {
    const { data } = await teachersAndDepartmentsAPI.addDepartment(payload)
    return data as addDepartmentType
  },
)

export const updateDepartment = createAsyncThunk(
  'teachersAndDepartments/updateDepartment',
  async (payload: UpdateDepartmentType) => {
    const { data } = await teachersAndDepartmentsAPI.updateDepartment(payload)
    return data
  },
)

export const removeDepartmentById = createAsyncThunk(
  'teachersAndDepartments/removeDepartmentById',
  async (id: string) => {
    const { data } = await teachersAndDepartmentsAPI.removeDepartment(id)
    return data
  },
)
/* // departments */

/* teachers */
export const addTeacher = createAsyncThunk(
  'teachersAndDepartments/addTeacher',
  async (payload: onSubmitTeacherType) => {
    const { data } = await teachersAndDepartmentsAPI.addTeacher(payload)
    return data
  },
)

export const updateTeacher = createAsyncThunk(
  'teachersAndDepartments/updateTeacher',
  async (payload: UpdateTeacherType) => {
    const { data } = await teachersAndDepartmentsAPI.updateTeacher(payload)
    return data
  },
)

export const removeTeacherById = createAsyncThunk(
  'teachersAndDepartments/removeTeacherById',
  async ({ departmentId, id }: onRemoveTeacherPayloadType) => {
    const { data } = await teachersAndDepartmentsAPI.removeTeacher({ departmentId, id })
    return data
  },
)

/* // teachers */
