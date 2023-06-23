// export interface EducationalPlansGroupType {
//   _id: number // ????????????????
//   name: string // ????????????????
//   plans: EducationalPlanGroupType[] // ????????????????

// } // ????????????????

export interface EducationalPlanGroupsType {
  name: string
  plans: EducationalPlanType[]
  _id: number
  createdAt: string
  updatedAt: string
}

// export interface EducationalPlanGroupType {
//   _id: number
//   name: string
//   categoryId: number
// }

export interface EducationalPlanType {
  _id: number
  categoryId: number
  name: string
  subjects: EducationalPlanSubjectTypes[]
  createdAt: string
  updatedAt: string
}
// export interface EducationalPlanType {
//   _id: string
//   categoryId: string
//   name: string
//   subjects: EducationalPlanSubjectTypes[]
// }

// export interface EducationalPlanSubjectType {
//   _id: number
//   name: string
//   totalHour: number
//   semester_1: SubjectType | {}
//   semester_2: SubjectType | {}
//   semester_3: SubjectType | {}
//   semester_4: SubjectType | {}
//   semester_5: SubjectType | {}
//   semester_6: SubjectType | {}
//   semester_7: SubjectType | {}
//   semester_8: SubjectType | {}
//   semester_9: SubjectType | {}
//   semester_10: SubjectType | {}
//   semester_11: SubjectType | {}
//   semester_12: SubjectType | {}
// }

export interface EducationalPlanSubjectTypes {
  _id: string
  planId: string
  name: string
  departmentId: string
  totalHour: 0
  semester_1: SubjectType | null
  semester_2: SubjectType | null
  semester_3: SubjectType | null
  semester_4: SubjectType | null
  semester_5: SubjectType | null
  semester_6: SubjectType | null
  semester_7: SubjectType | null
  semester_8: SubjectType | null
  semester_9: SubjectType | null
  semester_10: SubjectType | null
  semester_11: SubjectType | null
  semester_12: SubjectType | null
  createdAt: string
  updatedAt: string
  // __v: 0
}

export interface SubjectType {
  lectures: number
  practical: number
  laboratory: number
  seminars: number
  exams: number
  zalik: number
  termPaper: boolean
  individual: number
  inPlan: number
}
