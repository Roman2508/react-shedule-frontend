import * as React from 'react'
import './LoadDistributionControl.scss'
import LoadDistributionControlGroup from '../../component/LoadDistributionControlGroup/LoadDistributionControlGroup'
import Paper from '@mui/material/Paper/Paper'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import LoadDistributionFilter from './LoadDistributionFilter'
import { IDistributedLoadSortParams, IDistributedLoadSortType } from './load-distribution.interface'
import { useSelector } from 'react-redux'
import { selectFaculties } from '../../redux/faculties/facultiesSelectors'
import { selectGroups } from '../../redux/group/groupSelector'
import { selectTeachersAndDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentSelector'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { useAppDispatch } from '../../redux/store'
import { getAllDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import { getAllFaculties } from '../../redux/faculties/facultiesAsyncAction'
import { getAllFacultyGroups } from '../../redux/group/groupAsyncAction'

const sortParamsInitialData = {
  mainItemName: '',
  mainItemId: '',
  secondaryItemName: '',
  secondaryItemId: '',
  currentSemester: '1',
}

const LoadDistributionControl = () => {
  const dispatch = useAppDispatch()

  const { faculties } = useSelector(selectFaculties)
  const { institution } = useSelector(selectAuthData)
  const { fullTimeGroups, partTimeGroups } = useSelector(selectGroups)
  const { departments } = useSelector(selectTeachersAndDepartments)

  const [sortType, setSortType] = React.useState<IDistributedLoadSortType>({ value: 'Група', type: 'group' })
  const [sortParams, setSortParams] = React.useState<IDistributedLoadSortParams>(sortParamsInitialData)

  React.useEffect(() => {
    const fetchData = async () => {
      if (institution) {
        dispatch(getAllDepartments(institution._id))
        const faculties = await dispatch(getAllFaculties(institution._id))
        const groups = await dispatch(getAllFacultyGroups(faculties.payload[0]._id))

        setSortParams((prev) => {
          return {
            ...prev,
            mainItemName: faculties.payload[0].name,
            mainItemId: faculties.payload[0]._id,
            secondaryItemName: groups.payload[0].name,
            secondaryItemId: groups.payload[0]._id,
          }
        })
      }
    }

    fetchData()
  }, [institution])

  React.useEffect(() => {}, [])

  return (
    <div className="load-distribution-control__wrapper">
      <Paper className="load-distribution-control__top">
        <LoadDistributionFilter
          faculties={faculties}
          departments={departments}
          sortParams={sortParams}
          sortType={sortType}
          setSortParams={setSortParams}
          setSortType={setSortType}
          groups={[...(fullTimeGroups || []), ...(partTimeGroups || [])]}
        />
      </Paper>
      <LoadDistributionControlGroup />
    </div>
  )
}

export default LoadDistributionControl
