import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ListItemButton from '@mui/material/ListItemButton'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditIcon from '@mui/icons-material/ModeEditOutlined'
import { StyledAccordioDetailsWithoutPaddings } from '../../theme'
import Divider from '@mui/material/Divider'
import { DepartmentType, TeacherType } from '../../redux/teachersAndDepartment/teachersAndDepartmentTypes'
import { Skeleton, Stack } from '@mui/material'
import { useAppDispatch } from '../../redux/store'
import { removeTeacherById } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
import EditTeacherModal from './EditTeacherModal'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { useSelector } from 'react-redux'

type TheachersListPropsType = {
  departments?: DepartmentType[] | null // departments is required
  selectedTeacher?: TeacherType | null
  setSelectedTeacher?: (value: TeacherType) => void
}
// departments is required

const TheachersList: React.FC<TheachersListPropsType> = ({ departments, selectedTeacher, setSelectedTeacher }) => {
  const dispatch = useAppDispatch()

  const { institution } = useSelector(selectAuthData)

  const [isTeacherModalOpen, setTeacherModalOpen] = React.useState(false)

  const [mainExpanded, setMainExpanded] = React.useState<string | false>(false)
  const [itemExpanded, setItemExpanded] = React.useState<string | false>(false)

  const [currentTeacher, setCurrentTeacher] = React.useState<TeacherType>()

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setMainExpanded(isExpanded ? panel : false)
  }
  const handleItemChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setItemExpanded(isExpanded ? panel : false)
  }

  const onRemoveTeacher = (departmentId: number, id: string) => {
    if (window.confirm('Ви дійсно хочете видалити викладача?')) {
      dispatch(removeTeacherById({ departmentId, id }))
    }
  } // ?????????????????????????????????????????/

  const onChangeCurrentTeacher = (teacher: TeacherType) => {
    setCurrentTeacher(teacher)
    setTeacherModalOpen(true)
  }

  if (departments === null || departments === undefined || !institution) {
    return (
      <Stack spacing={1} sx={{ padding: '16px 0' }}>
        <Skeleton variant="rounded" width={'100%'} height={48} />
        <Skeleton variant="rounded" width={'100%'} height={48} />
        <Skeleton variant="rounded" width={'100%'} height={48} />
      </Stack>
    )
  }

  // DistributedLoad
  const onSelectTeacher = (teacher: TeacherType) => {
    if (setSelectedTeacher) {
      setSelectedTeacher(teacher)
    }
  }

  return (
    <>
      <EditTeacherModal
        departments={departments}
        open={isTeacherModalOpen}
        setOpen={setTeacherModalOpen}
        currentTeacher={currentTeacher}
        institutionId={institution._id}
      />

      <div>
        {departments.map((dep: DepartmentType) => (
          <Accordion
            key={dep._id}
            expanded={mainExpanded === `panel${dep._id}`}
            onChange={handleChange(`panel${dep._id}`)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
              <Typography /* sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '295px' }} */
              >
                {`${dep.departmentNumber}. ${dep.name}`}
              </Typography>
            </AccordionSummary>
            <StyledAccordioDetailsWithoutPaddings>
              {dep.teachers.map((item: any) => {
                return (
                  <React.Fragment key={item._id}>
                    <Divider />
                    <ListItemButton
                      selected={selectedTeacher?._id === item._id}
                      onClick={() => onSelectTeacher(item)}
                      className="structural-units-item"
                      sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography noWrap={true} variant="subtitle1">
                        {`${item.lastName} ${item.firstName} ${item.middleName}`}
                      </Typography>
                      <div style={{ whiteSpace: 'nowrap' }}>
                        <IconButton
                          sx={{ padding: '5px', marginRight: '5px' }}
                          onClick={() => onChangeCurrentTeacher(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton sx={{ padding: '5px' }} onClick={() => onRemoveTeacher(dep._id, item._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </ListItemButton>
                  </React.Fragment>
                )
              })}
            </StyledAccordioDetailsWithoutPaddings>
          </Accordion>
        ))}
      </div>
    </>
  )
}

export default TheachersList
// {departments !== null && departments !== undefined && departments?.length > 0 ? (

// ) : (
//   <Stack spacing={1} sx={{ padding: '16px 0' }}>
//     <Skeleton variant="rounded" width={'100%'} height={48} />
//     <Skeleton variant="rounded" width={'100%'} height={48} />
//     <Skeleton variant="rounded" width={'100%'} height={48} />
//   </Stack>
// )}
