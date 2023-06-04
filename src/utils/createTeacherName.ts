import { DistributedLoadSubjectsType } from '../redux/distributedLoad/distributedLoadTypes'

export const createTeacherName = (load: DistributedLoadSubjectsType, currentSubjectType: string) => {
  // @ts-ignore
  const teacher = load[currentSubjectType]?.teacher

  if (!teacher) return { teacherName: '-' }

  const teacherName = `${teacher.lastName} ${teacher.firstName[0]}.${teacher.middleName[0]}`

  return { teacherName }
}
