import * as React from 'react'
import './StructuralUnitsGroup.scss'
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
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/AddRounded'
import { StyledButton } from '../../theme'
import { SpecialtyType } from '../../redux/faculties/facultiesTypes'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import { GroupType } from '../../redux/group/groupTypes'
import { removeGroup } from '../../redux/group/groupAsyncAction'
import { useAppDispatch } from '../../redux/store'
import EmptyGroupsIcon from '@mui/icons-material/ContentPasteSearchOutlined'
import { AppLoadingStatusTypes } from '../../redux/appTypes'
import Typography from '@mui/material/Typography'
import createAlertMessage from '../../utils/createAlertMessage'

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
function stableSort<T extends GroupType>(array: GroupType[], comparator: (a: T, b: T) => number) {
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
  id: keyof GroupType
  label: string
  numeric: boolean
  maxWidth?: number
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Шифр групи',
  },
  {
    id: 'students',
    numeric: true,
    disablePadding: false,
    label: 'К-ть студентів',
    maxWidth: 145,
  },
  {
    id: 'yearOfAdmission',
    numeric: true,
    disablePadding: false,
    label: 'Рік вступу',
    maxWidth: 120,
  },
  {
    id: 'courseNumber',
    numeric: true,
    disablePadding: false,
    label: 'Курс',
    maxWidth: 85,
  },
  {
    id: '_id', // ??????????????????????????????????
    numeric: true,
    disablePadding: false,
    label: 'Дії',
  },
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof GroupType) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof GroupType) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ maxWidth: headCell.maxWidth }}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{ paddingLeft: '10px' }}>
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

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

type StructuralUnitsGroupPropsType = {
  setIsNewGroup: (value: boolean) => void
  setOpenGroupInfo: (value: boolean) => void
  groupsList: GroupType[] | null
  setSelectedGroupId: (id: string | null) => void
  setSelectedPlanName: (value: string) => void
  loadingStatus: AppLoadingStatusTypes
}

const StructuralUnitsGroup: React.FC<StructuralUnitsGroupPropsType> = ({
  groupsList,
  loadingStatus,
  setIsNewGroup,
  setOpenGroupInfo,
  setSelectedGroupId,
  setSelectedPlanName,
}) => {
  const dispatch = useAppDispatch()

  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof GroupType>('name')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(true)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof GroupType) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
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

  const onRemoveGroup = async (id: string) => {
    if (window.confirm('Ви дійсно хочете видалити групу?')) {
      const { payload } = await dispatch(removeGroup(id))
      createAlertMessage(dispatch, payload, 'Групу видалено', 'Помилка при видаленні групи :(')
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const onSelectGroup = (id: string) => {
    setSelectedGroupId(id)
    setOpenGroupInfo(true)
    setIsNewGroup(false)
  }

  const onOpenNewGroupModal = () => {
    setSelectedGroupId(null)
    setOpenGroupInfo(true)
    setSelectedPlanName('')
    setIsNewGroup(true) ///////////////////////////////////////////////////
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (groupsList?.length || 0)) : 0
  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (activeSpecialtyItem?.groups.length || 0)) : 0

  // if (loadingStatus === AppLoadingStatusTypes.ERROR) {
  //   return (
  //     <div style={{ textAlign: 'center', padding: '20px 0' }}>
  //       <Typography variant="h6">Помилка при завантаженні даних :(</Typography>
  //     </div>
  //   )
  // }

  // if (loadingStatus !== AppLoadingStatusTypes.SUCCESS) {
  //   return (
  //     <Stack spacing={1} sx={{ padding: '16px 8px' }}>
  //       <Skeleton variant="rounded" width={'100%'} height={48} />
  //       <Skeleton variant="rounded" width={'100%'} height={48} />
  //       <Skeleton variant="rounded" width={'100%'} height={48} />
  //     </Stack>
  //   )
  // }

  if (groupsList === null) {
    return (
      <div
        style={{
          paddingTop: '16px',
          textAlign: 'center',
          height: '60px',
        }}>
        <EmptyGroupsIcon style={{ opacity: '0.6' }} />
      </div>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={() => {}}
              onRequestSort={handleRequestSort}
              rowCount={groupsList.length}
            />
            <TableBody>
              {groupsList.length ? (
                /* @ts-ignore */
                stableSort(groupsList, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((group: GroupType, index: number) => {
                    const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, group.name)}
                        role="checkbox"
                        tabIndex={-1}
                        key={group._id}>
                        <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ paddingLeft: '10px' }}>
                          {group.name}
                        </TableCell>
                        <TableCell align="right">{group.students}</TableCell>
                        <TableCell align="right">{group.yearOfAdmission}</TableCell>
                        <TableCell align="right">{group.courseNumber}</TableCell>

                        <TableCell align="right">
                          <IconButton sx={{ minWidth: 'auto', cursor: 'pointer', margin: '0 5px 0 0', padding: '5px' }}>
                            <EyeIcon />
                          </IconButton>

                          <IconButton
                            sx={{ minWidth: 'auto', cursor: 'pointer', margin: '0 5px', padding: '5px' }}
                            onClick={() => onSelectGroup(group._id)}>
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            sx={{ minWidth: 'auto', cursor: 'pointer', marginLeft: '5px', padding: '5px' }}
                            onClick={() => onRemoveGroup(group._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })
              ) : (
                <tr style={{ textAlign: 'center', height: '60px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                  <td colSpan={5}>
                    <EmptyGroupsIcon style={{ opacity: '0.6' }} />
                  </td>
                </tr>
              )}
              {}
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
        <div className="structural-units-group__bottom">
          <StyledButton
            className="structural-units-add-button"
            onClick={onOpenNewGroupModal}
            sx={{ height: '40px', padding: '0 50px' }}>
            <span>Додати нову групу </span>
            <AddIcon sx={{ width: 18, height: 18, marginTop: '-2px' }} />
          </StyledButton>
          {/* <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" /> */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={groupsList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
    </Box>
  )
}

export default StructuralUnitsGroup

/* 
  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }
*/
