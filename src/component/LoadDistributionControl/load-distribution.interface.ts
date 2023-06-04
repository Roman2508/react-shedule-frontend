import moment from 'moment'

export interface IDistributedLoadSortParams {
  mainItemName: string
  mainItemId: string
  secondaryItemName: string
  secondaryItemId: string
  currentSemester: string
  currentYear: moment.Moment
}

export interface IDistributedLoadSortType {
  value: 'Група' | 'Викладач'
  type: 'group' | 'teacher'
}
