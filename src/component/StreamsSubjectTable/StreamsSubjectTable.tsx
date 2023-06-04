import * as React from 'react'
import '../../Pages/Streams/Streams.scss'
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
import { visuallyHidden } from '@mui/utils'
import Button from '@mui/material/Button'
import { StyledTableCell } from '../../theme'
import StreamsModal from '../StreamsModal/StreamsModal'
import { StreamsType } from '../../redux/streams/streamsTypes'
import { useAppDispatch } from '../../redux/store'
import { getGroupLoad } from '../../redux/streams/streamsAsyncActions'
import { useSelector } from 'react-redux'
import { selectStreams } from '../../redux/streams/streamsSelector'
import createListOfSubjects, { ListSubjectType } from '../../utils/createListOfSubjects'
import { clearStreamsLoad } from '../../redux/streams/streamsSlise'
import reactLogo from '../../assets/table.svg'
import { getSubgroups } from '../../redux/group/groupAsyncAction'
import { selectGroups } from '../../redux/group/groupSelector'
import { SubgroupsType } from '../../redux/group/groupTypes'
import { removeSubgroupsList } from '../../redux/group/groupSlise'

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
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
// function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
function stableSort<T>(array: ListSubjectType[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as unknown as [T, number])
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
  id: keyof ListSubjectType
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
    id: 'group',
    numeric: true,
    disablePadding: false,
    label: 'Група',
  },
  {
    id: 'semester',
    numeric: true,
    disablePadding: false,
    label: 'Семестр',
  },
  {
    id: 'lectures',
    numeric: true,
    disablePadding: false,
    label: 'Лекції',
  },
  {
    id: 'practical',
    numeric: true,
    disablePadding: false,
    label: 'Практичні',
  },
  {
    id: 'laboratory',
    numeric: true,
    disablePadding: false,
    label: 'Лабораторні',
  },
  {
    id: 'seminars',
    numeric: true,
    disablePadding: false,
    label: 'Семінари',
  },
  {
    id: 'exams',
    numeric: true,
    disablePadding: false,
    label: 'Екзамен',
  },
]

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ListSubjectType) => void
  order: Order
  orderBy: string
}

////////////////////////////////////////////////////
const EnhancedTableHead: React.FC<EnhancedTableProps> = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = (property: keyof ListSubjectType) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
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

////////////////////////////////////////////////////////////////
type EnhancedTableToolbarProps = {
  numSelected: number
  showMergedItems: boolean
  setOpenStreamsModal: (value: boolean) => void
}

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
  numSelected,
  showMergedItems,
  setOpenStreamsModal,
}) => {
  const handleOpenModal = () => {
    setOpenStreamsModal(true)
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}>
      <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
        Вибрано: {numSelected}
      </Typography>

      {showMergedItems ? (
        <Button sx={{ width: '400px' }} disabled={numSelected <= 1} onClick={handleOpenModal}>
          Роз’єднати вибрані елементи
        </Button>
      ) : (
        <Button sx={{ width: '400px' }} disabled={numSelected <= 1} onClick={handleOpenModal}>
          Об’єднати вибрані елементи
        </Button>
      )}
    </Toolbar>
  )
}

////////////////////////////////////////////////////////

type StreamsSubjectTablePropsType = {
  showMergedItems: boolean
  activeStream: StreamsType | null
  setActiveStream: (value: StreamsType | null) => void
  filterMergedSubjects: (subjects: ListSubjectType[]) => ListSubjectType[]
}

