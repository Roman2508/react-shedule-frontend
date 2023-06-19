import React from 'react'

export const useLocalStorage = (storageKey: string) => {
  const data = window.localStorage.getItem(storageKey)
  return data
}
