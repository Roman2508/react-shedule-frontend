import { createSlice } from '@reduxjs/toolkit'
import { AppLoadingStatusTypes } from '../appTypes'
import {
  addDepartment,
  addTeacher,
  getAllDepartments,
  removeDepartmentById,
  removeTeacherById,
  updateDepartment,
  updateTeacher,
} from './teachersAndDepartmentAsyncAction'
import { DepartmentType, TeacherType } from './teachersAndDepartmentTypes'

type teachersAndDepartmentsStateType = {
  departments: DepartmentType[] | null
  loadingStatus: AppLoadingStatusTypes
}

const initialState: teachersAndDepartmentsStateType = {
  departments: [],
  loadingStatus: AppLoadingStatusTypes.NEVER,
}

const teachersAndDepartmentsSlice = createSlice({
  name: 'teachersAndDepartments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* getAllDepartments  */
    builder.addCase(getAllDepartments.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getAllDepartments.fulfilled, (state, action) => {
      state.departments = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getAllDepartments.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* addDepartment */
    builder.addCase(addDepartment.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(addDepartment.fulfilled, (state, action) => {
      state.departments?.push(action.payload)
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(addDepartment.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateDepartment */
    builder.addCase(updateDepartment.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateDepartment.fulfilled, (state, action) => {
      if (state.departments) {
        const newDepartments = state.departments.map((el) => {
          if (el._id === action.payload._id) {
            return {
              ...action.payload,
              teachers: el.teachers,
            }
          }
          return el
        })
        state.departments = newDepartments

        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(updateDepartment.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeDepartmentById */
    builder.addCase(removeDepartmentById.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeDepartmentById.fulfilled, (state, action) => {
      const newDepartments = state.departments?.filter((el) => el._id !== action.payload.id)

      if (newDepartments) {
        state.departments = newDepartments
      }
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeDepartmentById.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* addTeacher */
    builder.addCase(addTeacher.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(addTeacher.fulfilled, (state, action) => {
      if (state.departments) {
        const findedDepartment = state.departments.find((el) => el._id === action.payload.departmentId)
        if (findedDepartment) {
          findedDepartment.teachers.push(action.payload)

          const newState = state.departments.map((el) => {
            if (el._id === action.payload.departmentId) {
              return findedDepartment
            }
            return el
          })

          state.departments = newState

          state.loadingStatus = AppLoadingStatusTypes.SUCCESS
        }
      }
    })
    builder.addCase(addTeacher.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateTeacher */
    builder.addCase(updateTeacher.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateTeacher.fulfilled, (state, action) => {
      if (state.departments) {
        const findedDepartment = state.departments.find((el) => el._id === action.payload.departmentId)

        if (findedDepartment) {
          const teacher = findedDepartment.teachers.find((t) => t._id === action.payload._id)

          if (teacher?.departmentId !== action.payload.departmentId) {
            const teachersArray = state.departments.map((el) => el.teachers)

            // @ts-ignore
            const allTeachersList = [].concat.apply([], teachersArray)

            const oldTeacher = allTeachersList.find((el: TeacherType) => el._id === action.payload._id)

            if (oldTeacher) {
              const newDepartments = state.departments.map((el) => {
                // @ts-ignore
                if (el._id === oldTeacher.departmentId) {
                  const teachers = el.teachers.filter((t) => t._id !== action.payload._id)
                  return {
                    ...el,
                    teachers,
                  }
                }
                if (el._id === action.payload.departmentId) {
                  el.teachers.push(action.payload)
                  return el
                }
              })
              // @ts-ignore
              state.departments = newDepartments

              state.loadingStatus = AppLoadingStatusTypes.LOADING
            }
          } else {
            const newTeachers = findedDepartment.teachers.map((el) => {
              if (el._id === action.payload._id) {
                return action.payload
              }
              return el
            })

            const newDepartments = state.departments.map((el) => {
              if (el._id === action.payload.departmentId) {
                return {
                  ...el,
                  teachers: newTeachers,
                }
              }
              return el
            })
            state.departments = newDepartments

            state.loadingStatus = AppLoadingStatusTypes.LOADING
          }
        }
      }
    })
    builder.addCase(updateTeacher.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeTeacherById */
    builder.addCase(removeTeacherById.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeTeacherById.fulfilled, (state, action) => {
      if (state.departments) {
        const findedDepartment = state.departments.find((el) => el._id == action.payload.departmentId)

        if (findedDepartment) {
          const newTeachers = findedDepartment.teachers.filter((el) => el._id !== action.payload.id)

          const newDepartments = state.departments.map((el) => {
            if (el._id === action.payload.departmentId) {
              return {
                ...el,
                teachers: newTeachers,
              }
            }
            return el
          })

          state.departments = newDepartments

          state.loadingStatus = AppLoadingStatusTypes.SUCCESS
        }
      }
    })
    builder.addCase(removeTeacherById.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })
  },
})

export const {} = teachersAndDepartmentsSlice.actions

export default teachersAndDepartmentsSlice.reducer
