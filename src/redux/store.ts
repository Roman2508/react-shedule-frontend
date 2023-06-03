import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import educationalPlansSlice from './educationalPlan/educationalPlanSlice'
// import finalLoadSlice from './finalLoad/finalLoadSlice'
import lessonsSlice from './lessons/lessonsSlice'
import teachersAndDepartmentsSlice from './teachersAndDepartment/teachersAndDepartmentSlise'
import buildigsSlice from './buildingsAndAuditoriums/buildingsAndAuditoriumsSlice'
import facultiesSlist from './faculties/facultiesSlise'
import groupSlise from './group/groupSlise'
import streamsSlise from './streams/streamsSlise'
import distributedLoadSlise from './distributedLoad/distributedLoadSlise'
import alertsSlise from './alerts/alertsSlise'
import accountInfoSlice from './accountInfo/accountInfoSlice'

export const store = configureStore({
  reducer: {
    educationalPlans: educationalPlansSlice,
    teachersAndDepartments: teachersAndDepartmentsSlice,
    lessons: lessonsSlice,
    // finalLoad: finalLoadSlice,
    buildings: buildigsSlice,
    faculties: facultiesSlist,
    groups: groupSlise,
    streams: streamsSlise,
    distributedLoad: distributedLoadSlise,
    accountInfo: accountInfoSlice,
    alertsInfo: alertsSlise,
  },
})

export type RootStateType = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