const StreamsSubjectTable: React.FC<StreamsSubjectTablePropsType> = ({
  showMergedItems,
  activeStream,
  setActiveStream,
  filterMergedSubjects,
}) => {
  const dispatch = useAppDispatch()

  const { streamsLoad } = useSelector(selectStreams)

  const { subgroupsList } = useSelector(selectGroups)

  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof ListSubjectType>('name')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)

  const [openStreamsModal, setOpenStreamsModal] = React.useState(false)

  const [subjects, setSubjects] = React.useState<ListSubjectType[] | []>([])
  const [finalSubjects, setFinalSubjects] = React.useState<ListSubjectType[] | []>([])

  const [selectedSubjects, setSelectedSubjects] = React.useState<ListSubjectType[] | []>([])

  // Отримую дисципліни, що розділені на підгрупи
  React.useEffect(() => {
    dispatch(removeSubgroupsList())
    setSelectedSubjects([])
    // Масив ід груп, які об'єднані в потік
    const groupIdList: string[] = []

    subjects.forEach((el) => {
      const findedSubject = groupIdList.find((id) => String(id) === String(el.groupId))

      if (!findedSubject) {
        groupIdList.push(String(el.groupId))
      }
    })

    // Отримую всі дисципліни, які розділенні на підгрупи

    groupIdList.forEach((el) => {
      dispatch(getSubgroups(el))
    })
  }, [subjects, activeStream])

  React.useEffect(() => {
    //
    const splitSubjects = (
      el: ListSubjectType,
      subgroupsCount: number | null,
      subjectType: string,
      zeroing: { lectures?: number; practical?: number; laboratory?: number; seminars?: number; exams?: number },
      currentSubject: ListSubjectType,
    ) => {
      const subjects = []

      if (subgroupsCount !== null) {
        for (let s = 0; s < subgroupsCount; s++) {
          subjects.push({
            ...el,
            ...zeroing,
            subgroupNumber: s + 1,
          })
          // @ts-ignore
          currentSubject[subjectType as keyof SubgroupsType] = 0
        }
      }

      return [...subjects]
    }

    // @ts-ignore
    setFinalSubjects(() => {
      // const newSubjects: ListSubjectType[] = []

      const subjectsList = subjects.map((el) => {
        const currentSubject = { ...el, subgroupNumber: null }

        if (subgroupsList.length > 0) {
          // Якщо хоч одна дисципліна поділена на підгрупи

          // Дисципліна, яка не ділиться на підгрупи
          let notFoundDiscipline: ListSubjectType

          const sbGroups = subgroupsList.map((s) => {
            if (el.name === s.name && el.semester === s.semester && el.groupId === s.groupId) {
              const newSubjects = []

              newSubjects.push(
                splitSubjects(
                  el,
                  s.lectures,
                  'lectures',
                  {
                    laboratory: 0,
                    practical: 0,
                    seminars: 0,
                    exams: 0,
                  },
                  currentSubject,
                ),
              )
              newSubjects.push(
                splitSubjects(
                  el,
                  s.practical,
                  'practical',
                  {
                    lectures: 0,
                    laboratory: 0,
                    seminars: 0,
                    exams: 0,
                  },
                  currentSubject,
                ),
              )
              newSubjects.push(
                splitSubjects(
                  el,
                  s.laboratory,
                  'laboratory',
                  {
                    lectures: 0,
                    practical: 0,
                    seminars: 0,
                    exams: 0,
                  },
                  currentSubject,
                ),
              )
              newSubjects.push(
                splitSubjects(
                  el,
                  s.seminars,
                  'seminars',
                  {
                    lectures: 0,
                    practical: 0,
                    laboratory: 0,
                    exams: 0,
                  },
                  currentSubject,
                ),
              )
              newSubjects.push(
                splitSubjects(
                  el,
                  s.exams,
                  'exams',
                  {
                    lectures: 0,
                    practical: 0,
                    laboratory: 0,
                    seminars: 0,
                  },
                  currentSubject,
                ),
              )

              if (
                currentSubject.lectures === 0 &&
                currentSubject.practical === 0 &&
                currentSubject.laboratory === 0 &&
                currentSubject.seminars === 0 &&
                currentSubject.exams === 0
              ) {
                return [...newSubjects]
              } else {
                return [...newSubjects, currentSubject]
              }
            } else {
              // Якщо дисципліна не ділиться на підгрупи
              // return { ...el, subgroupNumber: null };

              notFoundDiscipline = { ...el, subgroupNumber: null }
            }
          })

          let flatedSbGroups = sbGroups.filter((sbg) => sbg !== undefined).flat(2)

          if (
            flatedSbGroups.some(
              (some) =>
                some?.name === el.name &&
                some?.semester === el.semester &&
                some?.groupId === el.groupId &&
                some?.lectures === el.lectures &&
                some?.practical === el.practical &&
                some?.laboratory === el.laboratory &&
                some?.seminars === el.seminars &&
                some?.exams === el.exams,
            )
          ) {
          } else {
            // @ts-ignore
            if (notFoundDiscipline) {
              const condition =
                // @ts-ignore
                notFoundDiscipline.name ===
                  // @ts-ignore
                  currentSubject.name &&
                // @ts-ignore
                notFoundDiscipline?.semester ===
                  // @ts-ignore
                  currentSubject.semester &&
                // @ts-ignore
                notFoundDiscipline?.groupId ===
                  // @ts-ignore
                  currentSubject.groupId &&
                // @ts-ignore
                notFoundDiscipline?.subgroupNumber ===
                  // @ts-ignore
                  currentSubject.subgroupNumber &&
                // @ts-ignore
                notFoundDiscipline?.lectures ===
                  // @ts-ignore
                  currentSubject.lectures &&
                // @ts-ignore
                notFoundDiscipline?.practical ===
                  // @ts-ignore
                  currentSubject.practical &&
                // @ts-ignore
                notFoundDiscipline?.laboratory ===
                  // @ts-ignore
                  currentSubject.laboratory &&
                // @ts-ignore
                notFoundDiscipline?.seminars ===
                  // @ts-ignore
                  currentSubject.seminars &&
                // @ts-ignore
                notFoundDiscipline?.exams ===
                  // @ts-ignore
                  currentSubject.exams

              if (condition) {
                // @ts-ignore
                flatedSbGroups = [...flatedSbGroups, notFoundDiscipline]
              } else {
                flatedSbGroups = [...flatedSbGroups]
              }
            } else {
              flatedSbGroups = [...flatedSbGroups]
            }
          }

          return flatedSbGroups
        } else {
          // Якщо жодна дисципліна не поділена на підгрупи
          return { ...el, subgroupNumber: null }
        }
      })

      const flatedSubjectList = subjectsList.flat(2).filter((f) => f !== undefined)

      return [...flatedSubjectList /* ...newSubjects */]
    })

    // Додаю streamDetails
    setFinalSubjects((prev) => {
      const newSubjects = prev.map((el) => {
        const details = { lectures: false, practical: false, laboratory: false, seminars: false, exams: false }

        return { ...el, details }
      })

      return newSubjects
    })

    if (activeStream) {
      const details = activeStream.details

      setFinalSubjects((prev) => {
        return prev.map((el) => {
          /* const mergedItems = details.find(
            (d) =>
              d.name === el.name &&
              el.semester === d.semester &&
              Number(el.subgroupNumber) === Number(d.subgroupNumber),
          ) */

          // if (mergedItems && el.details) {
          //   if (mergedItems.type === 'lectures') {
          //     el.details.lectures = true
          //   }
          //   if (mergedItems.type === 'practical') {
          //     el.details.practical = true
          //   }
          //   if (mergedItems.type === 'laboratory') {
          //     el.details.laboratory = true
          //   }
          //   if (mergedItems.type === 'seminars') {
          //     el.details.seminars = true
          //   }
          //   if (mergedItems.type === 'exams') {
          //     console.log('1111111111111111111111')
          //     el.details.exams = true
          //   }
          // }
          const mergedItems = details.filter(
            (d) =>
              d.name === el.name &&
              el.semester === d.semester &&
              Number(el.subgroupNumber) === Number(d.subgroupNumber),
          )

          const subj = JSON.parse(JSON.stringify(el))

          if (mergedItems && subj.details !== undefined) {
            mergedItems.forEach((mi) => {
              if (mi.type === 'lectures') {
                subj.details.lectures = true
              }
              if (mi.type === 'practical') {
                subj.details.practical = true
              }
              if (mi.type === 'laboratory') {
                subj.details.laboratory = true
              }
              if (mi.type === 'seminars') {
                subj.details.seminars = true
              }
              if (mi.type === 'exams') {
                subj.details.exams = true
              }
            })
          }

          return subj
        })
      })
    }
  }, [subgroupsList, subjects])

  // Отримую всі дисципліни груп, що об'єднані в потік
  React.useEffect(() => {
    dispatch(clearStreamsLoad())

    if (activeStream) {
      activeStream.components.map((el) => {
        if (el.groupLoad._id) {
          dispatch(getGroupLoad(el.groupLoad._id))
        } else {
          const id = el.groupLoad as unknown as string

          dispatch(getGroupLoad(id))
        }
      })
    }
  }, [activeStream])

  React.useEffect(() => {
    if (activeStream) {
      const allItemsArray = streamsLoad.map((el) => el.load).flat(2)

      // @ts-ignore
      setSubjects(() => {
        const components = activeStream.components

        // const details = activeStream.details

        const subjectList = createListOfSubjects(allItemsArray)

        /* Додаю шифр групи до об'єкта */
        const res = subjectList.map((el) => {
          const groups = components.map((c) => {
            if (el.group === c.groupId) {
              return { ...el, group: c.name, groupId: c.groupId }
            }
          })

          return groups.filter((el) => el !== undefined)[0]
        })

        return res
      })
    }
  }, [streamsLoad])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ListSubjectType) => {
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

  const handleSelectSubjects = (subject: ListSubjectType) => {
    setSelectedSubjects((prev) => {
      const some = prev.some((el) => el._id === subject._id && el.group === subject.group)

      if (some) {
        const filtredSubjects = prev.filter((el) => el.group !== subject.group || el._id !== subject._id)

        return filtredSubjects
      } else {
        return [...prev, subject]
      }
    })
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - finalSubjects.length) : 0

  /*  */
  /*  */
  /*  */

  return (
    <>
      <StreamsModal
        openModal={openStreamsModal}
        setOpenModal={setOpenStreamsModal}
        selectedSubjects={selectedSubjects}
        activeStreamId={activeStream?._id}
        streamDetails={activeStream?.details}
        setActiveStream={setActiveStream}
      />

      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selectedSubjects.length}
            showMergedItems={showMergedItems}
            setOpenStreamsModal={setOpenStreamsModal}
          />
          <TableContainer>
            {finalSubjects.length > 0 ? (
              <>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'small'}>
                  <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                  <TableBody>
                    {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                    rows.slice().sort(getComparator(order, orderBy)) */}
                    {stableSort(filterMergedSubjects(finalSubjects), getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row: ListSubjectType, index) => {
                        const isItemSelected = selectedSubjects.some(
                          (el) =>
                            el._id === row._id && el.subgroupNumber === row.subgroupNumber && el.group === row.group,
                        )
                        const labelId = `enhanced-table-checkbox-${index}`

                        return (
                          <TableRow
                            hover
                            onClick={() => handleSelectSubjects(row)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={index}
                            selected={isItemSelected}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              className="streams__table-cell--name">
                              {row.name}
                            </TableCell>
                            <TableCell align="center" className="streams__table-cell">
                              {row.group}
                            </TableCell>
                            <TableCell align="center">{row.semester}</TableCell>

                            <TableCell align="center">
                              {row.lectures && row.details?.lectures
                                ? `Потік(${row.lectures})`
                                : `${row.lectures <= 0 ? 0 : row.lectures}`}
                              {`${row.lectures && row.subgroupNumber ? `(п.${row.subgroupNumber})` : ''}`}
                            </TableCell>

                            <TableCell align="center">
                              {row.practical && row.details?.practical
                                ? `Потік(${row.practical})`
                                : `${row.practical <= 0 ? 0 : row.practical}`}
                              {`${row.practical && row.subgroupNumber ? `(п.${row.subgroupNumber})` : ''}`}
                            </TableCell>

                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                              {row.laboratory && row.details?.laboratory
                                ? `Потік(${row.laboratory})`
                                : `${row.laboratory <= 0 ? 0 : row.laboratory}`}
                              {`${row.laboratory && row.subgroupNumber ? `(п.${row.subgroupNumber})` : ''}`}
                              {/* {row.details?.laboratory ? `Потік(${row.laboratory})` : `${row.laboratory}`} */}
                            </TableCell>

                            <TableCell align="center">
                              {row.seminars && row.details?.seminars
                                ? `Потік(${row.seminars})`
                                : `${row.seminars <= 0 ? 0 : row.seminars}`}
                              {`${row.seminars && row.subgroupNumber ? `(п.${row.subgroupNumber})` : ''}`}
                            </TableCell>

                            <TableCell align="center">
                              {row.exams && row.details?.exams
                                ? `Потік(${row.exams})`
                                : `${row.exams <= 0 ? 0 : row.exams}`}
                              {`${row.exams && row.subgroupNumber ? `(п.${row.subgroupNumber})` : ''}`}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 33 * emptyRows,
                        }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            ) : (
              <div className="streams__table--empty">
                <img src={reactLogo} />
              </div>
            )}
          </TableContainer>

          <div className="streams__table-bottom">
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={finalSubjects.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </Paper>
      </Box>
    </>
  )
}

export default StreamsSubjectTable
