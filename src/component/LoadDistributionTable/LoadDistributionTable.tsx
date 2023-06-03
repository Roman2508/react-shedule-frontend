import * as React from 'react'
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
import { visuallyHidden } from '@mui/utils'
import { StyledTableCell } from '../../theme'
import '../../Pages/LoadDistribution/LoadDistribution.scss'
import { DistributedLoadSubjectsType, DistributedLoadType } from '../../redux/distributedLoad/distributedLoadTypes'
import CircularProgress from '@mui/material/CircularProgress'
import reactLogo from '../../assets/table.svg'
import { AppLoadingStatusTypes } from '../../redux/appTypes'

interface Data {
  name: string
  teacher: string
  semester: number
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
function stableSort<T>(array: any, comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el: any, index: number) => [el, index] as [T, number])
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el: any) => el[0])
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
    id: 'semester',
    numeric: false,
    disablePadding: false,
    label: 'Семестр',
  },
]

interface EnhancedTableProps {
  // numSelected: number
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
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

////////////////////////////////////////////////////////

type LoadDistributionTablePropsType = {
  loadingStatus: AppLoadingStatusTypes
  distributedLoad: DistributedLoadType | null
  selected: DistributedLoadSubjectsType | null
  setSelected: (value: DistributedLoadSubjectsType) => void
}

const LoadDistributionTable: React.FC<LoadDistributionTablePropsType> = ({
  selected,
  setSelected,
  loadingStatus,
  distributedLoad,
}) => {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('semester')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

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

  if (distributedLoad === null && loadingStatus === AppLoadingStatusTypes.LOADING) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <CircularProgress size={40} />
      </div>
    )
  }

  if (distributedLoad === null || !distributedLoad?.load.length) {
    return (
      <div className="load-distribution__groups--empty">
        <img src={reactLogo} />
      </div>
    )
  }

  return (
    <Paper>
      <TableContainer>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
            {stableSort(distributedLoad.load, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: DistributedLoadSubjectsType, index: number) => {
                const isItemSelected = row.name === selected?.name && row.semester === selected?.semester
                const labelId = `enhanced-table-checkbox-${index}`

                const isHide = row.specialization?.name === 'Не вивчається'

                return (
                  <TableRow
                    hover
                    onClick={() => setSelected(row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={`${row.name}${row.semester}`}
                    selected={isItemSelected}
                    sx={isHide ? { display: 'none' } : { cursor: 'pointer' }}>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ padding: '5px 0 5px 10px !important', fontSize: '16px' }}>
                      {row.name}
                      {row.specialization ? ` (${row.specialization.name})` : ''}
                    </TableCell>
                    <TableCell align="center" padding="none" sx={{ fontSize: '16px' }}>
                      {row.semester}
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="load-distribution__table-bottom">
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={distributedLoad.load.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Paper>
  )
}

export default LoadDistributionTable
