import { CreateSpecialty, RemoveSpecialtyType, UpdateSpecialtyType } from './../../api/apiTypes'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { facultiesAPI } from '../../api/api'
import { CreateFacultyType, UpdateFacultyType } from '../../api/apiTypes'
import { FacultyType } from './facultiesTypes'

export const getAllFaculties = createAsyncThunk('faculties/getAllFaculties', async (institutionId: string) => {
  const { data } = await facultiesAPI.getAllFaculties(institutionId)
  return data
})

export const createFaculty = createAsyncThunk('faculties/createFaculty', async (payload: CreateFacultyType) => {
  const { data } = await facultiesAPI.createFaculty(payload)
  return data as FacultyType
})

export const removeFaculty = createAsyncThunk('faculties/removeFaculty', async (id: string) => {
  const { data } = await facultiesAPI.removeFaculty(id)
  return data
})

export const updateFaculty = createAsyncThunk('faculties/updateFaculty', async (payload: UpdateFacultyType) => {
  const { data } = await facultiesAPI.updateFaculty(payload)
  return data
})

/* specialty */

/* export const getActiveSpecialty = createAsyncThunk('specialties/getActiveSpecialty', async (id: string) => {
  const { data } = await facultiesAPI.getActiveSpecialties(id)
  return data
}) */

export const createSpecialty = createAsyncThunk('specialties/createSpecialty', async (payload: CreateSpecialty) => {
  const { data } = await facultiesAPI.createSpecialty(payload)
  return data
})

export const removeSpecialty = createAsyncThunk('specialties/removeSpecialty', async (payload: RemoveSpecialtyType) => {
  const { data } = await facultiesAPI.removeSpecialty(payload)
  return data
})

export const updateSpecialty = createAsyncThunk('specialties/updateSpecialty', async (payload: UpdateSpecialtyType) => {
  const { data } = await facultiesAPI.updateSpecialty(payload)
  return data
})
