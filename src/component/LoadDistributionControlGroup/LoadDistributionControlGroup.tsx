import * as React from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { visuallyHidden } from '@mui/utils'
import { StyledTableCellBorder } from '../../theme'

interface Data {
  name: string
  semester: number
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
  exams: {
    hours: number | string
    teacher: string | number
  }
}

function createData(
  name: string,
  semester: number,
  lecturesHours: number | string,
  lecturesTeacher: string | number,
  practicalHours: number | string,
  practicalTeacher: string | number,
  laboratoryHours: number | string,
  laboratoryTeacher: string | number,
  examsHours: number | string,
  examsTeacher: string | number,
): Data {
  return {
    name,
    semester,
    lectures: {
      hours: lecturesHours,
      teacher: lecturesTeacher,
    },
    practical: {
      hours: practicalHours,
      teacher: practicalTeacher,
    },
    laboratory: {
      hours: laboratoryHours,
      teacher: laboratoryTeacher,
    },
    exams: {
      hours: examsHours,
      teacher: examsTeacher,
    },
  }
}

const rows = [
  createData('Філософія', 1, 20, 'Мельничук С.В.', 22, 'Мельничук С.В.', '-', '-', 2, 'Мельничук С.В.'),
  createData('Екологія та безпека життєдіяльності', 2, 18, 'Житова О.П.', 24, 'Житова О.П.', '-', '-', '-', '-'),
  createData(
    'Економіка і організація виробництва',
    2,
    20,
    'Ходаківський Є.І.',
    22,
    'Ходаківський Є.І.',
    '-',
    '-',
    2,
    'Ходаківський Є.І.',
  ),
  createData('ІТ-археологія', 2, 24, 'Лапін А.В.', 28, 'Лапін А.В.', '-', '-', '-', '-'),
  createData(
    'Основи обробки і передачі інформації',
    1,
    20,
    'Топольницький П.П.',
    22,
    'Топольницький П.П.',
    '-',
    '-',
    '-',
    '-',
  ),
  createData("Комп'ютерні мережі", 1, 12, 'Лапін А.В.', '-', '-', 28, 'Лапін А.В.', '-', '-'),
  createData("Комп'ютерні мережі.", 2, 16, 'Лапін А.В.', '-', '-', 26, 'Лапін А.В.', 2, 'Лапін А.В.'),
  createData('Моделювання систем', 1, 20, 'Молодецька К.В.', 22, 'Молодецька К.В.', '-', '-', 2, 'Молодецька К.В.'),
  createData(
    'Мікропроцесори в інформаційних системах',
    2,
    20,
    'Николюк О.М.',
    '-',
    '-',
    30,
    'Николюк О.М.',
    2,
    'Николюк О.М.',
  ),
  createData('Політологія', 2, 20, 'Мельничук І.А.', 22, 'Мельничук І.А.', '-', '-', 2, 'Мельничук І.А.'),
  createData('Інформаційний менеджмент', 2, 20, 'Николюк О.М.', 22, 'Николюк О.М.', '-', '-', '-', '-'),
  createData("Комп'ютерна графіка", 1, 20, 'Топольницький П.П.', '-', '-', 22, 'Топольницький П.П.', '-', '-'),
  createData(
    "Комп'ютерні технології обробки даних",
    1,
    20,
    'Грінчук І.О.',
    '-',
    '-',
    22,
    'Грінчук І.О.',
    2,
    'Грінчук І.О.',
  ),
  createData('Теорія прийняття рішень', 1, 16, 'Николюк О.М.', '-', '-', 24, 'Николюк О.М.', '-', '-'),
  createData('Програмне забезпечення служб internet', 2, 20, 'Лапін А.В.', '-', '-', 22, 'Лапін А.В.', 2, 'Лапін А.В.'),
]

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

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
  minWidth?: number
  colSpan?: number
  rowSpan?: number
  details?: string[]
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Назва дисципліни',
    minWidth: 170,
    rowSpan: 2,
  },
  {
    id: 'semester',
    numeric: true,
    disablePadding: false,
    label: 'Семестр',
    minWidth: 170,
    rowSpan: 2,
  },
  {
    id: 'lectures',
    numeric: true,
    disablePadding: false,
    label: 'Лекції',
    minWidth: 170,
    colSpan: 2,
    details: ['Години', 'Викладач'],
  },
  {
    id: 'practical',
    numeric: true,
    disablePadding: false,
    label: 'Практичні',
    minWidth: 170,
    colSpan: 2,
    details: ['Години', 'Викладач'],
  },
  {
    id: 'laboratory',
    numeric: true,
    disablePadding: false,
    label: 'Лабораторні',
    minWidth: 170,
    colSpan: 2,
    details: ['Години', 'Викладач'],
  },
  {
    id: 'exams',
    numeric: true,
    disablePadding: false,
    label: 'Екзамени',
    minWidth: 170,
    colSpan: 2,
    details: ['Години', 'Викладач'],
  },
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox" rowSpan={2}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <>
            <StyledTableCellBorder
              key={headCell.id}
              align={'center'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{ minWidth: headCell.minWidth }}
              rowSpan={headCell.rowSpan}
              colSpan={headCell.colSpan}>
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
            </StyledTableCellBorder>
          </>
        ))}
      </TableRow>

      {headCells.map(
        (headCell) =>
          headCell.details &&
          headCell.details.map((el) => (
            <StyledTableCellBorder
              key={el}
              align={'center'}
              padding={'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{ minWidth: '70px' }}>
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}>
                {el}
              </TableSortLabel>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </StyledTableCellBorder>
          )),
      )}
    </TableHead>
  )
}

const LoadDistributionControlGroup = () => {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('semester')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(true)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name)
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

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            {/* table head */}

            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />

            {/* table head */}

            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {/* {stableSort(rows, getComparator(order, orderBy)) */}

              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const isItemSelected = isSelected(row.name)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}>
                    <StyledTableCellBorder component="th" id={labelId} scope="row" /* padding="none" */>
                      {row.name}
                    </StyledTableCellBorder>
                    <StyledTableCellBorder align="center">{row.semester}</StyledTableCellBorder>
                    <StyledTableCellBorder align="center">{row.lectures.hours}</StyledTableCellBorder>
                    <StyledTableCellBorder align="center">{row.lectures.teacher}</StyledTableCellBorder>
                    <StyledTableCellBorder align="center">{row.practical.hours}</StyledTableCellBorder>
                    <StyledTableCellBorder align="center">{row.practical.teacher}</StyledTableCellBorder>
                    <StyledTableCellBorder align="center">{row.laboratory.hours}</StyledTableCellBorder>
                    <StyledTableCellBorder align="center">{row.laboratory.teacher}</StyledTableCellBorder>
                    <StyledTableCellBorder align="center">{row.exams.hours}</StyledTableCellBorder>
                    <StyledTableCellBorder align="center">{row.exams.teacher}</StyledTableCellBorder>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}

export default LoadDistributionControlGroup
