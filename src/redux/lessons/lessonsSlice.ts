import { createSlice } from '@reduxjs/toolkit'
import { AppLoadingStatusTypes } from '../appTypes'
import {
  addNewLesson,
  checkAuditoryOverlay,
  copyWeekLessons,
  getAuditoryLessons,
  getGroupLessons,
  getLessonsById,
  getTeacherLessons,
  removeLesson,
  removeStreamLessons,
  updateAuditory,
  updateStreamsAuditory,
} from './lessonsAsyncActions'
import { lessonsType, OverlayAuditoryType, ScheduleFilterType } from './lessonsTypes'

type lessonsStateType = {
  lessons: lessonsType[] | []
  currentTeacherLessons: lessonsType[] | []
  currentGroupLessons: lessonsType[] | []
  currentAuditoryLessons: lessonsType[] | []
  overlayAuditory: OverlayAuditoryType[] | []
  filterType: ScheduleFilterType
  loadingStatus: AppLoadingStatusTypes
}

const initialState: lessonsStateType = {
  lessons: [],
  currentTeacherLessons: [],
  currentGroupLessons: [],
  currentAuditoryLessons: [],
  overlayAuditory: [],
  filterType: {
    selectedItems: [],
    id: '',
    name: '',
    divisionName: '',
    divisionId: '',
    type: 'groupId',
  },
  loadingStatus: AppLoadingStatusTypes.NEVER,
}

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    clearCurrentGroupLessons(state) {
      state.currentGroupLessons = []
    },
    changeFilterType(state, action) {
      state.filterType = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLessonsById.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getLessonsById.fulfilled, (state, action) => {
      state.lessons = action.payload

      state.currentAuditoryLessons = action.payload

      // console.log(action.payload)
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getLessonsById.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
      state.lessons = []
      state.currentAuditoryLessons = []
    })
    /* addNewLesson */
    builder.addCase(addNewLesson.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(addNewLesson.fulfilled, (state, action) => {
      if (state.lessons.length) {
        //
        // При створенні додаванні дисципліни, що об'єднана в потік
        if (state.lessons[0].groupId === action.payload.groupId) {
          state.lessons = [...state.lessons, action.payload]
        }

        // Коли розклад додається з вкладки "Розклад викладача"
        if (state.lessons[0].teacher._id === action.payload.teacher._id) {
          state.lessons = [...state.lessons, action.payload]
        }
      } else {
        state.lessons = [...state.lessons, action.payload]
      }

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(addNewLesson.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* copyWeekLessons */
    builder.addCase(copyWeekLessons.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(copyWeekLessons.fulfilled, (state, action) => {
      state.lessons = [...state.lessons, ...action.payload]
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(copyWeekLessons.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeLesson */
    builder.addCase(removeLesson.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeLesson.fulfilled, (state, action) => {
      const newLessons = state.lessons.filter((el) => el._id !== action.payload.id)
      const newLessonGroups = state.currentGroupLessons.filter((el) => el._id !== action.payload.id)
      const newTeacherLessons = state.currentTeacherLessons.filter((el) => el._id !== action.payload.id)

      state.lessons = newLessons
      state.currentGroupLessons = newLessonGroups
      state.currentTeacherLessons = newTeacherLessons
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeLesson.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeStreamLessons */
    builder.addCase(removeStreamLessons.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeStreamLessons.fulfilled, (state, action) => {
      const newLessons = state.lessons.filter((el) => el._id !== action.payload._id)
      const newLessonGroups = state.currentGroupLessons.filter((el) => el._id !== action.payload._id)
      const newTeacherLessons = state.currentTeacherLessons.filter((el) => el._id !== action.payload._id)

      state.lessons = newLessons
      state.currentGroupLessons = newLessonGroups
      state.currentTeacherLessons = newTeacherLessons
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeStreamLessons.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateAuditory */
    builder.addCase(updateAuditory.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateAuditory.fulfilled, (state, action) => {
      const newLessons = state.lessons.map((el) => {
        if (el._id === action.payload._id) {
          return { ...el, auditory: action.payload.auditory }
        }

        return el
      })

      state.lessons = newLessons
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(updateAuditory.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateStreamsAuditory */
    builder.addCase(updateStreamsAuditory.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateStreamsAuditory.fulfilled, (state, action) => {
      console.log(action.payload)
      const newLessons = state.lessons.map((el) => {
        if (el._id === action.payload._id) {
          return {
            ...el,
            auditory: action.payload.auditory,
          }
        }
        return el
      })

      state.lessons = newLessons
    })
    builder.addCase(updateStreamsAuditory.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* ----------------- */
    /* getTeacherLessons */
    /* ----------------- */
    builder.addCase(getTeacherLessons.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getTeacherLessons.fulfilled, (state, action) => {
      state.currentTeacherLessons = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getTeacherLessons.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* getGroupLessons */
    builder.addCase(getGroupLessons.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getGroupLessons.fulfilled, (state, action) => {
      state.currentGroupLessons = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getGroupLessons.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* getAuditoryLessons */
    builder.addCase(getAuditoryLessons.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getAuditoryLessons.fulfilled, (state, action) => {
      state.currentAuditoryLessons = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getAuditoryLessons.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* checkAuditoryOverlay */
    builder.addCase(checkAuditoryOverlay.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(checkAuditoryOverlay.fulfilled, (state, action) => {
      state.overlayAuditory = []
      state.overlayAuditory = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(checkAuditoryOverlay.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })
  },
})

export const { clearCurrentGroupLessons, changeFilterType } = lessonsSlice.actions

export default lessonsSlice.reducer
