interface PropsType {
  selectedItems: string[]
  id: string
  name: string
  divisionName: string
  divisionId: string
}

const createSelectedSchedule = (filterType: PropsType, type: string) => {
  if (type === 'groupId') {
    const selectedSchedule = {
      selectedFacultieGroups: filterType.selectedItems,
      groupId: filterType.id,
      groupName: filterType.name,
      facultieName: filterType.divisionName,
      facultieId: filterType.divisionId,
    }

    return selectedSchedule
  } else if (type === 'teacher') {
    const selectedSchedule = {
      selectedDepartmentTeachers: filterType.selectedItems,
      teacherId: filterType.id,
      teacherName: filterType.name,
      departmentName: filterType.divisionName,
      departmentId: filterType.divisionId,
    }

    return selectedSchedule
  } /* (type === 'auditory')  */ else {
    const selectedSchedule = {
      selectedBuildingAuditories: filterType.selectedItems,
      auditoryId: filterType.id,
      auditoryName: filterType.name,
      buildingName: filterType.divisionName,
      buildingId: filterType.divisionId,
    }

    return selectedSchedule
  }
}

export default createSelectedSchedule
