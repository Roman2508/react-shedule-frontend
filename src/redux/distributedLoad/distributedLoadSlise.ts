import { createSlice } from '@reduxjs/toolkit'
import { AppLoadingStatusTypes } from '../appTypes'
import {
  attachTeacher,
  getDistributedLoad,
  getDistributedLoadBySemester,
  getDistributedTeacherLoad,
  updateDistributedLoad,
  updateStudentsCount,
} from './distributedLoadAsyncAction'
import { DistributedLoadSubjectsType, DistributedLoadType } from './distributedLoadTypes'

type DistributedLoadInitialStateType = {
  load: DistributedLoadType | null
  teacherLoad: DistributedLoadSubjectsType[] | null
  distributedSemesterLoad: DistributedLoadSubjectsType[] | null
  loadingStatus: AppLoadingStatusTypes
}

const initialState: DistributedLoadInitialStateType = {
  load: null,
  teacherLoad: null,
  distributedSemesterLoad: null,
  loadingStatus: AppLoadingStatusTypes.NEVER,
}

const distributedLoadSlise = createSlice({
  name: 'distributedLoad',
  initialState,
  reducers: {
    clearDistributedLoad(state) {
      state.load = null
    },
  },
  extraReducers: (builder) => {
    /* updateDistributedLoad */
    builder.addCase(updateDistributedLoad.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateDistributedLoad.fulfilled, (state, action) => {
      state.load = action.payload

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(updateDistributedLoad.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* getDistributedLoad */
    builder.addCase(getDistributedLoad.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getDistributedLoad.fulfilled, (state, action) => {
      state.load = action.payload

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getDistributedLoad.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* getDistributedTeacherLoad */
    builder.addCase(getDistributedTeacherLoad.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getDistributedTeacherLoad.fulfilled, (state, action) => {
      state.teacherLoad = action.payload
      state.distributedSemesterLoad = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getDistributedTeacherLoad.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* getDistributedLoadBySemester */
    builder.addCase(getDistributedLoadBySemester.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getDistributedLoadBySemester.fulfilled, (state, { payload }) => {
      state.distributedSemesterLoad = payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getDistributedLoadBySemester.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* attachTeacher */
    builder.addCase(attachTeacher.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(attachTeacher.fulfilled, (state, action) => {
      if (state.load !== null) {
        const newLoad = state.load.load.map((el) => {
          if (el._id === action.payload._id) {
            return action.payload
          }
          return el
        })

        state.load.load = newLoad

        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(attachTeacher.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateStudentsCount */
    builder.addCase(updateStudentsCount.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateStudentsCount.fulfilled, (state, action) => {
      if (state.load) {
        const newLoad = state.load.load.map((el) => {
          if (el._id === action.payload._id) {
            return action.payload
          }
          return el
        })

        state.load.load = newLoad
        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(updateStudentsCount.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })
  },
})

export const { clearDistributedLoad } = distributedLoadSlise.actions

export default distributedLoadSlise.reducer
