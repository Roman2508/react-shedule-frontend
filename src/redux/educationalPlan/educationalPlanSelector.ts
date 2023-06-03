import { RootStateType } from '../store'

export const selectEducationalPlans = (state: RootStateType) => state.educationalPlans

export const selectEducationalPlan = (state: RootStateType) => state.educationalPlans.selectedPlan
