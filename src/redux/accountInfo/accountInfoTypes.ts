export type InstitutionDataType = {
  _id: string
  name: string
  email: string
  members: string[]
  settings: InstitutionSettingsType
}

export type InstitutionSettingsType = {
  _id: string
  institutionId: string
  callSchedule: {
    1: CallScheduleAndTermsOfStudyType
    2: CallScheduleAndTermsOfStudyType
    3: CallScheduleAndTermsOfStudyType
    4: CallScheduleAndTermsOfStudyType
    5: CallScheduleAndTermsOfStudyType
    6: CallScheduleAndTermsOfStudyType
    7: CallScheduleAndTermsOfStudyType
  }
  termsOfStudy: TermsOfStudyType
  currentShowedYear: string
}

export type TermsOfStudyType = {
  currentYear: CallScheduleAndTermsOfStudyType
  firstSemester: CallScheduleAndTermsOfStudyType
  secondSemester: CallScheduleAndTermsOfStudyType
}

export type CallScheduleAndTermsOfStudyType = {
  _id?: string
  start: number
  end: number
}

/* User */
export type UserDataType = {
  _id: string
  institutionId: string
  name: string
  email: string
  access: string
  settings: UserSettingsType
}

export type UserSettingsType = {
  _id: string
  institutionId: string
  userId: string
  colors: {
    lectures: string
    practical: string
    laboratory: string
    seminars: string
    exams: string
  }
  colorMode: string
  selectedSemester: string
}

export type LoginDataType = {
  email: string
  password: string
}

export type RegisterDataType = {
  name: string
  email: string
  password: string
}
