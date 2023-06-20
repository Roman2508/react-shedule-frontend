import React from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import VisibilityOnIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { AlertColor, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'

import './AuthPage.scss'
import { fetchMe, login, registerInstitution } from '../../redux/accountInfo/accountInfoAsyncActions'
import { StyledAuthDialog, StyledPasswordTextField, StyledTextField } from '../../theme'
import { useAppDispatch } from '../../redux/store'
import createAlertMessage from '../../utils/createAlertMessage'

type RegisterPopupType = {
  registerPopupVisible: boolean
  setRegisterPopupVisible: (value: boolean) => void
  setLoginPopupVisible: (value: boolean) => void
}

export interface RegisterFormProps {
  name: string
  email: string
  password: string
  password2: string
}

const registerPopupSchema = yup
  .object({
    name: yup.string().min(2, 'Мінімальна довжина 2 символа').required('Це обов`язкове поле'),
    // username: yup.string().min(3, 'Мінімальна довжина логіна 3 символа').required('Це обов`язкове поле'),
    email: yup.string().email('Невірний формат пошти').required('Це обов`язкове поле'),
    password: yup.string().min(6, 'Мінімальна довжина пароля 6 символів').required('Це обов`язкове поле'),
    password2: yup
      .string()
      .min(6, 'Мінімальна довжина пароля 6 символов')
      .required('Це обов`язкове поле')
      .oneOf([yup.ref('password'), null], 'Паролі не співпадають'),
  })
  .required()

const RegisterPopup: React.FC<RegisterPopupType> = ({
  registerPopupVisible,
  setRegisterPopupVisible,
  setLoginPopupVisible,
}) => {
  const dispatch = useAppDispatch()

  // const loadingState = useSelector(selectUserStateStatus)
  const [showPassword, setShowPassword] = React.useState({
    password1: false,
    password2: false,
  })
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClickShowPassword = (value: string) => {
    setShowPassword((prev) => ({ ...prev, [value]: !showPassword[value as keyof typeof showPassword] }))
  }

  /*   const daysArray: number[] = []
    for (let i = 1; i <= 31; i++) {
      daysArray.push(i)
    }
    const yearsArray: number[] = []
    for (let i = 1930; i <= 2022; i++) {
      yearsArray.unshift(i)
    } */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormProps>({
    resolver: yupResolver(registerPopupSchema),
  })

  const onSubmit = async (data: RegisterFormProps) => {
    try {
      setIsLoading(true)
      const { password2, ...registerData } = data

      const { payload } = await dispatch(registerInstitution(registerData))

      createAlertMessage(dispatch, payload, 'Реєстрація успішна', 'Помилка реєстрації :(')

      if (payload) {
        const loginData = { email: payload.email, password: registerData.password }

        const data = await dispatch(login(loginData))

        if (data.payload.token) {
          globalThis.localStorage.setItem('token', data.payload.token)
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onClickLogin = () => {
    setRegisterPopupVisible(false)
    setLoginPopupVisible(true)
  }

  return (
    <StyledAuthDialog open={registerPopupVisible} maxWidth="sm" sx={{ root: { borderRadius: '20px !important' } }}>
      <div className="registerPopup">
        <CloseIcon onClick={() => setRegisterPopupVisible(false)} />

        <DialogContent sx={{ paddingTop: '40px' }}>
          <Typography
            sx={{ fontSize: 32, fontWeight: 700, lineHeight: '36px', marginBottom: '30px', mt: '10px' }}
            variant="h2"
            component="div"
            color="#0f1419">
            Реєстрація організації
          </Typography>

          <form className="inputs-box" onSubmit={handleSubmit(onSubmit)}>
            <div className="inputs-wrapper">
              <StyledTextField
                {...register('name')}
                variant="outlined"
                label="Назва Вашої організації"
                fullWidth={true}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </div>

            <div className="inputs-wrapper">
              <StyledTextField
                {...register('email')}
                type="email"
                variant="outlined"
                label="Адрес електронної пошти"
                fullWidth={true}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </div>

            {/* <div className="inputs-wrapper">
              <StyledTextField
                {...register('username')}
                variant="outlined"
                label="Логін"
                fullWidth={true}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </div> */}

            <div className="inputs-wrapper">
              <div className="auth-page__password-wrapper">
                <StyledPasswordTextField
                  {...register('password')}
                  variant="outlined"
                  type={showPassword.password1 ? 'text' : 'password'}
                  label="Пароль"
                  fullWidth={true}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                {!showPassword.password1 ? (
                  <VisibilityOffIcon
                    className="auth-page__password-visible-icon"
                    onClick={() => handleClickShowPassword('password1')}
                  />
                ) : (
                  <VisibilityOnIcon
                    className="auth-page__password-visible-icon"
                    onClick={() => handleClickShowPassword('password1')}
                  />
                )}
              </div>
            </div>

            <div className="inputs-wrapper">
              <div className="auth-page__password-wrapper">
                <StyledPasswordTextField
                  {...register('password2')}
                  variant="outlined"
                  type={showPassword.password2 ? 'text' : 'password'}
                  label="Пароль"
                  fullWidth={true}
                  error={!!errors.password2}
                  helperText={errors.password2?.message}
                />
                {!showPassword.password2 ? (
                  <VisibilityOffIcon
                    className="auth-page__password-visible-icon"
                    onClick={() => handleClickShowPassword('password2')}
                  />
                ) : (
                  <VisibilityOnIcon
                    className="auth-page__password-visible-icon"
                    onClick={() => handleClickShowPassword('password2')}
                  />
                )}
              </div>
            </div>

            <Button
              size="large"
              variant="contained"
              fullWidth={true}
              sx={{ borderRadius: '20px', h: '50px', padding: '10px 0' }}
              type="submit"
              disabled={isLoading}>
              Зареєструватись
            </Button>
          </form>

          <div className="auth-page__already-is">
            <Typography>Вже є обліковий запис? </Typography>
            <Typography color="rgb(29, 155, 240)" sx={{ cursor: 'pointer' }} onClick={onClickLogin}>
              Увійдіть
            </Typography>
          </div>
        </DialogContent>
      </div>
    </StyledAuthDialog>
  )
}

/* 
       }

      }
    </Notification>
  )
*/

/*   return (
    <Dialog open={registerPopupVisible} maxWidth='sm'>
      <div className='registerPopup'>
        <CloseIcon onClick={() => setRegisterPopupVisible(false)} />

        <DialogTitle>Регистрация</DialogTitle>
        <DialogContent>
          <Typography
            sx={{ fontSize: 32, fontWeight: 700, lineHeight: '36px', marginBottom: '30px', mt: '10px' }}
            variant="h2"
            component="div"
            color='#0f1419'
          >
            Создайте учетную запись
          </Typography>

          <form className="inputs-box" onSubmit={handleSubmit(onSubmit)}>
            <div className="inputs-wrapper">
              <TextField
                {...register('fullname')}
                variant="outlined"
                label="Ваше имя"
                fullWidth={true}
                error={!!errors.fullname}
                helperText={errors.fullname?.message}>
              </TextField>
            </div>

            <div className="inputs-wrapper">
              <TextField
                {...register('email')}
                type="email"
                variant="outlined"
                label="Адрес электронной почты"
                fullWidth={true}
                error={!!errors.email}
                helperText={errors.email?.message}>
              </TextField>
            </div>

            <div className="inputs-wrapper">
              <TextField
                {...register('username')}
                variant="outlined"
                label="Логин"
                fullWidth={true}
                error={!!errors.username}
                helperText={errors.username?.message}>
              </TextField>
            </div>

            <div className="inputs-wrapper">
              <TextField
                {...register('password')}
                variant="outlined"
                type="password"
                label="Пароль"
                fullWidth={true}
                error={!!errors.password}
                helperText={errors.password?.message}>
              </TextField>
            </div>

            <div className="inputs-wrapper">
              <TextField
                {...register('password2')}
                variant="outlined"
                type="password"
                label="Пароль"
                fullWidth={true}
                error={!!errors.password2}
                helperText={errors.password2?.message}>
              </TextField>
            </div>

            <Button size="large" variant='contained' fullWidth={true}
              sx={{ borderRadius: '20px', h: '50px' }} type="submit"
            >
              Зарегистрироваться
            </Button>
          </form>
          
        </DialogContent>
      </div>
    </Dialog>

  ) */

export default RegisterPopup

{
  /* <Typography variant="h6" component="h6"
            sx={{ fontSize: 15, fontWeight: 700 }}
          >
            Дата рождения
          </Typography>
          <DialogContentText sx={{ fontSize: 14, lineHeight: "16px", marginBottom: '20px' }}>
            Эта информация не будет общедоступной. Подтвердите свой возраст,
            даже если эта учетная запись предназначена для компании, домашнего животного и т. д.
          </DialogContentText>

          <div className='birthDay-block'>
            <FormControl sx={{ width: '200px' }}>
              <InputLabel id="mounth">Месяц</InputLabel>
              <Select labelId="mounth" label="mounth">
                <MenuItem value={1}>январь</MenuItem>
                <MenuItem value={2}>февраль</MenuItem>
                <MenuItem value={3}>март</MenuItem>
                <MenuItem value={4}>апрель</MenuItem>
                <MenuItem value={5}>май</MenuItem>
                <MenuItem value={6}>июнь</MenuItem>
                <MenuItem value={7}>июль</MenuItem>
                <MenuItem value={8}>август</MenuItem>
                <MenuItem value={9}>сентябрь</MenuItem>
                <MenuItem value={10}>октябрь</MenuItem>
                <MenuItem value={11}>ноябрь</MenuItem>
                <MenuItem value={12}>декабрь</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: '90px' }}>
              <InputLabel id="day">День</InputLabel>
              <Select labelId="day" label="day">
                {daysArray.map(el => (
                  <MenuItem key={el} value={el}>{el}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: '110px' }}>
              <InputLabel id="year">Год</InputLabel>
              <Select labelId="year" label="year">
                {yearsArray.map(el => (
                  <MenuItem key={el} value={el}>{el}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div> */
}
