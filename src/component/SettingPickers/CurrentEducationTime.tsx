import React from 'react'
import moment, { Moment } from 'moment'
import '../../Pages/Settings/SettingsPage.scss'
import { StyledDatePicker } from '../../theme'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Typography from '@mui/material/Typography'
import { ukUA } from '@mui/x-date-pickers'
import { convertUnixToDate } from '../../utils/unixTimeConverter'
import { TermsOfStudyType } from '../../redux/accountInfo/accountInfoTypes'
import minAndMaxPickerDate from '../../utils/minAndMaxPickerDate'

moment.updateLocale('en', {
  week: {
    dow: 1,
  },
  // weekdays: {
  //   standalone: 'Неділя_Понеділок_Вівторок_Среда_Четвер_П`ятниця_Субота'.split('_'),
  //   format: 'Воскресенье_Понедельник_Вторник_Среду_Четверг_Пятницу_Субботу'.split('_'),
  //   isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/,
  // },
})

type CurrentEducationTimePropsTypes = {
  title: string
  startLabel: string
  startValue: number
  endLabel: string
  endValue: number
  setCurrentTermsOfStudy: (value: TermsOfStudyType) => void
  currentTermsOfStudy: TermsOfStudyType
  componentType: string
}

const CurrentEducationTime: React.FC<CurrentEducationTimePropsTypes> = ({
  title,
  startLabel,
  startValue,
  endLabel,
  endValue,
  setCurrentTermsOfStudy,
  currentTermsOfStudy,
  componentType,
}) => {
  const [startDate, setStartDate] = React.useState(moment(startValue, 'DD-MM-YYYY'))
  const [endDate, setEndDate] = React.useState(moment(endValue, 'DD-MM-YYYY'))

  React.useEffect(() => {
    const start = convertUnixToDate(startValue)
    const end = convertUnixToDate(endValue)

    setStartDate(start)
    setEndDate(end)
  }, [currentTermsOfStudy])

  // Оновлюю currentTermsOfStudy
  const onChangeTimePicker = (value: any, type: string) => {
    // @ts-ignore
    setCurrentTermsOfStudy((prev) => {
      const unixTime = value.unix()

      // Якщо я змінню початок навчального року то початок першого семестру також змінюється
      // Якщо я змінню кінець навчального року то кінець другого семестру також змінюється
      if (componentType === 'currentYear') {
        /*  */
        if (type === 'start') {
          return {
            ...prev,
            [componentType]: {
              ...prev[componentType],
              [type]: unixTime,
            },
            firstSemester: {
              ...prev.firstSemester,
              start: unixTime,
            },
          }
        } else if (type === 'end') {
          return {
            ...prev,
            [componentType]: {
              ...prev[componentType],
              [type]: unixTime,
            },
            secondSemester: {
              ...prev.secondSemester,
              end: unixTime,
            },
          }
        }
        /*  */
      }

      return {
        ...prev,
        [componentType]: {
          ...prev[componentType],
          [type]: unixTime,
        },
      }
    })
  }

  // Обмеження вибору максимальної та мінімальної дати
  const { startPickerMinDate, startPickerMaxDate, endPickerMinDate, endPickerMaxDate } = minAndMaxPickerDate({
    componentType,
    currentTermsOfStudy,
  })

  return (
    <div className="settings-page__current-wrapper">
      <Typography variant="h6" className="settings-page__current-title">
        {title}
      </Typography>
      <div className="settings-page__current-controls">
        <LocalizationProvider
          dateAdapter={AdapterMoment}
          localeText={ukUA.components.MuiLocalizationProvider.defaultProps.localeText}
          // minDate={minDate ? moment(minDate, 'MM-DD-YYYY').toDate() : undefined}
          // maxDate={maxDate ? moment(maxDate, 'MM-DD-YYYY').toDate() : undefined}
          adapterLocale="de">
          <StyledDatePicker
            label={startLabel}
            value={startDate}
            onChange={(value: any) => onChangeTimePicker(value, 'start')}
            format="DD.MM.YYYY"
            minDate={startPickerMinDate}
            maxDate={startPickerMaxDate}
          />

          <span>-</span>

          <StyledDatePicker
            label={endLabel}
            value={endDate}
            onChange={(value: any) => onChangeTimePicker(value, 'end')}
            format="DD.MM.YYYY"
            minDate={endPickerMinDate}
            maxDate={endPickerMaxDate}
          />
        </LocalizationProvider>
      </div>
    </div>
  )
}

export default CurrentEducationTime
