import { info, setFailed, setOutput } from '@actions/core'
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from 'obscenity'
import { getInput, getInputAsArray } from './utils/ActionUtils.js'
import { split } from './utils/ArrayUtils.js'
import { readContent, searchFiles, writeContent } from './utils/FileUtils.js'

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

      const matches = matcher.getAllMatches(content)
      const chicken = censor.applyTo(content, matches)
      info('Found some swear wordsss!!!!! BUH OH! UH OH!!!!!')
      if (matches.length > 0) {
        info('You said: ' + matches.map((match) => content.substring(match.startIndex, match.endIndex + 1)).join(', ') + '!!!')
        if (content != chicken) {
          modifiedFiles++
          info(`newContent: ${chicken}`)
          writeContent(file, chicken)
        }
      }
    })

    info('Done. All files checked')

    setOutput('modifiedFiles', modifiedFiles)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
