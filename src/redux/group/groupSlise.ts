import { GroupType, SubgroupsType } from './groupTypes'
import { createSlice } from '@reduxjs/toolkit'
import { AppLoadingStatusTypes } from '../appTypes'
import {
  addSubjectSpecialization,
  createGroup,
  createGroupSpecialization,
  createSubgroups,
  getAllFacultyGroups,
  getGroupById,
  getGroups,
  getSubgroups,
  removeGroup,
  removeGroupSpecialization,
  removeSpecializationSubject,
  removeSubgroups,
  updateGroupInfo,
  updateGroupLoad,
  updateGroupSpecialization,
  updateSpecializationSubjects,
  updateSubgroups,
} from './groupAsyncAction'

type GroupInitialStateType = {
  partTimeGroups: GroupType[] | null
  fullTimeGroups: GroupType[] | null
  selectedGroup: GroupType | null
  subgroupsList: SubgroupsType[]
  loadingStatus: AppLoadingStatusTypes
}

const initialState: GroupInitialStateType = {
  partTimeGroups: null,
  fullTimeGroups: null,
  selectedGroup: null,
  subgroupsList: [],
  loadingStatus: AppLoadingStatusTypes.NEVER,
}

const groupSlise = createSlice({
  name: 'group',
  initialState,

  reducers: {
    removeSelectedGroup(state) {
      state.selectedGroup = null
      state.loadingStatus = AppLoadingStatusTypes.NEVER
    },
    removeSubgroupsList(state) {
      state.subgroupsList = []
    },
  },

  extraReducers: (builder) => {
    /* createGroup */
    builder.addCase(createGroup.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(createGroup.fulfilled, (state, action) => {
      if (state.fullTimeGroups !== null) {
        if (action.payload.formOfEducations === 'Денна') {
          // @ts-ignore
          state.fullTimeGroups.push(action.payload)
          state.loadingStatus = AppLoadingStatusTypes.SUCCESS
        } else if (action.payload.formOfEducations === 'Заочна') {
          // @ts-ignore
          state.partTimeGroups?.push(action.payload)
          state.loadingStatus = AppLoadingStatusTypes.SUCCESS
        }
      }
    })
    builder.addCase(createGroup.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* getGroups */
    builder.addCase(getGroups.pending, (state) => {
      state.partTimeGroups = null
      state.fullTimeGroups = null

      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getGroups.fulfilled, (state, action) => {
      const partTimeGroups = action.payload.filter((el: GroupType) => el.formOfEducations === 'Заочна')
      const fullTimeGroups = action.payload.filter((el: GroupType) => el.formOfEducations === 'Денна')

      state.partTimeGroups = partTimeGroups
      state.fullTimeGroups = fullTimeGroups

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getGroups.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* getAllFacultyGroups */
    builder.addCase(getAllFacultyGroups.pending, (state) => {
      state.partTimeGroups = null
      state.fullTimeGroups = null

      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getAllFacultyGroups.fulfilled, (state, action) => {
      const partTimeGroups = action.payload.filter((el: GroupType) => el.formOfEducations === 'Заочна')
      const fullTimeGroups = action.payload.filter((el: GroupType) => el.formOfEducations === 'Денна')

      state.partTimeGroups = partTimeGroups
      state.fullTimeGroups = fullTimeGroups

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getAllFacultyGroups.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* getGroupById */
    builder.addCase(getGroupById.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getGroupById.fulfilled, (state, action) => {
      // @ts-ignore
      state.selectedGroup = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getGroupById.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeGroup */
    builder.addCase(removeGroup.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeGroup.fulfilled, (state, action) => {
      if (state.fullTimeGroups !== null) {
        const newFullTimeGroups = state.fullTimeGroups.filter((el: GroupType) => el._id !== action.payload.id)

        state.fullTimeGroups = newFullTimeGroups
      }
      if (state.partTimeGroups !== null) {
        const newPartTimeGroups = state.partTimeGroups.filter((el: GroupType) => el._id !== action.payload.id)

        state.partTimeGroups = newPartTimeGroups
      }

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeGroup.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateGroupInfo */
    builder.addCase(updateGroupInfo.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateGroupInfo.fulfilled, (state, action) => {
      if (state.fullTimeGroups !== null) {
        const newFullTimeGroups = state.fullTimeGroups.map((el) => {
          if (el._id === action.payload._id) {
            return action.payload
          }
          return el
        })

        state.fullTimeGroups = newFullTimeGroups
        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
      if (state.partTimeGroups !== null) {
        const newPartTimeGroups = state.partTimeGroups.map((el) => {
          if (el._id === action.payload._id) {
            return action.payload
          }
          return el
        })
        state.partTimeGroups = newPartTimeGroups
        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(updateGroupInfo.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateGroupLoad */
    builder.addCase(updateGroupLoad.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateGroupLoad.fulfilled, (state, action) => {
      if (state.fullTimeGroups && state.partTimeGroups) {
        const fullTimeGroups = state.fullTimeGroups.map((el) => {
          if (el._id === action.payload._id) {
            return action.payload
          }
          return el
        })
        const partTimeGroups = state.partTimeGroups.map((el) => {
          if (el._id === action.payload._id) {
            return action.payload
          }
          return el
        })

        state.fullTimeGroups = fullTimeGroups
        state.partTimeGroups = partTimeGroups
        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(updateGroupLoad.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* createGroupSpecialization */

    builder.addCase(createGroupSpecialization.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(createGroupSpecialization.fulfilled, (state, action) => {
      if (state.selectedGroup !== null) {
        state.selectedGroup.specializationsList = action.payload

        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(createGroupSpecialization.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeGroupSpecialization */
    builder.addCase(removeGroupSpecialization.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeGroupSpecialization.fulfilled, (state, action) => {
      if (state.selectedGroup !== null) {
        state.selectedGroup.specializationsList = action.payload
        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(removeGroupSpecialization.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateGroupSpecialization */
    builder.addCase(updateGroupSpecialization.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateGroupSpecialization.fulfilled, (state, action) => {
      if (state.selectedGroup !== null) {
        state.selectedGroup.specializationsList = action.payload

        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(updateGroupSpecialization.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* addSubjectSpecialization */
    builder.addCase(addSubjectSpecialization.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(addSubjectSpecialization.fulfilled, (state, action) => {
      state.selectedGroup?.specializationsSubjects.push(action.payload)
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(addSubjectSpecialization.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeSpecializationSubject */
    builder.addCase(removeSpecializationSubject.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeSpecializationSubject.fulfilled, (state, action) => {
      if (state.selectedGroup) {
        const newSpecializationsSubjects = state.selectedGroup.specializationsSubjects.filter(
          (el) => el._id !== action.payload._id,
        )

        state.selectedGroup.specializationsSubjects = newSpecializationsSubjects

        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(removeSpecializationSubject.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateSpecializationSubjects */
    builder.addCase(updateSpecializationSubjects.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateSpecializationSubjects.fulfilled, (state, action) => {
      if (state.selectedGroup) {
        const newSpecializationsSubjects = state.selectedGroup?.specializationsSubjects.map((el) => {
          if (el._id === action.payload.specializationId) {
            el.specialization = { name: action.payload.name, _id: action.payload._id }
            return el
          }
          return el
        })

        state.selectedGroup.specializationsSubjects = newSpecializationsSubjects
      }

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(updateSpecializationSubjects.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* getSubgroups */
    builder.addCase(getSubgroups.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getSubgroups.fulfilled, (state, action) => {
      state.subgroupsList = [...state.subgroupsList, ...action.payload]
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getSubgroups.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* createSubgroups */
    builder.addCase(createSubgroups.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(createSubgroups.fulfilled, (state, action) => {
      if (state.selectedGroup) {
        state.selectedGroup.subgroups.push(...action.payload)

        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(createSubgroups.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeSubgroups */
    builder.addCase(removeSubgroups.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeSubgroups.fulfilled, (state, action) => {
      if (state.selectedGroup) {
        const newSubgroups = state.selectedGroup.subgroups.filter((el) => el._id !== action.payload.subgroupId)

        state.selectedGroup.subgroups = newSubgroups

        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })

    /* updateSubgroups */
    builder.addCase(updateSubgroups.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateSubgroups.fulfilled, (state, action) => {
      if (state.selectedGroup) {
        const newSubgroups = state.selectedGroup.subgroups.map((el) => {
          if (action.payload._id === el._id) {
            return action.payload
          } else {
            return el
          }
        })

        state.selectedGroup.subgroups = newSubgroups

        state.loadingStatus = AppLoadingStatusTypes.SUCCESS
      }
    })
    builder.addCase(updateSubgroups.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })
  },
})

export const { removeSelectedGroup, removeSubgroupsList } = groupSlise.actions

export default groupSlise.reducer
