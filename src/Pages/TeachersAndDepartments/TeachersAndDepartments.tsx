import React from 'react'
import './TeachersAndDepartments.scss'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TeachersList from '../../component/TeachersList/TeachersList'
import { useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'
import { selectTeachersAndDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentSelector'
import { getAllDepartments } from '../../redux/teachersAndDepartment/teachersAndDepartmentAsyncAction'
// import AddDepartmentForm from './AddDepartmentForm'
import AddTeacherFrom from '../../component/TeacherAndDepartmentsModals/AddTeacherFrom'
import AddDepartmentForm from '../../component/TeacherAndDepartmentsModals/AddDepartmentForm'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'

const TeachersAndDepartments = () => {
  const dispatch = useAppDispatch()

  const { departments, loadingStatus } = useSelector(selectTeachersAndDepartments)
  const { institution } = useSelector(selectAuthData)

  React.useEffect(() => {
    if (institution) {
      dispatch(getAllDepartments(institution._id))
    }
  }, [institution])

  if (departments === null || !institution) {
    return (
      <Box className="building-and-auditorium-preloader">
        <CircularProgress size={45} />
      </Box>
    )
  }

  return (
    <Grid container spacing={2} className="teachers-and-departments">
      <Grid item xs={6}>
        <Paper sx={{ mb: '16px' }} className="teachers-and-departments__box">
          <Typography className="teachers-and-departments__title" align="center">
            Додати нового викладача
          </Typography>

          <AddTeacherFrom departments={departments} institutionId={institution._id} />
        </Paper>

        <Paper className="teachers-and-departments__box">
          <Typography className="teachers-and-departments__title" align="center">
            Додати кафедру
          </Typography>

          <AddDepartmentForm departments={departments} institutionId={institution._id} />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Typography sx={{ marginBottom: '16px' }} className="teachers-and-departments__title" align="center">
            Викладачі
          </Typography>
        </Paper>

        <TeachersList departments={departments} />
      </Grid>
    </Grid>
  )
}

export default TeachersAndDepartments
