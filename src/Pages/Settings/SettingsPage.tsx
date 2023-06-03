import React from 'react'
import moment from 'moment'
import Paper from '@mui/material/Paper'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import { ukUA } from '@mui/x-date-pickers'
import Typography from '@mui/material/Typography'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import './SettingsPage.scss'
import { useAppDispatch } from '../../redux/store'
import collagePhoto from '../../assets/collage_photo.jpg'
import { logout } from '../../redux/accountInfo/accountInfoSlice'
import CircularPreloader from '../../component/CircularPreloader'
import { MaterialUISwitch, StyledClosedButton, StyledDatePicker } from '../../theme'
import ColorPicker from '../../component/SettingPickers/ColorPicker'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import TimePickerViews from '../../component/SettingPickers/TimePickerViews'
import { updateCurrentShowedYear, updateTermsOfStudy } from '../../redux/accountInfo/accountInfoAsyncActions'
import CurrentEducationTime from '../../component/SettingPickers/CurrentEducationTime'
import { CallScheduleAndTermsOfStudyType, TermsOfStudyType } from '../../redux/accountInfo/accountInfoTypes'
import AlertMessage from '../../component/AlertMessage'
import { setShowError } from '../../redux/alerts/alertsSlise'
import { selectAlerts } from '../../redux/appSelectors'
import createAlertMessage from '../../utils/createAlertMessage'

moment.updateLocale('en', {
  months: [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень',
  ],
})

type SettingsButtonsPropsType = {
  saveButtonCallback: () => void
  closeButtonCallback: () => void
}

const SettingButtons: React.FC<SettingsButtonsPropsType> = ({ saveButtonCallback, closeButtonCallback }) => {
  return (
    <div className="settings-page__call-schedule-actions">
      <StyledClosedButton variant="outlined" onClick={closeButtonCallback}>
        Відмінити
      </StyledClosedButton>
      <Button variant="outlined" onClick={saveButtonCallback}>
        Зберегти
      </Button>
    </div>
  )
}

const initialCurrentTermsOfStudyData = {
  currentYear: { start: 1640988000, end: 1641247200 },
  firstSemester: { start: 1640988000, end: 1641074400 },
  secondSemester: { start: 1641160800, end: 1641247200 },
}

// console.log(Date.now()) // Поточний час в UNIX форматі
// console.log(moment.unix(1680290022).format('MM.DD.YYYY')) // Конвертувати UNIX в дату
// console.log(moment(new Date(), 'DD.MM.YYYY').unix()) // Конвертувати дату в UNIX

type SettingsPagePropsType = {
  colorMode: {
    toggleColorMode: () => void
  }
}

