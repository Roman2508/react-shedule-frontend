import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { StyledTableForDistributedLoad } from '../../theme'
import { useSelector } from 'react-redux'
import { selectDistributedLoad } from '../../redux/distributedLoad/distributedLoadSelector'
import DistributedLoadTableHead from './distributed-load-table/DistributedLoadTableHead'
import { AppLoadingStatusTypes } from '../../redux/appTypes'
import CircularPreloader from '../CircularPreloader'
import image from '../../assets/schedule-icon.png'
import Typography from '@mui/material/Typography'
import { createTeacherName } from '../../utils/createTeacherName'
import { splitStreamsAndSubgroupsSubjects } from '../../utils/splitStreamsAndSubgroupsSubjects'
import { DistributedLoadSubjectsType } from '../../redux/distributedLoad/distributedLoadTypes'
import { IDistributedLoadSortParams } from './load-distribution.interface'
import { createSubjectRemark } from '../../utils/createSubjectRemark'
import LoadDistributionTotalRow from './distributed-load-table/LoadDistributionTotalRow'

interface Data {
  name: string
  remark: string
  lectures: {
    hours: number | string
    teacher: string | number
  }
  practical: {
    hours: number | string
    teacher: string | number
  }
  laboratory: {
    hours: number | string
    teacher: string | number
  }
  seminars: {
    hours: number | string
    teacher: string | number
  }
  exams: {
    hours: number | string
    teacher: string | number
  }
}

const testData = [
  {
    groupId: '644e549cb0a33b205dedb262',
    groupName: 'ВМ-23',
    name: 'Дисципліна 21',
    specialization: null,
    lectures: {
      hours: 24,
      stream: null,
      students: '27',
      subgroupNumber: null,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Практичні',
    },
    practical: {
      hours: 24,
      stream: null,
      students: '27',
      subgroupNumber: null,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Практичні',
    },
    _id: '645549934bd829076710b5ad',
    semester: '1',
  },
  {
    groupId: '644e549cb0a33b205dedb262',
    groupName: 'ВМ-23',
    name: 'Дисципліна 1',
    specialization: null,
    lectures: {
      hours: 24,
      stream: null,
      students: '27',
      subgroupNumber: null,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Практичні',
    },
    semester: '1',
    _id: '645549934bd829076710b5ad',
  },
  {
    groupId: '644e549cb0a33b205dedb262',
    groupName: 'ВМ-23',
    name: 'Дисципліна 1111',
    specialization: null,
    laboratory_1: {
      hours: 24,
      stream: null,
      students: '27',
      subgroupNumber: 1,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Практичні',
    },
    laboratory_2: {
      hours: 24,
      stream: null,
      students: '27',
      subgroupNumber: 2,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Практичні',
    },
    lectures: {
      hours: 24,
      stream: null,
      students: '27',
      subgroupNumber: null,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Практичні',
    },
    _id: '645549934bd829076710b5ad',
    semester: '1',
  },
  {
    groupId: '644e549cb0a33b205dedb262',
    groupName: 'ВМ-23',
    name: 'Дисципліна 1',
    specialization: null,
    lectures_1: {
      hours: 111,
      stream: null,
      students: '27',
      subgroupNumber: 1,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Лекції',
    },
    lectures_2: {
      hours: 111,
      stream: null,
      students: '27',
      subgroupNumber: 2,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Лекції',
    },
    practical: {
      hours: 24,
      stream: null,
      students: '27',
      subgroupNumber: null,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Практичні',
    },

    semester: '1',
    _id: '645549934bd829076710b5ad',
  },
  {
    groupId: '644e549cb0a33b205dedb262',
    groupName: 'ВМ-23',
    name: 'Дисципліна 1',
    specialization: null,
    laboratory: {
      hours: 24,
      stream: null,
      students: '27',
      subgroupNumber: null,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Практичні',
    },
    practical: {
      hours: 24,
      stream: null,
      students: '27',
      subgroupNumber: null,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Практичні',
    },
    exams: {
      hours: 222,
      stream: 'Потік 111',
      students: '27',
      subgroupNumber: null,
      teacher: {
        _id: '643443d990557efe120044aa',
        firstName: 'Юлія',
        middleName: 'Юзефівна',
        lastName: 'Мороз',
        formOfWork: 'Штатний',
      },
      type: 'Практичні',
    },
    semester: '1',
    _id: '645549934bd829076710b5ad',
  },
]

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1
//   }
//   return 0
// }

