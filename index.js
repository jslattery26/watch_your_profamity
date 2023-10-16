import { getInput, setFailed, setOutput } from '@actions/core'

try {
  const source = getInput('source')
  const find = getInput('find')
  const replace = getInput('replace')
  const replaceAllInput = getInput('replaceAll')
  const shouldReplaceAll = replaceAllInput ? replaceAllInput == 'true' : false
  const resultValue = shouldReplaceAll
    ? source.replaceAll(find, replace)
    : source.replace(find, replace)
  setOutput('value', resultValue)
} catch (error) {
  setFailed(error.message)
}
