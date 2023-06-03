import React from 'react'
import './BuildingsAndAuditoriums.scss'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'
import AddBuildingsForm from '../../component/BuildingsAndAuditoriums/AddBuildingsForm'
import AddAuditoriumsForm from '../../component/BuildingsAndAuditoriums/AddAuditoriumsForm'
import BuildingAndAuditoriumsList from '../../component/BuildingsAndAuditoriums/BuildingAndAuditoriumsList'
import { getAllBuildings } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsAsyncAction'
import { selectBuildings } from '../../redux/buildingsAndAuditoriums/buildingsAndAuditoriumsSelector'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import { selectAuthData } from '../../redux/accountInfo/accountInfoSelector'

const TeachersAndDepartments = () => {
  const dispatch = useAppDispatch()

  const { buildings } = useSelector(selectBuildings)
  const { institution } = useSelector(selectAuthData)

  React.useEffect(() => {
    if (institution) {
      dispatch(getAllBuildings(institution._id))
    }
  }, [institution])

  if (/* !buildings.length || */ !institution) {
    return (
      <Box className="building-and-auditorium-preloader">
        <CircularProgress size={45} />
        {/* <LinearProgress /> */}
      </Box>
    )
  }

  return (
    <Grid container spacing={2} className="teachers-and-departments">
      <Grid item xs={6}>
        <Paper sx={{ mb: '16px' }} className="teachers-and-departments__box">
          <Typography className="teachers-and-departments__title" align="center">
            Додати аудиторію
          </Typography>

          <AddAuditoriumsForm buildings={buildings} institutionId={institution?._id} />
        </Paper>

        <Paper className="teachers-and-departments__box">
          <Typography className="teachers-and-departments__title" align="center">
            Додати корпус
          </Typography>

          <AddBuildingsForm institutionId={institution?._id} />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Typography className="teachers-and-departments__title" align="center" sx={{ mb: '16px' }}>
            Аудиторії
          </Typography>
        </Paper>

        <BuildingAndAuditoriumsList buildings={buildings} institutionId={institution?._id} />
      </Grid>
    </Grid>
  )
}

export default TeachersAndDepartments