type Order = 'asc' | 'desc'

// function getComparator<Key extends keyof any>(
//   order: Order,
//   orderBy: Key,
// ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy)
// }

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly

////////////////////////////////////////////////////////////////////////////////////
// function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
//   const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0])
//     if (order !== 0) {
//       return order
//     }
//     return a[1] - b[1]
//   })
//   return stabilizedThis.map((el) => el[0])
// }
////////////////////////////////////////////////////////////////////////////////////

const subjectTypes = ['lectures', 'practical', 'laboratory', 'seminars', 'exams']

const LoadDistributionControlGroup: React.FC<{ sortParams: IDistributedLoadSortParams }> = ({ sortParams }) => {
  const { distributedSemesterLoad, loadingStatus } = useSelector(selectDistributedLoad)

  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const [distributedLoad, setDistributedLoad] = React.useState<DistributedLoadSubjectsType[]>([])

  React.useEffect(() => {
    if (distributedSemesterLoad) {
      // @ts-ignore
      setDistributedLoad(splitStreamsAndSubgroupsSubjects(distributedSemesterLoad))
    }
  }, [distributedSemesterLoad])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && distributedSemesterLoad) {
      const newSelected = distributedSemesterLoad.map((n) => n.name)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (distributedSemesterLoad?.length || 0)) : 0

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {loadingStatus === AppLoadingStatusTypes.LOADING && <CircularPreloader />}

        {distributedLoad && distributedLoad.length ? (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'small'}>
                {/* table head */}
                <DistributedLoadTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={distributedLoad.length}
                />
                {/* table head */}

                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                  {/* {stableSort(rows, getComparator(order, orderBy)) */}

                  {distributedLoad.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const isItemSelected = isSelected(row.name)

                    const groupName =
                      row.groupName ||
                      (sortParams.secondaryItemId === row.groupId ? sortParams.secondaryItemName : '---')

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}>
                        {/*  */}
                        <StyledTableForDistributedLoad component="th" scope="row">
                          {row.name}
                        </StyledTableForDistributedLoad>

                        <StyledTableForDistributedLoad align="center">
                          {`${groupName} (Сем.${row.semester})`}
                        </StyledTableForDistributedLoad>

                        {subjectTypes.map((subjectType: string) => {
                          const { teacherName } = createTeacherName(row, subjectType)

                          const keys = Object.keys(row).filter(
                            (k) =>
                              k.includes('lectures') ||
                              k.includes('practical') ||
                              k.includes('laboratory') ||
                              k.includes('seminars') ||
                              k.includes('exams'),
                          )

                          const currentKey = keys.find((k) => k.includes(subjectType))

                          const subjectRemark = currentKey
                            ? // @ts-ignore
                              createSubjectRemark(row, row[currentKey])
                            : createSubjectRemark(row)

                          return (
                            <React.Fragment key={subjectType}>
                              {/* @ts-ignore */}
                              {!!currentKey && !!row[currentKey] ? (
                                <>
                                  <StyledTableForDistributedLoad align="center">
                                    {subjectRemark
                                      ? // @ts-ignore
                                        `${subjectRemark}(${row[currentKey].hours})`
                                      : // @ts-ignore
                                        row[currentKey].hours}
                                  </StyledTableForDistributedLoad>
                                  <StyledTableForDistributedLoad align="center">
                                    {teacherName}
                                  </StyledTableForDistributedLoad>
                                </>
                              ) : (
                                <>
                                  <StyledTableForDistributedLoad align="center">-</StyledTableForDistributedLoad>
                                  <StyledTableForDistributedLoad align="center">-</StyledTableForDistributedLoad>
                                </>
                              )}
                            </React.Fragment>
                          )
                        })}
                      </TableRow>
                    )
                  })}

                  {/* total load */}
                  <LoadDistributionTotalRow distributedLoad={distributedLoad} />
                  {/* total load */}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 33 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={distributedLoad.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 20px 100px' }}>
            <img src={image} width={200} alt="calendar icon" />
            <Typography variant="h6">Виберіть групу або викладача!</Typography>
          </div>
        )}
      </Paper>
    </Box>
  )
}

export default LoadDistributionControlGroup
