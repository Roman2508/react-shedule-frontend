import { Dispatch, SetStateAction } from 'react'
import { IDistributedLoadSortParams, IDistributedLoadSortType } from './load-distribution.interface'

interface IDisributionLoadFilterProps {
  // faculties: FacultyType[]
  // groups: GroupType[] | null
  // departments: DepartmentType[] | null
  sortType: IDistributedLoadSortType
  sortParams: IDistributedLoadSortParams
  setSortType: Dispatch<SetStateAction<IDistributedLoadSortType>>
  setSortParams: Dispatch<SetStateAction<IDistributedLoadSortParams>>
}

const useDisributionLoadFilter = ({}: IDisributionLoadFilterProps) => {
  

  return {}
}
