export interface IDistributedLoadSortParams {
  mainItemName: string
  mainItemId: string
  secondaryItemName: string
  secondaryItemId: string
  currentSemester: string
}

export interface IDistributedLoadSortType {
  value: 'Група' | 'Викладач'
  type: 'group' | 'teacher'
}
