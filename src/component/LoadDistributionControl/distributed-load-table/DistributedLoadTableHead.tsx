import * as React from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TableHead from '@mui/material/TableHead'
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
import { StyledTableForDistributedLoad } from '../../../theme'
import { selectLessons } from '../../../redux/lessons/lessonsSelector'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../../redux/store'
import { selectAuthData } from '../../../redux/accountInfo/accountInfoSelector'
import { getLessonsById } from '../../../redux/lessons/lessonsAsyncActions'
import { getDistributedTeacherLoad } from '../../../redux/distributedLoad/distributedLoadAsyncAction'
import { selectDistributedLoad } from '../../../redux/distributedLoad/distributedLoadSelector'

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
    minWidth: 200,
    rowSpan: 2,
  },
  {
    id: 'remark',
    numeric: true,
    disablePadding: false,
    label: 'Група (Семестр)',
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
    id: 'seminars',
    numeric: true,
    disablePadding: false,
    label: 'Семінари',
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

type Order = 'asc' | 'desc'

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

const DistributedLoadTableHead = (props: EnhancedTableProps) => {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <>
            <StyledTableForDistributedLoad
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
            </StyledTableForDistributedLoad>
          </>
        ))}
      </TableRow>

      {headCells.map(
        (headCell) =>
          headCell.details &&
          headCell.details.map((el) => (
            <StyledTableForDistributedLoad
              key={el}
              align={'center'}
              padding={'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{ minWidth: '70px' }}>
              {el}
            </StyledTableForDistributedLoad>
          )),
      )}
    </TableHead>
  )
}

export default DistributedLoadTableHead
