import { createSlice } from '@reduxjs/toolkit'

type InitialStateType = {
  show: boolean
  alertMessage: string
  alertTitle: string
  severity: 'success' | 'error' | 'warning' | 'info'
}

const initialState: InitialStateType = {
  show: false,
  // setShow={setShowAlert}
  alertMessage: '',
  alertTitle: '',
  severity: 'error',
}

const errorSlise = createSlice({
  name: 'error',
  initialState,
  reducers: {
    createAlert(state, action) {
      state.show = true
      state.alertMessage = action.payload.alertMessage
      state.alertTitle = action.payload.alertTitle
      state.severity = action.payload.severity
    },
    setShowError(state, action) {
      state.show = action.payload
    },
  },
})

export const { createAlert, setShowError } = errorSlise.actions

export default errorSlise.reducer
