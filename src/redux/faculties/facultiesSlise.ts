import { createSlice } from '@reduxjs/toolkit'
import { AppLoadingStatusTypes } from '../appTypes'
import {
  createFaculty,
  createSpecialty,
  getAllFaculties,
  removeFaculty,
  removeSpecialty,
  updateFaculty,
  updateSpecialty,
} from './facultiesAsyncAction'
import { FacultyType } from './facultiesTypes'

type FacultiesInitialStateType = {
  faculties: FacultyType[] | []
  loadingStatus: AppLoadingStatusTypes
}

const initialState: FacultiesInitialStateType = {
  faculties: [],
  loadingStatus: AppLoadingStatusTypes.NEVER,
}

const facultiesSlist = createSlice({
  name: 'faculties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* getAllFaculties */
    builder.addCase(getAllFaculties.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getAllFaculties.fulfilled, (state, action) => {
      state.faculties = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getAllFaculties.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* createFaculty */
    builder.addCase(createFaculty.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(createFaculty.fulfilled, (state, action) => {
      state.faculties = [...state.faculties, action.payload]
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(createFaculty.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeFaculty */
    builder.addCase(removeFaculty.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeFaculty.fulfilled, (state, action) => {
      const newFaculties = state.faculties.filter((el) => el._id !== action.payload.id)

      state.faculties = newFaculties
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeFaculty.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateFaculty */
    builder.addCase(updateFaculty.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateFaculty.fulfilled, (state, action) => {
      const newState = state.faculties.map((el) => {
        if (el._id === action.payload._id) {
          return action.payload
        }
        return el
      })

      state.faculties = newState
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(updateFaculty.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* /// /// /// /// /// /// /// /// /// /// */

    /* createSpecialty */
    builder.addCase(createSpecialty.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(createSpecialty.fulfilled, (state, action) => {
      const newData = state.faculties.map((el) => {
        if (el._id === action.payload.facultieId) {
          el.specialties.push(action.payload)
          return el
        }
        return el
      })

      state.faculties = [...newData]
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })

    builder.addCase(createSpecialty.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeSpecialty */
    builder.addCase(removeSpecialty.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeSpecialty.fulfilled, (state, action) => {
      const newFaculties = state.faculties.map((el) => {
        if (el._id === action.payload.facultieId) {
          const specialties = el.specialties.filter((s) => s._id !== action.payload.id)
          return { ...el, specialties }
        }
        return el
      })

      state.faculties = newFaculties

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeSpecialty.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateSpecialty */
    builder.addCase(updateSpecialty.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateSpecialty.fulfilled, (state, action) => {
      const newFaculties = state.faculties.map((el) => {
        if (el._id === action.payload.facultieId) {
          const specialties = el.specialties.map((s) => {
            if (s._id === action.payload._id) {
              return action.payload
            }
            return s
          })
          return { ...el, specialties }
        }
        return el
      })

      state.faculties = newFaculties

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(updateSpecialty.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })
  },
})

export const {} = facultiesSlist.actions

export default facultiesSlist.reducer
