import { createSlice } from '@reduxjs/toolkit'
import { AppLoadingStatusTypes } from '../appTypes'
import { InstitutionDataType, UserDataType } from './accountInfoTypes'
import {
  login,
  fetchMe,
  fetchInstitution,
  updateTermsOfStudy,
  updateUserSemester,
  updateCurrentShowedYear,
  registerInstitution,
} from './accountInfoAsyncActions'

type initialStateTypes = {
  userData: null | UserDataType
  institution: null | InstitutionDataType
  loadingStatus: AppLoadingStatusTypes
}

const initialState: initialStateTypes = {
  userData: null,
  institution: null,
  loadingStatus: AppLoadingStatusTypes.NEVER,
}

const accountInfoSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.userData = null
      state.loadingStatus = AppLoadingStatusTypes.NEVER
    },
  },
  extraReducers: (builder) => {
    /* login */
    builder.addCase(login.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.userData = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(login.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* registerInstitution */
    builder.addCase(registerInstitution.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(registerInstitution.fulfilled, (state, action) => {
      state.institution = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(registerInstitution.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* fetchMe */
    builder.addCase(fetchMe.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.userData = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(fetchMe.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* fetchInstitution */
    builder.addCase(fetchInstitution.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(fetchInstitution.fulfilled, (state, action) => {
      state.institution = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(fetchInstitution.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateTermsOfStudy */
    builder.addCase(updateTermsOfStudy.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateTermsOfStudy.fulfilled, (state, action) => {
      if (state.institution) {
        state.institution.settings.termsOfStudy = action.payload
        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(updateTermsOfStudy.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateUserSemester */
    builder.addCase(updateUserSemester.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateUserSemester.fulfilled, (state, action) => {
      if (state.userData) {
        state.userData.settings.selectedSemester = action.payload.selectedSemester
        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(updateUserSemester.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateCurrentShowedYear */
    builder.addCase(updateCurrentShowedYear.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateCurrentShowedYear.fulfilled, (state, action) => {
      if (state.institution) {
        state.institution.settings.currentShowedYear = action.payload
        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(updateCurrentShowedYear.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })
  },
})

export const { logout } = accountInfoSlice.actions

export default accountInfoSlice.reducer