const SettingsPage: React.FC<SettingsPagePropsType> = ({ colorMode }) => {
  const dispatch = useAppDispatch()

  const { userData, institution } = useSelector(selectAuthData)
  const alertInfo = useSelector(selectAlerts)

  const [currentTermsOfStudy, setCurrentTermsOfStudy] = React.useState<TermsOfStudyType>(initialCurrentTermsOfStudyData)
  const [showYear, setShowYear] = React.useState(moment(new Date().getFullYear(), 'YYYY'))

  React.useEffect(() => {
    if (institution) {
      // @ts-ignore
      setCurrentTermsOfStudy((prev) => {
        const { currentYear, firstSemester, secondSemester } = institution.settings.termsOfStudy

        const data = {
          currentYear: { start: Number(currentYear.start), end: Number(currentYear.end) },
          firstSemester: { start: Number(firstSemester.start), end: Number(firstSemester.end) },
          secondSemester: { start: Number(secondSemester.start), end: Number(secondSemester.end) },
        }

        return data
      })

      setShowYear(moment(institution.settings.currentShowedYear, 'YYYY'))
    }
  }, [institution?.settings])

  const onClickLogout = () => {
    if (globalThis.confirm('Ви дійсно хочете вийти з акаунта?')) {
      dispatch(logout())
      globalThis.localStorage.removeItem('token')
    }
  }

  const onUpdateTermOfStudy = async () => {
    if (institution && window.confirm('Ви дійсно хочете оновити терміни навчання?')) {
      const { payload } = await dispatch(
        updateTermsOfStudy({ institutionId: institution._id, termsOfStudy: currentTermsOfStudy }),
      )
      createAlertMessage(dispatch, payload, 'Терміни навчання оновлено', 'Помилка при оновленні термінів навчання :(')
    }
  }
  const onCancelTermOfStudyСhanges = () => {
    if (institution) setCurrentTermsOfStudy(institution.settings.termsOfStudy)
  }

  const onChangeCurrentShowedYear = async () => {
    if (institution && window.confirm('Ви дійсно хочете оновити терміни навчання?')) {
      const updateCurrentShowedYearPayload = {
        institutionId: institution._id,
        currentShowedYear: moment(showYear).clone().format('YYYY'),
      }

      const { payload } = await dispatch(updateCurrentShowedYear(updateCurrentShowedYearPayload))
      createAlertMessage(dispatch, payload, 'Поточний рік оновлено', 'Помилка при оновленні поточного року :(')
    }
  }

  if (!institution || !userData) {
    return <CircularPreloader />
  }

  const callSchedule = Object.values(institution.settings.callSchedule).filter((el) => typeof el !== 'string')

  // Масив кольорів
  const colorsData = (() => {
    const values = Object.values(userData.settings.colors)
    const keys = Object.keys(userData.settings.colors)

    const res = values.map((el, index) => {
      let subjectType = ''

      if (keys[index] === 'lectures') {
        subjectType = 'Лекії'
      } else if (keys[index] === 'practical') {
        subjectType = 'Практичні'
      } else if (keys[index] === 'laboratory') {
        subjectType = 'Лабораторні'
      } else if (keys[index] === 'seminars') {
        subjectType = 'Семінари'
      } else if (keys[index] === 'exams') {
        subjectType = 'Екзамени'
      }

      return {
        value: el,
        name: keys[index],
        subjectType,
      }
    })

    return res
  })().filter((el) => el.name !== '_id')

  // const termsOfStudy = institution.settings.termsOfStudy
  return (
    <>
      <AlertMessage
        show={alertInfo.show}
        setShowError={setShowError}
        alertMessage={alertInfo.alertMessage}
        alertTitle={alertInfo.alertTitle}
        severity={alertInfo.severity}
      />

      <div className="settings-page__wrapper">
        <div className="settings-page__section">
          <Paper className="settings-page__account-wrapper">
            <div className="settings-page__account-row">
              <div className="settings-page__account-info">
                <img src={collagePhoto} />
                <Typography variant="h5">{institution.name}</Typography>
              </div>
              <div className="settings-page__logout-btn">
                <Typography variant="h6">{userData?.name}</Typography>
                <Button variant="contained" onClick={onClickLogout}>
                  Вийти з аккаунта
                </Button>
              </div>
            </div>
          </Paper>
        </div>

        <div className="settings-page__section">
          <h2 className="settings-page__section-title">Розклад дзвінків</h2>
          <Paper className="settings-page__paper">
            <ul className="settings-page__call-schedule-list">
              {callSchedule.map((el: CallScheduleAndTermsOfStudyType, index: number) => (
                <li className="settings-page__call-schedule-item" key={el._id}>
                  <Typography variant="h6">{`${index + 1})`}</Typography>
                  <LocalizationProvider localeText={ukUA.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <TimePickerViews label="Початок" defaultValue={String(el.start)} />
                  </LocalizationProvider>
                  <LocalizationProvider localeText={ukUA.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <TimePickerViews label="Кінець" defaultValue={String(el.end)} />
                  </LocalizationProvider>
                </li>
              ))}
            </ul>

            <SettingButtons saveButtonCallback={() => {}} closeButtonCallback={() => {}} />
          </Paper>
        </div>

        <div className="settings-page__section">
          <h2 className="settings-page__section-title">Терміни навчання</h2>
          <Paper className="settings-page__paper">
            <CurrentEducationTime
              title="Поточний навчальний рік"
              startLabel="Початок"
              startValue={currentTermsOfStudy.currentYear.start}
              endLabel="Кінець"
              endValue={currentTermsOfStudy.currentYear.end}
              setCurrentTermsOfStudy={setCurrentTermsOfStudy}
              currentTermsOfStudy={currentTermsOfStudy}
              componentType={'currentYear'}
            />
            <CurrentEducationTime
              title="Перший семестр"
              startLabel="Початок семестру"
              startValue={currentTermsOfStudy.firstSemester.start}
              endLabel="Кінець семестру"
              endValue={currentTermsOfStudy.firstSemester.end}
              setCurrentTermsOfStudy={setCurrentTermsOfStudy}
              currentTermsOfStudy={currentTermsOfStudy}
              componentType={'firstSemester'}
            />
            <CurrentEducationTime
              title="Другий семестр"
              startLabel="Початок семестру"
              startValue={currentTermsOfStudy.secondSemester.start}
              endLabel="Кінець семестру"
              endValue={currentTermsOfStudy.secondSemester.end}
              setCurrentTermsOfStudy={setCurrentTermsOfStudy}
              currentTermsOfStudy={currentTermsOfStudy}
              componentType={'secondSemester'}
            />

            <SettingButtons saveButtonCallback={onUpdateTermOfStudy} closeButtonCallback={onCancelTermOfStudyСhanges} />
          </Paper>
        </div>

        <div className="settings-page__section">
          <h2 className="settings-page__section-title">Показати розклад та навантаження за:</h2>
          <Paper className="settings-page__paper">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <LocalizationProvider
                dateAdapter={AdapterMoment}
                localeText={ukUA.components.MuiLocalizationProvider.defaultProps.localeText}
                adapterLocale="de">
                <StyledDatePicker
                  label={'Виберіть рік'}
                  value={showYear}
                  onChange={(value: any) => setShowYear(value)}
                  minDate={moment('2018', 'YYYY')}
                  maxDate={moment('2041', 'YYYY')}
                  format="YYYY"
                  views={['year']}
                />
              </LocalizationProvider>
            </div>

            <SettingButtons saveButtonCallback={onChangeCurrentShowedYear} closeButtonCallback={() => {}} />
          </Paper>
        </div>

        <div className="settings-page__section">
          <h2 className="settings-page__section-title">Налаштування кольорів</h2>
          <Paper className="settings-page__paper">
            {colorsData.map((el) => (
              <ColorPicker key={el.name} name={el.subjectType} value={el.value} />
            ))}

            <SettingButtons saveButtonCallback={() => {}} closeButtonCallback={() => {}} />
          </Paper>
        </div>

        <div className="settings-page__section">
          <h2 className="settings-page__section-title">Color mode</h2>
          <Paper className="settings-page__paper">
            <div style={{ textAlign: 'center' }}>
              <MaterialUISwitch className="burger-menu__color-mode-button" onClick={colorMode.toggleColorMode} />
            </div>
          </Paper>
        </div>

        <div className="settings-page__section">
          <h2 className="settings-page__section-title">Аккаунти</h2>
          <Paper className="settings-page__paper">
            {/* <Divider /> */}
            <div>Створити новий акаунт</div>
            <SettingButtons saveButtonCallback={() => {}} closeButtonCallback={() => {}} />
          </Paper>
        </div>
      </div>
    </>
  )
}

export default SettingsPage
