export type DepartmentType = {
  _id: number
  name: string
  departmentNumber: number
  teachers: TeacherType[]
}

export type TeacherType = {
  _id: number
  firstName: string
  middleName: string
  lastName: string
  departmentId: number
  formOfWork: string
}
