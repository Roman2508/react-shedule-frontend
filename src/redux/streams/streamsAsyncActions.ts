import { createAsyncThunk } from '@reduxjs/toolkit'
import { groupLoadAPI, streamsAPI } from '../../api/api'
import {
  CreateStreamComponentType,
  CreateStreamPayloadType,
  RemoveStreamComponentType,
  UpdateStreamDetailsType,
  UpdateStreamType,
} from '../../api/apiTypes'

export const getStreams = createAsyncThunk('streams/getStreams', async (institutionId: string) => {
  const { data } = await streamsAPI.getStreams(institutionId)
  return data
})

export const createStream = createAsyncThunk('streams/createStream', async (payload: CreateStreamPayloadType) => {
  const { data } = await streamsAPI.createStream(payload)
  return data
})

export const updateStream = createAsyncThunk('streams/updateStream', async (payload: UpdateStreamType) => {
  const { data } = await streamsAPI.updateStream(payload)
  return data
})

export const removeStream = createAsyncThunk('streams/removeStream', async (_id: string) => {
  const { data } = await streamsAPI.removeStreams(_id)
  return data
})

/* stream component */
export const createStreamComponent = createAsyncThunk(
  'streams/createStreamComponent',
  async (payload: CreateStreamComponentType) => {
    const { data } = await streamsAPI.createStreamComponent(payload)
    return data
  },
)

export const removeStreamsComponent = createAsyncThunk(
  'streams/removeStreamsComponent',
  async (payload: RemoveStreamComponentType) => {
    const { data } = await streamsAPI.removeStreamComponent(payload)
    return data
  },
)
/* // stream component */

/* stream details */
export const updateStreamDetails = createAsyncThunk(
  'streams/updateStreamDetails',
  async (payload: { _id: string; data: UpdateStreamDetailsType[] }) => {
    const { data } = await streamsAPI.updateStreamDetails(payload)
    return data
  },
)

export const removeStreamDetails = createAsyncThunk(
  'streams/removeStreamDetails',
  async (payload: RemoveStreamComponentType) => {
    const { data } = await streamsAPI.removeStreamDetails(payload)
    return data
  },
)
/* // stream details */

export const getGroupLoad = createAsyncThunk('group-load/getGroupLoad', async (id: string) => {
  const { data } = await groupLoadAPI.getGroupLoad(id)
  return data
})
