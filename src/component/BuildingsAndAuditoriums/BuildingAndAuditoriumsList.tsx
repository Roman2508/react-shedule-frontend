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
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import { useAppDispatch } from '../../redux/store'
import { AuditoriumsType, BuildingsType } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsTypes'
import { removeAuditory } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsAsyncAction'
import { useForm } from 'react-hook-form'
import EditAuditoryModal from './EditAuditoryModal'
import { useSelector } from 'react-redux'
import { selectBuildings } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsSelector'
import { AppLoadingStatusTypes } from '../../redux/appTypes'

type BuildingAndAuditoriumsListPropsType = {
  buildings: BuildingsType[]
  institutionId: string
}
// buildings is required

const BuildingAndAuditoriumsList: React.FC<BuildingAndAuditoriumsListPropsType> = ({ buildings, institutionId }) => {
  const dispatch = useAppDispatch()

  const { loadingStatus } = useSelector(selectBuildings)

  const [mainExpanded, setMainExpanded] = React.useState<string | false>(false)
  const [modalVisible, setModalVisible] = React.useState(false)
  const [editedAuditory, setEditedAuditory] = React.useState<AuditoriumsType>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setMainExpanded(isExpanded ? panel : false)
  }

  const onRemoveAuditory = (buildingId: number, id: number) => {
    if (window.confirm('Ви дійсно хочете видалити аудиторію?')) {
      dispatch(removeAuditory({ buildingId, id }))
    }
  }

  const editModeHandler = (item: AuditoriumsType) => {
    setEditedAuditory(item)
    setModalVisible(!modalVisible)
  }

  return (
    <>
      <EditAuditoryModal
        open={modalVisible}
        setOpen={setModalVisible}
        buildings={buildings}
        editedAuditory={editedAuditory}
        institutionId={institutionId}
      />

      <div>
        {loadingStatus === AppLoadingStatusTypes.LOADING ? (
          <Stack spacing={1} sx={{ padding: '16px 0' }}>
            <Skeleton variant="rounded" width={'100%'} height={48} />
            <Skeleton variant="rounded" width={'100%'} height={48} />
            <Skeleton variant="rounded" width={'100%'} height={48} />
          </Stack>
        ) : (
          buildings?.map((el: BuildingsType) => (
            <Accordion
              expanded={mainExpanded === `panel${el._id}`}
              onChange={handleChange(`panel${el._id}`)}
              key={el._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography /* sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '295px' }} */
                >
                  {`Корпус: ${el.name}`}
                </Typography>
              </AccordionSummary>
              <StyledAccordioDetailsWithoutPaddings>
                {el.auditoriums.map((item: any) => (
                  <React.Fragment key={item._id}>
                    <Divider />
                    <ListItemButton
                      className="structural-units-item"
                      sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography noWrap={true} variant="subtitle1">
                        {`${item.name}`}
                      </Typography>

                      <div>
                        <IconButton
                          sx={{ minWidth: 'auto', padding: '5px', marginRight: '5px' }}
                          onClick={() => editModeHandler(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          sx={{ minWidth: 'auto', padding: '5px' }}
                          onClick={() => onRemoveAuditory(el._id, item._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </ListItemButton>
                  </React.Fragment>
                ))}
              </StyledAccordioDetailsWithoutPaddings>
            </Accordion>
          ))
        )}
      </div>
    </>
  )
}

export default BuildingAndAuditoriumsList
