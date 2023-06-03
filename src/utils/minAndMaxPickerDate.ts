import moment from 'moment'
import { TermsOfStudyType } from '../redux/accountInfo/accountInfoTypes'

type MinAndMaxPickerDatePropsType = {
  componentType: string
  currentTermsOfStudy: TermsOfStudyType
}

export const minAndMaxPickerDate = ({ componentType, currentTermsOfStudy }: MinAndMaxPickerDatePropsType) => {
  // Забороняю вибирати дату початку першого семестру раніше ніж дата початку навч. року
  // Забороняю вибирати дату початку другого семестру раніше ніж дата кінця першого семестру
  const startPickerMinDate =
    componentType === 'currentYear'
      ? moment('2022', 'YYYY')
      : componentType === 'firstSemester'
      ? moment(moment.unix(currentTermsOfStudy.currentYear.start), 'MM.DD.YYYY')
      : moment(moment.unix(currentTermsOfStudy.firstSemester.end), 'MM.DD.YYYY')

  // Забороняю вибирати дату початку навчального року раніше ніж дата кінця навчального року
  // Забороняю вибирати дату початку 1 семестру раніше ніж дата кінця 1 семестру
  // Забороняю вибирати дату початку 2 семестру раніше ніж дата кінця 2 семестру
  const startPickerMaxDate =
    componentType === 'currentYear'
      ? moment(moment.unix(currentTermsOfStudy.currentYear.end), 'MM.DD.YYYY')
      : componentType === 'firstSemester'
      ? moment(moment.unix(currentTermsOfStudy.firstSemester.end), 'MM.DD.YYYY')
      : moment(moment.unix(currentTermsOfStudy.secondSemester.end), 'MM.DD.YYYY')

  /*  */

  // Забороняю вибирати дату кінця навчального року раніше ніж дата початку навчального року
  // Забороняю вибирати дату кінця 1 семестру раніше ніж дата початку 1 семестру
  // Забороняю вибирати дату кінця 2 семестру раніше ніж дата початку 2 семестру
  const endPickerMinDate =
    componentType === 'currentYear'
      ? moment(moment.unix(currentTermsOfStudy.currentYear.start), 'MM.DD.YYYY')
      : componentType === 'firstSemester'
      ? moment(moment.unix(currentTermsOfStudy.firstSemester.start), 'MM.DD.YYYY')
      : moment(moment.unix(currentTermsOfStudy.secondSemester.start), 'MM.DD.YYYY')

  // Забороняю вибирати дату кінця другого семестру пізніше ніж дата кінця навч. року
  // Забороняю вибирати дату кінця першого семестру пізніше ніж дата початку другого семестру
  const endPickerMaxDate =
    componentType === 'currentYear'
      ? moment('2041', 'YYYY')
      : componentType === 'firstSemester'
      ? moment(moment.unix(currentTermsOfStudy.secondSemester.start), 'MM.DD.YYYY')
      : moment(moment.unix(currentTermsOfStudy.currentYear.end), 'MM.DD.YYYY')

  return {
    startPickerMinDate,
    startPickerMaxDate,
    endPickerMinDate,
    endPickerMaxDate,
  }
}

export default minAndMaxPickerDate
