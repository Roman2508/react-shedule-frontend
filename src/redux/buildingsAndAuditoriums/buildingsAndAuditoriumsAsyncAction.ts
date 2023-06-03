import { AuditoriumsType, BuildingsType } from './buildingsAndAuditoriumsTypes'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { buildingsAndAuditoriumsAPI } from '../../api/api'
import { FetchNewBuildingType, onCreateAuditoryType, onRemoveAuditoryType, onSubmitBuilding } from '../../api/apiTypes'

/* buildings */
export const getAllBuildings = createAsyncThunk(
  'buildingsAndAuditoriums/getAllBuildings',
  async (institutionId: string) => {
    const { data } = await buildingsAndAuditoriumsAPI.getAllBuildings(institutionId)
    return data /* as BuildingsType[] */
  },
)

export const updateBuilding = createAsyncThunk(
  'buildingsAndAuditoriums/updateBuildingById',
  async (payload: onSubmitBuilding) => {
    const { data } = await buildingsAndAuditoriumsAPI.updateBuildingById(payload)
    return data as BuildingsType
  },
)

export const addBuilding = createAsyncThunk(
  'buildingsAndAuditoriums/addBuilding',
  async (payload: FetchNewBuildingType) => {
    const { data } = await buildingsAndAuditoriumsAPI.createBuilding(payload)
    return data as BuildingsType
  },
)

export const removeBuilding = createAsyncThunk('buildingsAndAuditoriums/removeBuilding', async (id: string) => {
  const { data } = await buildingsAndAuditoriumsAPI.removeBuildingById(id)
  return data
})
/* // buildings */

/*  auditoriums */
export const addAuditory = createAsyncThunk(
  'buildingsAndAuditoriums/addAuditory',
  async (payload: onCreateAuditoryType) => {
    const { data } = await buildingsAndAuditoriumsAPI.addAuditory(payload)
    return data
  },
)

export const removeAuditory = createAsyncThunk(
  'buildingsAndAuditoriums/removeAuditoryById',
  async ({ buildingId, id }: onRemoveAuditoryType) => {
    const { data } = await buildingsAndAuditoriumsAPI.removeAuditoryById({ buildingId, id })
    return data
  },
)

export const updateAuditory = createAsyncThunk(
  'buildingsAndAuditoriums/updateAuditory',
  async (payload: AuditoriumsType) => {
    const { data } = await buildingsAndAuditoriumsAPI.updateAuditoryById(payload)
    return data
  },
)
/* // auditoriums */
