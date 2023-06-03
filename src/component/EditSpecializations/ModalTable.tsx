import * as React from 'react'
import './EditSpecializations.scss'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/AddRounded'
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditIcon from '@mui/icons-material/ModeEditOutlined'
import { Button, IconButton, TextField } from '@mui/material'
import { useAppDispatch } from '../../redux/store'
import {
  createGroupSpecialization,
  removeGroupSpecialization,
  updateGroupSpecialization,
} from '../../redux/group/groupAsyncAction'
import { SpecializationListType } from '../../redux/group/groupTypes'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'

interface HeadCell {
  disablePadding: boolean
  id: keyof SpecializationListType
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: '_id',
    numeric: true,
    disablePadding: true,
    label: '№',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Назва спеціалізованої підгрупи',
  },
]

type ModalTablePropsType = {
  groupId: string
  specializationList: SpecializationListType[]
}

const ModalTable: React.FC<ModalTablePropsType> = ({ groupId, specializationList }) => {
  const dispatch = useAppDispatch()

  const inputRef = React.useRef<null | HTMLInputElement>(null)

  const [text, setText] = React.useState('')
  const [buttonType, setButtonType] = React.useState('add')
  const [updatingItemId, setUpdatingItemId] = React.useState('')

  const onAddSpecialization = () => {
    if (text.length > 0) {
      dispatch(createGroupSpecialization({ groupId, name: text }))
      setText('')
      setButtonType('add')
    }
  }

  const onRemoveSpecialization = (_id: string) => {
    if (window.confirm('Ви дійсно хочете видалити спеціалізацію?')) {
      dispatch(removeGroupSpecialization({ groupId, _id }))
    }
  }

  const onUpdateSpecialization = () => {
    if (window.confirm('Ви дійсно хочете оновити спеціалізацію?')) {
      const payload = { _id: updatingItemId, groupId, name: text }
      dispatch(updateGroupSpecialization(payload))
      setText('')
    }
  }

  const onClickUpdateButton = (itemText: string, id: string) => {
    setButtonType('update')
    setText(itemText)
    setUpdatingItemId(id)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table aria-labelledby="tableTitle" size={'small'}>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'center' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}>
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {specializationList.map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id} className="edit-specializations__row">
                  <TableCell align="center" sx={{ height: '40px' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="left" sx={{ height: '40px' }}>
                    {row.name}
                  </TableCell>
                  <td className="edit-specializations__actions">
                    <IconButton
                      sx={{ minWidth: 'auto', padding: '5px', marginRight: '5px' }}
                      onClick={() => onClickUpdateButton(row.name, row._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ minWidth: 'auto', padding: '5px' }}
                      onClick={() => onRemoveSpecialization(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div className="edit-specializations__add-item">
        <Button
          variant="contained"
          className="edit-specializations__add-button"
          onClick={buttonType === 'add' ? onAddSpecialization : onUpdateSpecialization}
          disabled={text.length === 0}>
          <span>{buttonType === 'add' ? 'Додати' : 'Оновити'}</span>
          {buttonType === 'add' && <AddIcon sx={{ width: 16, height: 16 }} />}
        </Button>

        <TextField
          variant="outlined"
          inputRef={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Назва підгрупи"
          className="edit-specializations__add-input"
        />
      </div>
    </Box>
  )
}

export default ModalTable
