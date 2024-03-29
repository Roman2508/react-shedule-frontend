import * as React from 'react'
import '../../component/LoadDistributionControl/LoadDistributionControl.scss'
import Paper from '@mui/material/Paper/Paper'
import {
  IDistributedLoadSortParams,
  IDistributedLoadSortType,
} from '../../component/LoadDistributionControl/load-distribution.interface'
import { useSelector } from 'react-redux'
import { selectFaculties } from '../../redux/faculties/facultiesSelectors'
import { selectGroups } from '../../redux/group/groupSelector'
import { selectTeachersAndDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentSelector'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { useAppDispatch } from '../../redux/store'
import { getAllDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import { getAllFaculties } from '../../redux/faculties/facultiesAsyncAction'
import { getAllFacultyGroups } from '../../redux/group/groupAsyncAction'
import moment from 'moment'
import LoadDistributionControlGroup from '../../component/LoadDistributionControl/LoadDistributionControlGroup'
import LoadDistributionFilter from '../../component/LoadDistributionControl/LoadDistributionFilter'

const sortParamsInitialData = {
  mainItemName: '',
  mainItemId: '',
  secondaryItemName: '',
  secondaryItemId: '',
  currentSemester: '1',
  currentYear: moment(new Date().getFullYear(), 'YYYY'),
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

  React.useEffect(() => {
    const fetchData = async () => {
      if (institution && sortParams.mainItemId) {
        if (sortType.type === 'group') {
          const groups = await dispatch(getAllFacultyGroups(sortParams.mainItemId))

          setSortParams((prev) => {
            return {
              ...prev,
              secondaryItemName: groups.payload[0].name,
              secondaryItemId: groups.payload[0]._id,
            }
          })
        }

        if (sortType.type === 'teacher') {
        }
      }
    }

    fetchData()
  }, [sortParams.mainItemId, institution])

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
      <LoadDistributionControlGroup sortParams={sortParams} />
    </div>
  )
}

export default LoadDistributionControl
