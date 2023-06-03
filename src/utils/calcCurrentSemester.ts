export const calcCurrentSemester = (showedSemester: string, yearOfAdmission: string, selectedSemester: string) => {
  const difference = Number(showedSemester) - Number(yearOfAdmission)

  if (difference === 0) {
    return selectedSemester === '1' ? '1' : '2'
  }

  if (difference === 1) {
    return selectedSemester === '1' ? '3' : '4'
  }

  if (difference === 2) {
    return selectedSemester === '1' ? '5' : '6'
  }

  if (difference === 3) {
    return selectedSemester === '1' ? '7' : '8'
  }
}
