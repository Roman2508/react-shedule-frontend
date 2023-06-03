export type BuildingsType = {
  _id: number
  name: string
  auditoriums: AuditoriumsType[]
}

export type AuditoriumsType = {
  _id: number
  name: string
  buildingId: string
  type: string
  seatsNumber: number
}
