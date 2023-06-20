import * as React from 'react'
import './educationalPlan.scss'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { visuallyHidden } from '@mui/utils'
import { StyledClosedButton } from '../../theme'
import EducationalPlanEdit from '../EducationalPlanEdit/EducationalPlanEdit'
import { useParams } from 'react-router-dom'
import { useAppDispatch } from '../../redux/store'
import {
  fetchEducationalPlans,
  fetchEducationalPlansById,
  removeSubject,
} from '../../redux/educationalPlan/educationalPlanAsyncAction'
import { selectEducationalPlan } from '../../redux/educationalPlan/educationalPlanSelector'
import { useSelector } from 'react-redux'
import { EducationalPlanType, SubjectType } from '../../redux/educationalPlan/educationalPlanTypes'
import EducationalPlanAddSubject from './EducationalPlanAddSubject'
import RemoveIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/ModeEditOutlined'
import CircularProgress from '@mui/material/CircularProgress'
// @ts-ignore
import emptyEdPlansImg from '../../assets/empty-ed-plans.png'
import AlertMessage from '../AlertMessage'
import { setShowError } from '../../redux/alerts/alertsSlise'
import { selectAlerts } from '../../redux/appSelectors'
import createAlertMessage from '../../utils/createAlertMessage'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { getAllDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'

interface Data {
  name: string
  totalHour: string
  firstSemester: number | string
  secondSemester: number | string
  thirdSemester: number | string
  fourthSemester: number | string
  fifthSemester: number | string
  sixthSemester: number | string
  seventhSemester: number | string
  eighthSemester: number | string
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
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: EducationalPlanType | {}, comparator: (a: T, b: T) => number) {
  if (Object.keys(array).length !== 0) {
    // @ts-ignore
    const stabilizedThis = array.subjects.map((el, index) => [el, index] as [T, number])
    // @ts-ignore
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) {
        return order
      }
      return a[1] - b[1]
    })
    // @ts-ignore
    return stabilizedThis.map((el) => el[0])
  }
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
    numeric: false,
    disablePadding: true,
    label: 'Назва дисципліни',
  },
  {
    id: 'totalHour',
    numeric: true,
    disablePadding: false,
    label: 'Загальна кількість годин',
  },
  {
    id: 'firstSemester',
    numeric: true,
    disablePadding: false,
    label: '1 сем.',
  },
  {
    id: 'secondSemester',
    numeric: true,
    disablePadding: false,
    label: '2 сем.',
  },
  {
    id: 'thirdSemester',
    numeric: true,
    disablePadding: false,
    label: '3 сем.',
  },
  {
    id: 'fourthSemester',
    numeric: true,
    disablePadding: false,
    label: '4 сем.',
  },
  {
    id: 'fifthSemester',
    numeric: true,
    disablePadding: false,
    label: '5 сем.',
  },
  {
    id: 'sixthSemester',
    numeric: true,
    disablePadding: false,
    label: '6 сем.',
  },
  {
    id: 'seventhSemester',
    numeric: true,
    disablePadding: false,
    label: '7 сем.',
  },
  {
    id: 'eighthSemester',
    numeric: true,
    disablePadding: false,
    label: '8 сем.',
  },
]

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  order: Order
  orderBy: string
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ borderRight: '1px solid rgb(219, 219, 219)', whiteSpace: 'nowrap' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

