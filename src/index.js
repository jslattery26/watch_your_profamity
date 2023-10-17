import { info, setFailed, setOutput } from '@actions/core'
import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity'
import { getInput, getInputAsArray } from './utils/ActionUtils'
import { split } from './utils/ArrayUtils'
import {
  isWorkspaceEmpty,
  readContent,
  searchFiles,
  writeContent,
} from './utils/FileUtils'

async function run() {
  try {
    if (isWorkspaceEmpty()) {
      throw new Error('Workspace is empty')
    }

    const matcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    })

    let replace = getInput('replace', { required: false })
    if (!replace) {
      replace = 'cute'
    }
    let include = getInputAsArray('include', { required: false })
    let exclude = getInputAsArray('exclude', { required: false })

    include = split(include, ',')
    exclude = split(exclude, ',')

    info(`include: ${JSON.stringify(include)}`)
    info(`exclude: ${JSON.stringify(exclude)}`)
    info(`replace: ${replace}`)

    const files = searchFiles(include, exclude)

    info(`Found ${files.length} file(s). Checking them out:`)

    let modifiedFiles = 0
    const fudgeStrategy = () => replace
    const censor = new TextCensor().setStrategy(fudgeStrategy)

    files.forEach((file) => {
      info(`Processing: ${file}`)

      let content = readContent(file)

      // const matches = matcher.getAllMatches(input)
      // const newContent = censor.applyTo(input, matches)
      var Filter = require('bad-words')
      var customFilter = new Filter({ placeHolder: 'x' })
      const newContent = customFilter.clean(input)
      info(`newContent: ${newContent}`)
      if (content != newContent) {
        modifiedFiles++
      }

      writeContent(file, newContent)
    })

    info('Done. All files checked')

    setOutput('modifiedFiles', modifiedFiles)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
