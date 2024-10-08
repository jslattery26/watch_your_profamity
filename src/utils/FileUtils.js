import { info } from '@actions/core'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'
import { join } from 'path'
import { env } from 'process'

export function isWorkspaceEmpty() {
  return isEmpty(getWorkspacePath())
}

export function getWorkspacePath() {
  return env['GITHUB_WORKSPACE'] || ''
}

export function exists(fileOrPath) {
  return existsSync(fileOrPath)
}

export function searchFiles(pattern = [], ignore = []) {
  pattern = Array.isArray(pattern) ? pattern : [pattern]
  ignore = Array.isArray(ignore) ? ignore : [ignore]
  const path = getWorkspacePath()
  info('Searching for files in ' + path)
  const options = {
    cwd: path,
    ignore: ignore,
  }

  try {
    return glob.sync('*', options)
  } catch (e) {
    console.log(e)
    return glob.sync(pattern, options)
  }
}

export function isEmpty(path) {
  if (!exists(path)) {
    throw new Error(`${path} does not exist`)
  }

  return readdirSync(path).length === 0
}

export function readContent(file, encoding = 'utf-8') {
  const filePath = join(getWorkspacePath(), file)

  return readFileSync(filePath, { encoding })
}

export function writeContent(file, content, encoding = 'utf-8') {
  const filePath = join(getWorkspacePath(), file)

  return writeFileSync(filePath, content, encoding)
}