const EducationalPlan = () => {
  const params = useParams()

  const dispatch = useAppDispatch()

  const alertInfo = useSelector(selectAlerts)
  const { plan } = useSelector(selectEducationalPlan)
  const { institution } = useSelector(selectAuthData)

  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('totalHour')
  const [selected, setSelected] = React.useState<string>()
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(true)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const [openAddSubjectModal, setOpenAddSubjectModal] = React.useState(false)
  const [openEducationalPlanModal, setOpenEducationalPlanModal] = React.useState(false)
  const [modalRole, setModalRole] = React.useState<'add' | 'update'>('add')
  const [disciplineName, setDisciplineName] = React.useState('')
  const [activeSubjectId, setActiveSubjectId] = React.useState('')

  const [selectedSubject, setSelectedSubject] = React.useState<{
    id: number
    name: string
    hours: SubjectType
    semester: string
  } | null>(null)

  React.useEffect(() => {
    if (params.id) {
      dispatch(fetchEducationalPlansById(params.id))
    }

    if (institution) {
      dispatch(getAllDepartments(institution._id))
    }
  }, [])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenModal = (hours: SubjectType, name: string, id: number, semester: string) => {
    const data = { id, name, hours, semester }
    setSelectedSubject(data)
    setOpenEducationalPlanModal(true)
  }

  const onOpenAddSubjectModal = () => {
    setOpenAddSubjectModal(true)
  }

  const onRemoveSubject = async (id: string) => {
    if (window.confirm('Ви дійсно хочете видалити дисципліну?')) {
      const { payload } = await dispatch(removeSubject(id))
      createAlertMessage(dispatch, payload, 'Дисципліну видалено', 'Помилка при видаленні дисципліни :(')
    }
  }

  const onAddNewSubject = () => {
    setModalRole('add')
    onOpenAddSubjectModal()
  }

  const onChangeSubjectName = (name: string, id: string) => {
    setModalRole('update')
    setDisciplineName(name)
    onOpenAddSubjectModal()
    setActiveSubjectId(id)
  }

  if (plan === null) {
    return (
      <Box className="building-and-auditorium-preloader">
        <CircularProgress size={45} />
        {/* <LinearProgress /> */}
      </Box>
    )
  }

  return (
    <>
      <AlertMessage
        show={alertInfo.show}
        setShowError={setShowError}
        alertMessage={alertInfo.alertMessage}
        alertTitle={alertInfo.alertTitle}
        severity={alertInfo.severity}
      />

      <EducationalPlanEdit
        selectedSubject={selectedSubject}
        openEducationalPlanModal={openEducationalPlanModal}
        setOpenEducationalPlanModal={setOpenEducationalPlanModal}
      />

      <EducationalPlanAddSubject
        modalRole={modalRole}
        planId={String(plan._id)}
        activeSubjectId={activeSubjectId}
        disciplineName={disciplineName}
        setOpenAddSubjectModal={setOpenAddSubjectModal}
        openAddSubjectModal={openAddSubjectModal}
      />

      <div className="educational-plan">
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <Typography align="center" className="educational-plan__main-title">
              {plan.name}
            </Typography>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                className="educational-plan__empty-wrapper"
              >
                <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                {!plan.subjects.length ? (
                  <div>
                    <div className="educational-plan__empty-bg"></div>
                    <div className="educational-plan__empty-box">
                      <img src={emptyEdPlansImg} alt="empty-ed-plans" className="educational-plan__empty-img" />
                      <p className="educational-plan__empty-text">В навчальному плані відсутні дисципліни :(</p>
                    </div>
                  </div>
                ) : (
                  <TableBody>
                    {stableSort(plan, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row: any, index: number) => {
                        const labelId = `enhanced-table-checkbox-${index}`
                        const semestersKeysArray = Object.keys(row).filter(
                          (el) =>
                            el.includes('semester') &&
                            !el.includes('semester_9') &&
                            !el.includes('semester_10') &&
                            !el.includes('semester_11') &&
                            !el.includes('semester_12')
                        )
                        const totalHours = semestersKeysArray
                          .map((el) => {
                            return row[el]
                          })
                          .filter((el) => el !== null)
                          .reduce((sum, el) => el.inPlan + sum, 0)

                        return (
                          <TableRow
                            hover
                            onClick={() => setSelected(row.name)}
                            tabIndex={-1}
                            key={row.name}
                            selected={selected === row.name}
                          >
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              className="educational-plan__subject-name"
                              sx={{ borderRight: '1px solid rgb(219, 219, 219)' }}
                            >
                              <Typography component="p">{row.name}</Typography>

                              <div className="educational-plan__icons-wrapper">
                                <IconButton
                                  className="educational-plan__icon-button"
                                  onClick={() => onChangeSubjectName(row.name, row._id)}
                                >
                                  <EditIcon className="educational-plan__subject-name-edit" />
                                </IconButton>
                                <IconButton
                                  className="educational-plan__icon-button"
                                  onClick={() => onRemoveSubject(row._id)}
                                >
                                  <RemoveIcon className="educational-plan__subject-name-edit" />
                                </IconButton>
                              </div>
                            </TableCell>

                            <TableCell align="center" className="educational-plan__table-cell">
                              <StyledClosedButton sx={{ width: '100%', minHeight: '37px' }}>
                                {totalHours}
                              </StyledClosedButton>
                            </TableCell>

                            {semestersKeysArray.map((el) => (
                              <TableCell align="center" className="educational-plan__table-cell" key={el}>
                                <StyledClosedButton
                                  sx={{ width: '100%', minHeight: '37px' }}
                                  onClick={() => handleOpenModal(row[el], row.name, row._id, el)}
                                >
                                  {row[el] && row[el].inPlan}
                                </StyledClosedButton>
                              </TableCell>
                            ))}
                          </TableRow>
                        )
                      })}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <div className="edit-specializations__table-bottom">
              <Button sx={{ flex: '1' }} onClick={onAddNewSubject}>
                Додати нову дисципліну
              </Button>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={plan.subjects.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </Paper>
        </Box>
      </div>
    </>
  )
}

export default EducationalPlan
