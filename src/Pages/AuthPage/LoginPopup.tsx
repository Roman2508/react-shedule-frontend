import React from 'react'
import './AuthPage.scss'
import * as yup from 'yup'
import Typography from '@mui/material/Typography'
import { Button, DialogContent } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AlertColor } from '@mui/material/Alert'
import { StyledAuthDialog, StyledPasswordTextField, StyledTextField } from '../../theme'
import BlueLogo from '../../assets/blue-logo.png'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityOnIcon from '@mui/icons-material/Visibility'
import { fetchInstitution, login } from '../../redux/accountInfo/accountInfoAsyncActions'
import { useAppDispatch } from '../../redux/store'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { useSelector } from 'react-redux'
import createAlertMessage from '../../utils/createAlertMessage'

type LoginPopupType = {
  setRegisterPopupVisible: (value: boolean) => void
  loginPopupVisible: boolean
  setLoginPopupVisible: (value: boolean) => void
}

export interface FormProps {
  email: string
  password: string
}

const loginPopupSchema = yup
  .object({
    email: yup.string().required("Це обов'язкове поле").email('Невірний формат пошти'),
    password: yup.string().min(5, 'Мінімальна довжина паролю 5 символів').required("Це обов'язкове поле"),
  })
  .required()

const LoginPopup: React.FC<LoginPopupType> = ({ setRegisterPopupVisible, loginPopupVisible, setLoginPopupVisible }) => {
  const dispatch = useAppDispatch()

  // const loadingStatus = useSelector(selectUserStateStatus)
  const [showPassword, setShowPassword] = React.useState(false)

  // const openNotificationRef = React.useRef<(text: string, type: AlertColor) => void>(() => {})

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormProps>({
    // defaultValues: {
    //   email: '',
    //   password: '',
    // },
    resolver: yupResolver(loginPopupSchema),
  })

  const onSubmit = async (data: FormProps) => {
    // try {
    const { payload } = await dispatch(login(data))

    createAlertMessage(dispatch, payload, 'Авторизація успішна', 'Не вдалось авторизуватись :(')

    if (payload.token) {
      globalThis.localStorage.setItem('token', payload.token)
    }

    if (payload) {
      dispatch(fetchInstitution(payload.institutionId))
    }
    // } catch (error) {
    //   console.log(error)
    //   // openNotificationRef.current('Не верный логин или пароль :(', 'error')
    // }
  }

  const onClickRegister = () => {
    setRegisterPopupVisible(true)
    setLoginPopupVisible(false)
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  return (
    <StyledAuthDialog open={loginPopupVisible} maxWidth="sm">
      <div className="loginPopup">
        <CloseIcon onClick={() => setLoginPopupVisible(false)} />

        <DialogContent>
          {/* <ScheduleIcon className="login-logo" /> */}
          <img src={BlueLogo} className="login-logo" />

          <Typography
            sx={{
              fontSize: 32,
              fontWeight: 700,
              lineHeight: '36px',
              mb: '40px',
              mt: '30px',
              textAlign: 'center',
            }}
            variant="h2"
            component="div"
            color="#0f1419">
            Вхід в систему
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className="loginPopup__form">
            <StyledTextField
              {...register('email')}
              variant="outlined"
              label="Адрес електронної пошти"
              fullWidth={true}
              type="text"
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <div className="auth-page__password-wrapper">
              <StyledPasswordTextField
                {...register('password')}
                variant="outlined"
                label="Пароль"
                fullWidth={true}
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              {!showPassword ? (
                <VisibilityOffIcon className="auth-page__password-visible-icon" onClick={handleClickShowPassword} />
              ) : (
                <VisibilityOnIcon className="auth-page__password-visible-icon" onClick={handleClickShowPassword} />
              )}
            </div>

            <div className="login__btn-wrapper">
              <Button
                type="submit"
                size="large"
                variant="contained"
                fullWidth={true}
                sx={{ borderRadius: '20px', h: '50px', padding: '10px 0' }}
                /* disabled={loadingStatus === LoadingState.LOADING} */
              >
                Увійти
              </Button>

              <Button
                size="large"
                variant="outlined"
                fullWidth={true}
                sx={{ borderRadius: '20px', h: '50px', padding: '9.2px 0' }}>
                Забули пароль?
              </Button>
            </div>
          </form>

          <div className="loginPopup__text">
            <Typography>Немає облікового запису?</Typography>
            <Typography color="rgb(29, 155, 240);" onClick={onClickRegister}>
              Зареєструйтесь
            </Typography>
          </div>
        </DialogContent>
      </div>
    </StyledAuthDialog>
  )
}

export default LoginPopup
