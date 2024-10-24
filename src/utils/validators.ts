export const isEmpty = (data: any) => {
  if (data instanceof Array) {
    return data.length == 0
  }

  if (data instanceof Object) {
    return Object.keys(data).length == 0
  }

  return !data
}

export const hasRequiredFields = (fields: string[], data: Object) => {
  if (isEmpty(data)) {
    return false
  }

  const keys = Object.keys(data)

  for (let field of fields) {

    if (!keys.includes(field)) {
      return false
    }

    if (isEmpty(data[field])) {
      return false
    }
  }

  return true
}
