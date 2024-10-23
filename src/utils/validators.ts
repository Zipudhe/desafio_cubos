export const isEmtpy = (data: any) => {
  if (data instanceof Array) {
    return data.length == 0
  }

  if (data instanceof Object) {
    return Object.keys(data).length == 0
  }

  return !!data
}

const hasRequiredFields = (fields: string[], data: Object) => {
  if (isEmtpy(data)) {
    return false
  }

  const keys = Object.keys(data)

  for (let key of keys) {
    if (!(key in fields)) {
      return false
    }
  }

  return true
}
