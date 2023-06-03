import { GroupLoadType } from '../group/groupTypes'

export type StreamsType = {
  _id: string
  name: string
  components: StreamsComponentsType[]
  details: StreamsDetailsType[]
}

export type StreamsComponentsType = {
  _id: string
  name: string
  groupId: string
  groupLoad: GroupLoadType
}

export type StreamsDetailsType = {
  _id: string
  name: string
  semester: string
  type: string
  subgroupNumber: number
}
