import moment from 'moment'

//
export const unixTimeConverter = (UNIX_timestamp: number) => {
  const a = new Date(UNIX_timestamp * 1000)

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

  const year = a.getFullYear()

  const month = months[a.getMonth()]

  const date = a.getDate()

  return `${date}.${month}.${year}`
}

export const convertDateToUnix = (date: number) => {
  const newDate = moment(date, 'DD.MM.YYYY').unix()

  const res = moment(newDate, 'DD-MM-YYYY')
  return res
}

export const convertUnixToDate = (date: number) => {
  const newDate = moment.unix(date).format('DD.MM.YYYY')

  const res = moment(newDate, 'DD-MM-YYYY')
  return res
}
