import { createSlice } from '@reduxjs/toolkit'
import { AppLoadingStatusTypes } from '../appTypes'
import {
  createStream,
  createStreamComponent,
  getGroupLoad,
  getStreams,
  removeStream,
  removeStreamDetails,
  removeStreamsComponent,
  updateStream,
  updateStreamDetails,
} from './streamsAsyncActions'
import { GroupLoadType } from '../group/groupTypes'
import { StreamsType } from './streamsTypes'

type StreamInitialStateType = {
  streams: StreamsType[] | []
  streamsLoad: GroupLoadType[] | []
  loadingStatus: AppLoadingStatusTypes
}

const initialState: StreamInitialStateType = {
  streams: [],
  streamsLoad: [],
  loadingStatus: AppLoadingStatusTypes.NEVER,
}

const streamSlise = createSlice({
  name: 'streams',
  initialState,
  reducers: {
    clearStreamsLoad(state) {
      state.streamsLoad = []
    },
  },
  extraReducers: (builder) => {
    /* getStreams */
    builder.addCase(getStreams.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getStreams.fulfilled, (state, action) => {
      state.streams = action.payload
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getStreams.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* createStream */
    builder.addCase(createStream.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(createStream.fulfilled, (state, action) => {
      const newStreams = [...state.streams, action.payload]

      state.streams = newStreams
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(createStream.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateStream */
    builder.addCase(updateStream.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateStream.fulfilled, (state, action) => {
      const newStreams = state.streams.map((el) => {
        if (el._id === action.payload._id) {
          const newStream = {
            ...el,
            name: action.payload.name,
          }

          return newStream
        }
        return el
      })

      state.streams = newStreams

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(updateStream.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeStream */
    builder.addCase(removeStream.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeStream.fulfilled, (state, action) => {
      const newStreams = state.streams.filter((el) => el._id !== action.payload.id)

      state.streams = newStreams
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeStream.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* createStreamComponent */
    builder.addCase(createStreamComponent.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(createStreamComponent.fulfilled, (state, action) => {
      const newStreams = state.streams.map((el) => {
        if (el._id === action.payload._id) {
          return action.payload
        }

        return el
      })

      state.streams = newStreams
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(createStreamComponent.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeStreamsComponent */
    builder.addCase(removeStreamsComponent.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeStreamsComponent.fulfilled, (state, action) => {
      const newStreams = state.streams.map((el) => {
        if (el._id === action.payload.streamId) {
          const newComponents = el.components.filter((c) => c._id !== action.payload.id)

          return {
            ...el,
            components: newComponents,
          }
        }

        return el
      })

      state.streams = newStreams

      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeStreamsComponent.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* updateStreamDetails */
    builder.addCase(updateStreamDetails.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(updateStreamDetails.fulfilled, (state, action) => {
      const newStreams = state.streams.map((el) => {
        if (el._id === action.payload.id) {
          return {
            ...el,
            details: action.payload.data,
          }
        }

        return el
      })

      state.streams = newStreams
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(updateStreamDetails.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* removeStreamDetails */
    builder.addCase(removeStreamDetails.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(removeStreamDetails.fulfilled, (state, action) => {
      const newStreams = state.streams.map((el) => {
        if (el._id === action.payload.streamId) {
          const newStreamDetails = el.details.filter((d) => d._id !== action.payload.id)
          return {
            ...el,
            details: newStreamDetails,
          }
        }

        return el
      })

      state.streams = newStreams
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(removeStreamDetails.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })

    /* getGroupLoad */
    builder.addCase(getGroupLoad.pending, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.LOADING
    })
    builder.addCase(getGroupLoad.fulfilled, (state, action) => {
      state.streamsLoad = [...state.streamsLoad, action.payload]
      state.loadingStatus = AppLoadingStatusTypes.SUCCESS
    })
    builder.addCase(getGroupLoad.rejected, (state) => {
      state.loadingStatus = AppLoadingStatusTypes.ERROR
    })
  },
})

export const { clearStreamsLoad } = streamSlise.actions

export default streamSlise.reducer
