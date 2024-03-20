export function split(array, separator = ',') {
  let result = []

  array.forEach((e) => {
    result = [...result, ...splitFromString(e, separator)]
  })

  return result
}

export function splitFromString(str, separator = ',') {
  return str
    .split(separator)
    .map((s) => s.trim())
    .filter((x) => x !== '')
}
