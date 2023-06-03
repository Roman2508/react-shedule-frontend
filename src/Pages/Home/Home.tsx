import React from 'react'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import { useSelector } from 'react-redux'
import Skeleton from '@mui/material/Skeleton'
import AddIcon from '@mui/icons-material/AddRounded'
import ResizeIcon from '@mui/icons-material/CropRounded'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import ListItemButton from '@mui/material/ListItemButton'
import EditIcon from '@mui/icons-material/ModeEditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlineRounded'
import EmptyGroupsIcon from '@mui/icons-material/ContentPasteSearchOutlined'
import { Divider, Grid, IconButton, Paper, Typography } from '@mui/material'

import './Home.scss'
import { StyledButton } from '../../theme'
import { useAppDispatch } from '../../redux/store'
import { selectAlerts } from '../../redux/appSelectors'
import AlertMessage from '../../component/AlertMessage'
import GroupInfo from '../../component/GroupInfo/GroupInfo'
import { AppLoadingStatusTypes } from '../../redux/appTypes'
import { getGroups } from '../../redux/group/groupAsyncAction'
import { selectGroups } from '../../redux/group/groupSelector'
import AddMainItemModal from '../../component/AddMainItemModal'
import createAlertMessage from '../../utils/createAlertMessage'
import CircularPreloader from '../../component/CircularPreloader'
import { createAlert, setShowError } from '../../redux/alerts/alertsSlise'
import { selectFaculties } from '../../redux/faculties/facultiesSelectors'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'
import { FacultyType, SpecialtyType } from '../../redux/faculties/facultiesTypes'
import StructuralUnitsGroup from '../../component/StructuralUnitsGroup/StructuralUnitsGroup'
import { getAllFaculties, removeFaculty, removeSpecialty } from '../../redux/faculties/facultiesAsyncAction'

export type ModalDataType = {
  type: string
  data?: { name: string; shortName: string }
  facultieId?: string
  id?: string
}

type GridSizeTypes = {
  main: number
  speciality: number
  groups: number
}

