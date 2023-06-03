import React from 'react'
import './EducationalPlans.scss'
import SearchIcon from '@mui/icons-material/SearchOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/ModeEditOutlined'
import { Link } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { StyledAccordionDetails, StyledButton } from '../../theme'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import AddEducationalPlanModal from './AddEducationalPlanModal'
import { useAppDispatch } from '../../redux/store'
import {
  fetchEducationalPlans,
  removeEducationPlan,
  removeEducationPlanGroup,
} from '../../redux/educationalPlan/educationalPlanAsyncAction'
import { useSelector } from 'react-redux'
import { selectEducationalPlans } from '../../redux/educationalPlan/educationalPlanSelector'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { AppLoadingStatusTypes } from '../../redux/appTypes'
import { EducationalPlanGroupsType, EducationalPlanType } from '../../redux/educationalPlan/educationalPlanTypes'
import RemoveIcon from '@mui/icons-material/DeleteOutlined'
import PlanIcon from '@mui/icons-material/StickyNote2Outlined'
import ArrowIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import CircularPreloader from '../../component/CircularPreloader'
import emptyEdPlansImg from '../../assets/empty-ed-plans.png'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'

const style = {
  width: '100%',
  bgcolor: 'background.paper',
}

const EducationalPlans = () => {
  const dispatch = useAppDispatch()
  const { plans, loadingStatus } = useSelector(selectEducationalPlans)
  const { institution } = useSelector(selectAuthData)

  const [openEducationalPlanModal, setEducationalPlanModal] = React.useState(false)
  const [modalRole, setModalRole] = React.useState('plan')
  const [activeCategoryId, setActiveCategoryId] = React.useState('')
  const [activeId, setActiveId] = React.useState('')
  const [activeUnitName, setActiveUnitName] = React.useState('')

  // ID відкритої групи планів
  const [openPlan, setOpenPlan] = React.useState(0)

  const onOpenModal = (role: string, categoryId: string = '') => {
    setEducationalPlanModal(true)
    setModalRole(role)
    setActiveCategoryId(categoryId)
  }

  const onRemoveEducationalPlan = (planId: number, id: number) => {
    if (window.confirm('Ви дійсно хочете видалити навчальний план?')) {
      const findedPlanGroup = plans?.find((el) => el._id === planId)
      if (findedPlanGroup) {
        const findedPlan = findedPlanGroup.plans.find((el) => el._id === id)
        if (findedPlan && !findedPlan.subjects.length) {
          dispatch(removeEducationPlan(id))
        } else {
          alert('В навчальному плані не повинно бути дисциплін')
        }
      }
    }
  }

  const onChangeEducationPlanName = (role: string, id: string, categoryId: string = '', name: string = '') => {
    setEducationalPlanModal(true)
    setModalRole(role)
    setActiveCategoryId(categoryId)
    setActiveUnitName(name)
    setActiveId(id)
  }

  const onRemoveEducationalPlanGroup = (id: number, plans: EducationalPlanType[]) => {
    if (window.confirm('Ви дійсно хочете видалити структурний підрозділ?')) {
      if (plans.length === 0) {
        dispatch(removeEducationPlanGroup(id))
      } else {
        alert('Для видалення структурного підрозділу він не повинен містити навчальних планів')
      }
    }
  }

  const onChangeEducationPlanGroupName = (role: string, id: string, name: string = '') => {
    setEducationalPlanModal(true)
    setActiveUnitName(name)
    setModalRole(role)
    setActiveId(id)
  }

  React.useEffect(() => {
    if (institution) {
      dispatch(fetchEducationalPlans(institution._id))
    }
  }, [institution])

  const handleOpenPlan = (id: number) => {
    setOpenPlan((prev) => {
      if (prev === id) {
        return 0
      } else {
        return id
      }
    })
  }

  if (plans === null) {
    return <CircularPreloader />
  }

  return (
    <>
      <AddEducationalPlanModal
        openEducationalPlanModal={openEducationalPlanModal}
        setEducationalPlanModal={setEducationalPlanModal}
        modalRole={modalRole}
        activeCategoryId={activeCategoryId}
        activeUnitName={activeUnitName}
        activeId={activeId}
        // plansRender={plansRender}
      />

      <div className="educational-plans">
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Навчальні плани</h1>
        <div className={plans.length ? 'educational-plans__list' : ''}>
          {plans.length ? (
            plans.map((item: EducationalPlanGroupsType) => (
              <Paper className="educational-plans__list-item" key={item._id}>
                <div className="educational-plans__item-top">
                  <PlanIcon />
                  <h4 className="educational-plans__item-top-title">{item.name}</h4>
                  <IconButton onClick={() => handleOpenPlan(item._id)} style={{ marginLeft: '5px' }}>
                    <ArrowIcon style={openPlan === item._id ? { transform: 'rotate(180deg' } : {}} />
                  </IconButton>
                </div>
                <div className="educational-plans__item-top-controls">
                  <span onClick={() => onChangeEducationPlanGroupName('change-unit-name', String(item._id), item.name)}>
                    Оновити
                  </span>
                  <span onClick={() => onRemoveEducationalPlanGroup(item._id, item.plans)}>Видалити</span>
                  <span onClick={() => onOpenModal('plan', String(item._id))}>Додати</span>
                </div>

                <List
                  sx={style}
                  component="nav"
                  style={
                    openPlan === item._id
                      ? {
                          position: 'relative',
                          top: 0,
                          display: 'block',
                          borderTop: '1px solid rgba(66, 66, 66, 0.2)',
                        }
                      : { position: 'absolute', top: 0, display: 'none' }
                  }>
                  {item.plans.map((el) => (
                    <ListItem button key={el._id} className="educational-plans__plan-item">
                      <Link to={`/educational-plans/${el._id}`} className="educational-plans__title">
                        <ListItemText primary={el.name} />
                      </Link>

                      <div className="educational-plans__actions-overlay">
                        <IconButton
                          className="educational-plans__action-icon"
                          sx={{ marginRight: '10px' }}
                          onClick={() =>
                            onChangeEducationPlanName('ed-plan-name', String(el._id), String(el.categoryId), el.name)
                          }>
                          <EditIcon sx={{ opacity: '.7' }} />
                        </IconButton>
                        <IconButton
                          className="educational-plans__action-icon"
                          onClick={() => onRemoveEducationalPlan(item._id, el._id)}>
                          <DeleteIcon sx={{ opacity: '.7' }} />
                        </IconButton>
                      </div>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))
          ) : (
            <div>
              <div className="educational-plans__empty">
                <img className="educational-plan__empty-img" src={emptyEdPlansImg} alt="empty-ed-plans" />
                <p className="educational-plan__empty-text">Створіть новий навчальний план!</p>
              </div>
            </div>
          )}
        </div>
        <div className="educational-plans__add-plan-button">
          <Button variant="outlined" onClick={() => onOpenModal('unit')}>
            Додати новий структурний підрозділ +
          </Button>
        </div>
      </div>
    </>
  )
}

export default EducationalPlans
