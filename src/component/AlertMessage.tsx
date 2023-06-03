import React from 'react'
import Alert, { AlertColor } from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import { useAppDispatch } from '../redux/store'

type AlertMessagePropsType = {
  show: boolean
  setShow?: (val: boolean) => void
  setShowError?: any
  alertMessage: string
  alertTitle: string
  severity: AlertColor // 'success' | 'error' | 'warning' | 'info'
}

const AlertMessage: React.FC<AlertMessagePropsType> = ({
  show,
  setShow,
  setShowError,
  alertMessage,
  alertTitle,
  severity,
}) => {
  const dispatch = useAppDispatch()

  const onCloseAlertMessage = () => {
    if (setShow) {
      setShow(false)
    } else if (setShowError) {
      dispatch(setShowError(false))
    }
  }

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      onCloseAlertMessage()
    }, 3000)
    return () => {
      clearTimeout(timerId)
    }
  }, [show])

  if (!show) {
    return <></>
  }

  return (
    <div style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: '9999' }} onClick={onCloseAlertMessage}>
      <Alert variant="filled" severity={severity} style={{ paddingRight: '45px' }}>
        <AlertTitle>{alertTitle}</AlertTitle>
        {alertMessage}
      </Alert>
    </div>
  )
}

export default AlertMessage