const Home = () => {
  const dispatch = useAppDispatch()

  const { faculties, loadingStatus } = useSelector(selectFaculties)
  const { fullTimeGroups, partTimeGroups } = useSelector(selectGroups)
  const { institution } = useSelector(selectAuthData)
  const alertInfo = useSelector(selectAlerts)

  const [activeMainItem, setActiveMainItem] = React.useState<FacultyType>()
  const [activeSpecialtyItem, setActiveSpecialtyItem] = React.useState<SpecialtyType>()

  const [selectedPlanName, setSelectedPlanName] = React.useState('')
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(null)

  const [isNewGroup, setIsNewGroup] = React.useState(false)

  const [gridSize, setGridSize] = React.useState<GridSizeTypes>({
    main: 2.5,
    speciality: 3,
    groups: 6.5,
  })

  const [openAddItemModal, setOpenAddItemModal] = React.useState(false)
  const [modalData, setModalData] = React.useState<ModalDataType>()

  const [openGroupInfo, setOpenGroupInfo] = React.useState(false)

  React.useEffect(() => {
    if (institution) {
      const fetchData = async () => {
        try {
          const { payload } = await dispatch(getAllFaculties(institution._id))
          createAlertMessage(dispatch, payload, '', 'Помилка при завантаженні :(')
          setActiveMainItem(payload[0])
          setActiveSpecialtyItem(payload[0].specialties[0])
        } catch (error) {
          console.log(error)
        }
      }
      fetchData()
    }
  }, [institution])

  React.useEffect(() => {
    if (activeSpecialtyItem) {
      dispatch(getGroups(activeSpecialtyItem._id))
    }
  }, [activeSpecialtyItem])

  const handleClickOpen = (type: string) => {
    setOpenAddItemModal(true)
    setModalData({ type })
    if (type === 'specialty' && activeMainItem) {
      setModalData({ type, facultieId: activeMainItem._id })
    }
  }

  const handleMaitItemClick = (faculty: FacultyType) => {
    setActiveMainItem(faculty)
  }

  const handleGridSize = (type: string) => {
    setGridSize((prev: GridSizeTypes) => {
      if (prev.main === 2.5 && type === 'main') {
        return { main: 1, speciality: prev.speciality, groups: prev.groups + 1.5 }
      }
      if (prev.main === 1 && type === 'main') {
        return { main: 2.5, speciality: prev.speciality, groups: prev.groups - 1.5 }
      }
      if (prev.speciality === 3 && type === 'specialty') {
        return { main: prev.main, speciality: 1, groups: prev.groups + 2 }
      }
      if (prev.speciality === 1 && type === 'specialty') {
        return { main: prev.main, speciality: 3, groups: prev.groups - 2 }
      }
      return { main: 2.5, speciality: 3, groups: 6.5 }
    })
  }

  const removeMaitItem = async (faculty: FacultyType) => {
    if (window.confirm('Ви дійсно хочете видалити факульете?')) {
      if (faculty.specialties.length > 0) {
        alert('В факультеті не повинно бути спеціальностей')
      } else {
        const { payload } = await dispatch(removeFaculty(faculty._id))
        createAlertMessage(dispatch, payload, 'Факультет видалено', 'Помилка при видаленні факультету :(')
      }
    }
  }

  const onRemoveSpecialty = async (facultieId: string, id: string) => {
    if (window.confirm('Ви дійсно хочете видалити спеціальність?')) {
      const currentSpecialty = activeMainItem?.specialties?.find((el) => el._id === id)
      if (currentSpecialty && currentSpecialty.groups.length > 0) {
        // alert('Спочатку видаліть всі групи')
        createAlertMessage(dispatch, false, '', 'Спочатку видаліть всі групи')
      } else {
        try {
          const { payload } = await dispatch(removeSpecialty({ facultieId, id }))
          createAlertMessage(dispatch, payload, 'Cпеціальність видалено', 'Помилка при видаленні спеціальності :(')

          if (payload) {
            // @ts-ignore
            setActiveMainItem((prev) => {
              const specialties = prev?.specialties.filter((el) => el._id !== payload.id)
              return { ...prev, specialties }
            })
          }
        } catch (error) {
          alert(error)
        }
      }
    }
  }

  const updateMainItem = (type: string, faculty: FacultyType) => {
    setOpenAddItemModal(true)
    setModalData({ type, data: { name: faculty.name, shortName: faculty.shortName }, facultieId: faculty._id })
  }

  const updateSpecialty = (type: string, specialty: SpecialtyType) => {
    setOpenAddItemModal(true)
    setModalData({
      type,
      data: { name: specialty.name, shortName: specialty.shortName },
      facultieId: specialty.facultieId,
      id: specialty._id,
    })
  }

  if ((loadingStatus !== AppLoadingStatusTypes.SUCCESS && !activeMainItem) || !institution) {
    return <CircularPreloader />
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

      <AddMainItemModal
        open={openAddItemModal}
        setOpen={setOpenAddItemModal}
        modalData={modalData}
        setActiveMainItem={setActiveMainItem}
        setActiveSpecialtyItem={setActiveSpecialtyItem}
      />

      <GroupInfo
        open={openGroupInfo}
        setOpen={setOpenGroupInfo}
        specialtyId={activeSpecialtyItem?._id}
        selectedPlanName={selectedPlanName}
        setSelectedPlanName={setSelectedPlanName}
        setSelectedGroupId={setSelectedGroupId}
        selectedGroupId={selectedGroupId}
        institutionId={institution._id}
        isNewGroup={isNewGroup}
      />

      <Grid className="structural-units" container spacing={2}>
        <Grid item xs={gridSize.main} sx={{ paddingLeft: '0 !important' }} className="structural-units__main">
          <IconButton className="structural-units__resize-icon" onClick={() => handleGridSize('main')}>
            <ResizeIcon />
          </IconButton>
          <Paper>
            <List component="nav" className="structural-units__list">
              {faculties.map((item) => (
                <ListItemButton
                  key={item._id}
                  selected={activeMainItem?._id === item._id}
                  onClick={() => handleMaitItemClick(item)}
                  className="structural-units__item"
                  sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography noWrap={true} variant="subtitle1">
                    {gridSize.main !== 1 ? item.name : item.shortName}
                  </Typography>

                  <div className="structural-units__buttons">
                    <IconButton
                      sx={{ minWidth: 'auto', padding: '5px', marginRight: '5px' }}
                      onClick={() => updateMainItem('updateMainItem', item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton sx={{ minWidth: 'auto', padding: '5px' }} onClick={() => removeMaitItem(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </ListItemButton>
              ))}
            </List>

            <StyledButton onClick={() => handleClickOpen('faculty')} className="structural-units__add-button" fullWidth>
              <span>Додати</span>
              <AddIcon sx={{ width: 18, height: 18, marginTop: '-2px' }} />
            </StyledButton>
          </Paper>
        </Grid>

        <Grid item xs={gridSize.speciality} className="structural-units__specialty">
          <IconButton className="structural-units__resize-icon resize-icon" onClick={() => handleGridSize('specialty')}>
            <ResizeIcon />
          </IconButton>
          <Paper>
            <Typography className="structural-units__specialty-title" noWrap={true} variant="subtitle1">
              {gridSize.speciality !== 1 ? activeMainItem?.name : activeMainItem?.shortName}
            </Typography>

            <List component="nav" className="structural-units__list">
              {activeMainItem ? (
                activeMainItem.specialties.map((el) => (
                  <ListItemButton
                    key={el._id}
                    className="structural-units__item"
                    selected={activeSpecialtyItem && activeSpecialtyItem._id === el._id}
                    onClick={() => setActiveSpecialtyItem(el)}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography noWrap={true} variant="subtitle1">
                      {gridSize.speciality !== 1 ? el.name : el.shortName}
                    </Typography>
                    <div className="structural-units__specialty-buttons">
                      <IconButton
                        sx={{ minWidth: 'auto', padding: '5px', marginRight: '5px' }}
                        onClick={() => updateSpecialty('updateSpecialty', el)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        sx={{ minWidth: 'auto', padding: '5px' }}
                        onClick={() => onRemoveSpecialty(activeMainItem._id, el._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </ListItemButton>
                ))
              ) : (
                <div
                  style={{
                    paddingTop: '10px',
                    textAlign: 'center',
                    height: '60px',
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  }}>
                  <EmptyGroupsIcon style={{ opacity: '0.6' }} />
                </div>
              )}
            </List>

            <StyledButton
              onClick={() => handleClickOpen('specialty')}
              disabled={!activeMainItem || !faculties.length}
              className="structural-units-add-button"
              fullWidth>
              <span>Додати</span>
              <AddIcon sx={{ width: 18, height: 18, marginTop: '-1px' }} />
            </StyledButton>
          </Paper>
        </Grid>

        <Grid item xs={gridSize.groups}>
          <Paper className="structural-units__groups">
            <Typography className="structural-units__specialty-title" noWrap={true} variant="subtitle1">
              {activeSpecialtyItem ? (
                activeSpecialtyItem?.name
              ) : (
                <Skeleton variant="rounded" width={'100%'} sx={{ margin: '0 auto' }} height={28} />
              )}
            </Typography>

            <Divider>Денна форма</Divider>
            <StructuralUnitsGroup
              setIsNewGroup={setIsNewGroup}
              loadingStatus={loadingStatus}
              setOpenGroupInfo={setOpenGroupInfo}
              groupsList={fullTimeGroups}
              setSelectedGroupId={setSelectedGroupId}
              setSelectedPlanName={setSelectedPlanName}
            />
            <Divider>Заочна форма</Divider>
            <StructuralUnitsGroup
              setIsNewGroup={setIsNewGroup}
              loadingStatus={loadingStatus}
              setOpenGroupInfo={setOpenGroupInfo}
              groupsList={partTimeGroups}
              setSelectedGroupId={setSelectedGroupId}
              setSelectedPlanName={setSelectedPlanName}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default Home
