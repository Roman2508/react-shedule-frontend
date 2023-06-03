import * as React from 'react'
import './ScheduleSubjectsList.scss'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { StyledTableCell, StyledTableSortLabel } from '../../theme'
import { TeacherType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'
import ScheduleIcon from '../../assets/schedule-icon.png'
import {
  DistributedLoadSubjectsType,
  DistributedStreamType,
  DistributedSubjectType,
  LessonsListItemType,
  SelectedDistributedLoadType,
} from '../../redux/distributedLoad/distributedLoadTypes'
import {
  ActiveFilterType,
  lessonsType,
  SelectedAuditoryScheduleType,
  SelectedGroupScheduleType,
  selectedSubjectType,
  SelectedTeacherScheduleType,
} from '../../redux/lessons/lessonsTypes'
import { createSubjectType } from '../ScheduleAddModal/ScheduleSeveralSubjects'
import { getDistributedTeacherLoad } from '../../redux/distributedLoad/distributedLoadAsyncAction'
import { useAppDispatch } from '../../redux/store'
import { createSelectedDistributedLoad } from '../../utils/createSelectedDistributedLoad'
import ScheduleSubjectTableBody from './ScheduleSubjectTableBody'
import { setDublicatedLessonItems } from '../../utils/setDublicatedLessonItems'
import { useSelector } from 'react-redux'
// import { selectSettings } from '../../redux/settings/settingsSelector'
import convertTeacherLoadToDistributedLoad from '../../utils/convertTeacherLoadToDistributedLoad'
import Button from '@mui/material/Button'
import { AppLoadingStatusTypes } from '../../redux/appTypes'

interface Data {
  name: string
  type: string
  remark: string
  teacher: TeacherType
  inPlan: number
  inFact: number
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: true,
    disablePadding: true,
    label: 'Назва дисципліни',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Вид',
  },
  {
    id: 'remark',
    numeric: false,
    disablePadding: false,
    label: 'Примітка',
  },
  {
    id: 'teacher',
    numeric: false,
    disablePadding: false,
    label: 'Викладач',
  },
  {
    id: 'inPlan',
    numeric: false,
    disablePadding: false,
    label: 'План',
  },
  {
    id: 'inFact',
    numeric: false,
    disablePadding: false,
    label: 'Факт',
  },
]

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  order: Order
  orderBy: string
}

////////////////////////////////////////////////////
function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'left' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={headCell.label === 'Назва дисципліни' ? { padding: '2px 2px 2px 6px' } : { padding: '2px' }}>
            <StyledTableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
            </StyledTableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

////////////////////////////////////////////////////////
////////////////--ScheduleSubjectsList--////////////////
////////////////////////////////////////////////////////

type ScheduleSubjectsListPropsType = {
  lessons: [] | lessonsType[]
  selected: selectedSubjectType
  setSelected: (value: any) => void
  loadingStatus: AppLoadingStatusTypes
  selectedDistributedLoad: SelectedDistributedLoadType[]
}

const ScheduleSubjectsList: React.FC<ScheduleSubjectsListPropsType> = ({
  lessons,
  selected,
  setSelected,
  loadingStatus,
  selectedDistributedLoad,
  // groupName,
  // distributedLoad,
  // selectedSemester,
  // activeLessonsFilter,
  // currentAuditoryLessons,
  // selectedTeacherSchedule,
  // setSelectedDistributedLoad,
}) => {
  // const dispatch = useAppDispatch()

  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('type')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(20)

  // При першому рендері виділяти активний елемент
  React.useEffect(() => {
    if (selectedDistributedLoad.length > 0) {
      setSelected({
        data: selectedDistributedLoad[0],
        subjectId: selectedDistributedLoad[0]._id,
        // @ts-ignore
        groupId: selectedDistributedLoad[0].groupId,
        stream: selectedDistributedLoad[0].stream,
      })
    }
  }, [selectedDistributedLoad])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 20))
    setPage(0)
  }

  return (
    <Paper>
      <TableContainer>
        <Table aria-labelledby="tableTitle" sx={{ position: 'relative' }}>
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          {selectedDistributedLoad.length === 0 && loadingStatus !== AppLoadingStatusTypes.LOADING && (
            <tbody>
              <tr>
                <td>
                  <div style={{ minHeight: '340px' }}>
                    <img src={ScheduleIcon} className="schedule-subjects__table--empty" />
                  </div>
                </td>
              </tr>
            </tbody>
          )}

          {/* TableBody */}

          <ScheduleSubjectTableBody
            lessons={lessons}
            selected={selected}
            setSelected={setSelected}
            selectedDistributedLoad={selectedDistributedLoad}
          />
          {/* // TableBody */}
        </Table>
      </TableContainer>

      <div className="schedule-subjects__table-bottom">
        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 20]}
          count={selectedDistributedLoad.length}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Paper>
  )
}

export default React.memo(ScheduleSubjectsList)

// Змінюю selectedDistributedLoad в залежності від вибраного розкладу Групи / Викладача / Аудиторії
// selectedDistributedLoad - це список дисциплін в таблиці ScheduleSubjectTableBody
// React.useEffect(() => {
//   if (distributedLoad) {
//     const fetchSelectedDistributedLoad = async () => {
//       if (activeLessonsFilter.value === 'Група') {
//         const newDistributedLoad = createSelectedDistributedLoad(distributedLoad, selectedSemester, groupName)
//         setSelectedDistributedLoad(newDistributedLoad)
//       }

//       if (activeLessonsFilter.value === 'Викладач' && selectedTeacherSchedule.teacherId) {
//         const { payload } = await dispatch(
//           getDistributedTeacherLoad({ semester: selectedSemester, teacher: selectedTeacherSchedule.teacherId }),
//         )
//         const newDistributedLoad = createSelectedDistributedLoad(payload, selectedSemester, groupName)
//         setSelectedDistributedLoad(newDistributedLoad)
//       }

//       if (activeLessonsFilter.value === 'Аудиторія') {
//         const newDistributedLoad = convertTeacherLoadToDistributedLoad(currentAuditoryLessons)
//         setSelectedDistributedLoad(newDistributedLoad)
//       }
//     }

//     fetchSelectedDistributedLoad()
//   }
// }, [distributedLoad, activeLessonsFilter, selectedTeacherSchedule, currentAuditoryLessons, selectedSemester])
