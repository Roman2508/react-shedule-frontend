import { createSlice } from '@reduxjs/toolkit'
import { AppLoadingStatusTypes } from '../appTypes'
import {
  changeEducationPlanGroupName,
  changeEducationPlanName,
  createNewEducationPlan,
  createNewEducationPlanGroup,
  createNewSubject,
  fetchChangeSubjectHours,
  fetchEducationalPlans,
  fetchEducationalPlansById,
  removeEducationPlan,
  removeEducationPlanGroup,
  removeSubject,
  removeSubjectSemester,
  updateSubjectName,
} from './educationalPlanAsyncAction'
import { EducationalPlanGroupsType, EducationalPlanType } from './educationalPlanTypes'

export interface EducationalPlansStateType {
  plans: EducationalPlanGroupsType[] | null
  selectedPlan: {
    plan: EducationalPlanType | null
    loadingStatus: AppLoadingStatusTypes
  }
  loadingStatus: AppLoadingStatusTypes
}

const initialState: EducationalPlansStateType = {
  plans: null,
  selectedPlan: {
    plan: null,
    loadingStatus: AppLoadingStatusTypes.NEVER,
  },
  loadingStatus: AppLoadingStatusTypes.NEVER,
}

const educationalPlansSlice = createSlice({
  name: 'educationalPlans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchEducationalPlans (get all educational plans group) //
    builder.addCase(fetchEducationalPlans.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(fetchEducationalPlans.fulfilled, (state, action) => {
      state.plans = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(fetchEducationalPlans.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    // createNewEducationPlanGroup //
    builder.addCase(createNewEducationPlanGroup.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(createNewEducationPlanGroup.fulfilled, (state, action) => {
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      state.plans?.push(action.payload)
    })
    builder.addCase(createNewEducationPlanGroup.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* changeEducationPlanGroupName */
    builder.addCase(changeEducationPlanGroupName.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(changeEducationPlanGroupName.fulfilled, (state, action) => {
      const newPlans = state.plans?.map((el) => {
        if (el._id === action.payload._id) {
          return { ...el, name: action.payload.name }
        }
        return el
      })

      if (newPlans) {
        state.plans = newPlans

        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(changeEducationPlanGroupName.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    // removeEducationPlanGroup //
    builder.addCase(removeEducationPlanGroup.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeEducationPlanGroup.fulfilled, (state, action) => {
      const newPlans = state.plans?.filter((el) => el._id !== action.payload.id)

      if (newPlans) {
        state.plans = newPlans
        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(removeEducationPlanGroup.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* // */
    /* // */
    /* // */

    // changeEducationPlanName (update educational plan) //
    builder.addCase(changeEducationPlanName.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(changeEducationPlanName.fulfilled, (state, action) => {
      if (state.plans) {
        const updatedPlan = state.plans.map((el) => {
          if (el._id === action.payload.categoryId) {
            const plans = el.plans.map((p) => {
              if (p._id === action.payload._id) {
                return action.payload
              }
              return p
            })
            return { ...el, plans }
          }
          return el
        })
        state.plans = updatedPlan

        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(changeEducationPlanName.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /*  */
    /*  */

    // createNewEducationPlan //
    builder.addCase(createNewEducationPlan.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(createNewEducationPlan.fulfilled, (state, action) => {
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS

      if (state.plans !== null) {
        state.plans.map((el) => {
          if (el._id === action.payload.categoryId) {
            el.plans.push(action.payload)
            return el
          }
          return el
        })
      }
    })
    builder.addCase(createNewEducationPlan.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })
    // removeEducationPlan //
    builder.addCase(removeEducationPlan.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeEducationPlan.fulfilled, (state, action) => {
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      if (state.plans !== null) {
        const newState = state.plans.map((el) => {
          if (el._id === action.payload.categoryId) {
            const newPlans = el.plans.filter((p) => p._id !== action.payload.id)
            el.plans = newPlans
            return el
          }
          return el
        })
      }
    })
    builder.addCase(removeEducationPlan.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /*  */
    /*  */

    // fetchEducationalPlansById (on open educational plan) //
    builder.addCase(fetchEducationalPlansById.pending, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.LOADING
      state.selectedPlan.plan = null
    })
    builder.addCase(fetchEducationalPlansById.fulfilled, (state, action) => {
      state.selectedPlan.plan = action.payload
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(fetchEducationalPlansById.rejected, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    // fetchChangeSubjectHours //
    builder.addCase(fetchChangeSubjectHours.pending, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(fetchChangeSubjectHours.fulfilled, (state, action) => {
      if (state.selectedPlan.plan) {
        const newSubjects = state.selectedPlan.plan.subjects.map((el) => {
          if (el._id === action.payload.data._id) {
            // @ts-ignore
            return { ...el, [action.payload.semesterNumber]: action.payload.data[action.payload.semesterNumber] }
          }
          return el
        })

        state.selectedPlan.plan = {
          ...state.selectedPlan.plan,
          subjects: newSubjects,
        }
      }
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(fetchChangeSubjectHours.rejected, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    // removeSubjectSemester //
    builder.addCase(removeSubjectSemester.pending, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeSubjectSemester.fulfilled, (state, action) => {
      const newSubjects = state.selectedPlan.plan?.subjects.map((el) => {
        if (el._id === action.payload.id) {
          return { ...el, [action.payload.semester]: null }
        }
        return el
      })
      const newPlan = { ...state.selectedPlan.plan, subjects: newSubjects }

      //@ts-ignore
      state.selectedPlan.plan = newPlan

      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeSubjectSemester.rejected, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    // createNewSubject //
    builder.addCase(createNewSubject.pending, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(createNewSubject.fulfilled, (state, action) => {
      state.selectedPlan.plan?.subjects.push(action.payload)
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(createNewSubject.rejected, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    // removeSubject //
    builder.addCase(removeSubject.pending, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeSubject.fulfilled, (state, action) => {
      if (state.selectedPlan.plan) {
        const newSubjects = state.selectedPlan.plan?.subjects.filter((el) => el._id !== action.payload.id)
        if (newSubjects) {
          state.selectedPlan.plan.subjects = newSubjects

          state.selectedPlan.loadingStatus = AppLoadingStatusTypes.SUCCESS
        }
      }
    })
    builder.addCase(removeSubject.rejected, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    // updateSubjectName //
    builder.addCase(updateSubjectName.pending, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateSubjectName.fulfilled, (state, action) => {
      if (state.selectedPlan.plan) {
        const newSubjects = state.selectedPlan.plan.subjects.map((el) => {
          if (el._id === action.payload.id) {
            return { ...el, name: action.payload.name }
          }
          return el
        })

        state.selectedPlan.plan.subjects = newSubjects

        state.selectedPlan.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(updateSubjectName.rejected, (state) => {
      state.selectedPlan.loadingStatus = AppLoadingStatusTypes.ERROR
    })
  },
})

export const {} = educationalPlansSlice.actions

export default educationalPlansSlice.reducer
