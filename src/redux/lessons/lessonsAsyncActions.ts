import { createAsyncThunk } from '@reduxjs/toolkit'
import { lessonsAPI } from '../../api/api'
import {
  AddLessonsType,
  CheckAuditoryOverlayType,
  CopyWeekLessonsType,
  UpdateLessonsType,
  UpdateStreamLessonsType,
} from '../../api/apiTypes'
import { lessonsType, RemoveStreamLessonType } from './lessonsTypes'

// export const getAllLessons = createAsyncThunk(
//   'lessons/getAllLessons',
//   async (payload: { id: string; type: string }) => {
//     const { data } = await lessonsAPI.getAllLessons(payload)
//     return data as lessonsType[]
//   },
// )

export const getLessonsById = createAsyncThunk(
  'lessons/getLessonsById',
  async (payload: { id: string; type: string; institutionId: string }) => {
    const { data } = await lessonsAPI.getAllLessons(payload)
    return data as lessonsType[]
  },
)

export const addNewLesson = createAsyncThunk('lessons/addNewLesson', async (payload: AddLessonsType) => {
  const { data } = await lessonsAPI.addNewLesson(payload)
  return data
})

export const copyWeekLessons = createAsyncThunk('lessons/copyWeekLessons', async (payload: CopyWeekLessonsType) => {
  const { data } = await lessonsAPI.copyWeekLessons(payload)
  return data
})

export const removeLesson = createAsyncThunk('lessons/removeLesson', async (id: string) => {
  const { data } = await lessonsAPI.removeLesson(id)
  return data
})

export const removeStreamLessons = createAsyncThunk(
  'lessons/remove-streams',
  async (payload: RemoveStreamLessonType) => {
    const { data } = await lessonsAPI.removeStreamLessons(payload)
    return data
  },
)

export const updateAuditory = createAsyncThunk('lessons/updateAuditory', async (payload: UpdateLessonsType) => {
  const { data } = await lessonsAPI.updateAuditory(payload)
  return data
})

export const updateStreamsAuditory = createAsyncThunk(
  'lessons/updateStreamsAuditory',
  async (payload: UpdateStreamLessonsType) => {
    const { data } = await lessonsAPI.updateStreamAuditory(payload)
    return data
  },
)

/*  */

export const getTeacherLessons = createAsyncThunk(
  'lessons/getTeacherLessons',
  async (payload: { id: string; type: string; institutionId: string }) => {
    const { data } = await lessonsAPI.getAllLessons(payload)
    return data as lessonsType[]
  },
)

export const getGroupLessons = createAsyncThunk(
  'lessons/getGroupLessons',
  async (payload: { id: string; type: string; institutionId: string }) => {
    const { data } = await lessonsAPI.getAllLessons(payload)
    return data as lessonsType[]
  },
)

export const getAuditoryLessons = createAsyncThunk(
  'lessons/getAuditoryLessons',
  async (payload: { id: string; type: string; institutionId: string }) => {
    const { data } = await lessonsAPI.getAllLessons(payload)
    return data as lessonsType[]
  },
)

export const checkAuditoryOverlay = createAsyncThunk(
  'lessons/checkAuditoryOverlay',
  async (payload: CheckAuditoryOverlayType) => {
    const { data } = await lessonsAPI.checkAuditoryOverlay(payload)
    return data
  },
)
