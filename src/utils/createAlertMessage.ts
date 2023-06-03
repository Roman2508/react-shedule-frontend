import { Dispatch } from '@reduxjs/toolkit'
import { createAlert } from '../redux/alerts/alertsSlise'
import { useAppDispatch } from '../redux/store'

export default (dispatch: Dispatch, payload: any, successMessage: string, errorMessage: string) => {
  if (payload) {
    const errorData = {
      alertMessage: successMessage,
      alertTitle: 'SUCCESS',
      severity: 'success',
    }

    dispatch(createAlert(errorData))
    //
  } else {
    const errorData = {
      alertMessage: errorMessage,
      alertTitle: 'ERROR',
      severity: 'error',
    }

    dispatch(createAlert(errorData))
  }
}
