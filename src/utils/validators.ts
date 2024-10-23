export const isEmtpy = (data: any) => {
  if (data instanceof Array) {
    return data.length == 0
  }

  if (data instanceof Object) {
    return Object.keys(data).length == 0
  }

  return !!data
}

export const hasRequiredFields = (fields: string[], data: Object) => {
  if (isEmtpy(data)) {
    return false
  }

  const keys = Object.keys(data)

  for (let key of keys) {
    if (!fields.includes(key)) {
      return false
    }
  }

  return true
}
