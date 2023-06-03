import { createSlice } from '@reduxjs/toolkit'
import { AppLoadingStatusTypes } from '../appTypes'
import {
  addAuditory,
  addBuilding,
  getAllBuildings,
  removeAuditory,
  removeBuilding,
  updateAuditory,
  updateBuilding,
} from './buildingsAndAuditoriumsAsyncAction'
import { BuildingsType } from './buildingsAndAuditoriumsTypes'

type buildingsAndAuditoriumsInitialStateType = {
  buildings: BuildingsType[] | []
  loadingStatus: AppLoadingStatusTypes
}

const initialState: buildingsAndAuditoriumsInitialStateType = {
  buildings: [],
  loadingStatus: AppLoadingStatusTypes.NEVER,
}

const buildingsAndAuditoriumsSlice = createSlice({
  name: 'buildingsAndAuditoriums',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* getAllBuildings */
    builder.addCase(getAllBuildings.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getAllBuildings.fulfilled, (state, action) => {
      state.buildings = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getAllBuildings.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* addAuditory */
    builder.addCase(addAuditory.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(addAuditory.fulfilled, (state, action) => {
      const newData = state.buildings.map((el) => {
        if (el._id === action.payload.buildingId) {
          el.auditoriums.push(action.payload)
          return el
        }
        return el
      })
      state.buildings = newData
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(addAuditory.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeAuditory */
    builder.addCase(removeAuditory.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeAuditory.fulfilled, (state, action) => {
      const findedBuilding = state.buildings.find((b) => b._id === action.payload.buildingId)

      if (findedBuilding) {
        const newAuditoriums = findedBuilding.auditoriums.filter((el) => el._id !== action.payload.id)

        const newBuildings = state.buildings.map((el) => {
          if (el._id === action.payload.buildingId) {
            return {
              ...el,
              auditoriums: newAuditoriums,
            }
          }
          return el
        })

        state.buildings = newBuildings
      }

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeAuditory.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateAuditory */
    builder.addCase(updateAuditory.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateAuditory.fulfilled, (state, action) => {
      const findedBuilding = state.buildings.find((b) => b._id === action.payload.buildingId)

      if (findedBuilding) {
        const auditoriums = findedBuilding.auditoriums.find((a) => a._id === action.payload._id)

        if (auditoriums?.buildingId !== action.payload.buildingId) {
          const auditoriumsArray = state.buildings.map((el) => el.auditoriums)

          // @ts-ignore
          const allAuditoriumsList = [].concat.apply([], auditoriumsArray)

          // @ts-ignore
          const findedAuditorium = allAuditoriumsList.find((el) => el._id === action.payload._id)

          const newState = state.buildings.map((el) => {
            // @ts-ignore
            if (el._id === findedAuditorium.buildingId) {
              const auditoriums = el.auditoriums.filter((el) => el._id !== action.payload._id)
              return { ...el, auditoriums }
            }
            if (el._id === action.payload.buildingId) {
              el.auditoriums.push(action.payload)
              return el
            }
            return el
          })

          state.buildings = newState

          state.loadingStatus = AppLoadingStatusTypes.SUCCESS
        } else {
          /*  */
          /*  */
          /*  */
          const findedAuditorium = findedBuilding?.auditoriums.map((a) => {
            if (a._id === action.payload._id) {
              return action.payload
            }
            return a
          })

          const newBuilding = {
            ...findedBuilding,
            auditoriums: findedAuditorium,
          }

          const newState = state.buildings.map((el) => {
            if (el._id === action.payload.buildingId) {
              return newBuilding
            }
            return el
          })

          state.buildings = newState

          state.loadingStatus = AppLoadingStatusTypes.SUCCESS
        }
        /*  */
        /*  */
        /*  */
      }
    })
    builder.addCase(updateAuditory.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateBuilding */
    builder.addCase(updateBuilding.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateBuilding.fulfilled, (state, action) => {
      const newState = state.buildings.map((el) => {
        if (el._id === action.payload._id) {
          el.name = action.payload.name
        }
        return el
      })
      state.buildings = newState
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(updateBuilding.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* addBuilding */
    builder.addCase(addBuilding.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(addBuilding.fulfilled, (state, action) => {
      const newData = [...state.buildings, action.payload]
      state.buildings = newData
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(addBuilding.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeBuilding */
    builder.addCase(removeBuilding.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeBuilding.fulfilled, (state, action) => {
      const newState = state.buildings.filter((el) => el._id !== action.payload.id)

      state.buildings = newState

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeBuilding.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })
  },
})

export const {} = buildingsAndAuditoriumsSlice.actions

export default buildingsAndAuditoriumsSlice.reducer
