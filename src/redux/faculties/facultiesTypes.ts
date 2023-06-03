import { GroupType } from "../group/groupTypes"

export type FacultyType = {
  _id: string
  name: string
  shortName: string
  specialties: SpecialtyType[]
}

export type SpecialtyType = {
  _id: string
  facultieId: string
  name: string
  shortName: string
  groups: GroupType[]
}

