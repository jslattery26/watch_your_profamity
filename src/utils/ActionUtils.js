import { getInput as _getInput } from '@actions/core'

export function getInputAsArray(name, options) {
  return getInput(name, options)
    .split('\n')
    .map((s) => s.trim())
    .filter((x) => x !== '')
}
export function getInput(name, options = {}) {
  let input = _getInput(name, options)

  if (input) {
    input = input.trim()
  }

  return input
}
