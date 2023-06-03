import { GroupLoadItemType, SubgroupsType } from '../redux/group/groupTypes'

type DetailsType = {
  lectures: boolean
  practical: boolean
  laboratory: boolean
  seminars: boolean
  exams: boolean
}

export type ListSubjectType = {
  _id: string
  name: string
  semester: string
  lectures: number
  practical: number
  laboratory: number
  seminars: number
  exams: number
  inPlan: number
  zalik: number
  individual: number
  termPaper: boolean
  group?: string
  groupId?: string
  details?: DetailsType
  subgroupNumber?: number | null
  subgroupInfo?: SubgroupsType | any
}

const createListOfSubjects = (data: GroupLoadItemType[]) => {
  const newData = data.map((el) => {
    const keys = Object.keys(el).filter((k) => k.includes('semester'))

    const restData = keys.map((k) => {
      // @ts-ignore
      if (el[k] !== null) {
        // @ts-ignore
        return { ...el[k], semester: k.split('_')[1], name: el.name, group: el.groupId }
      }
    })

    const filtredData = restData.filter((d) => d !== undefined)

    return filtredData
  })

  const result: ListSubjectType[] = []

  newData.forEach((el) => result.push(...el))

  return result
}

export default createListOfSubjects
